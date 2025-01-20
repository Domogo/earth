import { promises as fs } from 'node:fs';
import sharp from 'sharp';

async function main() {
  const imagePath = 'img/2025-01-19/20250119010436.png';
  const numColumns = 12;

  try {
    const image = await sharp(imagePath).metadata();
    const width = image.width!;
    const height = image.height!;
    const columnWidth = Math.floor(width / numColumns);
    const remainder = width % numColumns;

    console.log(`Image dimensions: width=${width}, height=${height}`);
    console.log(`Column width: ${columnWidth}`);

    const columns = [];
    for (let i = 0; i < numColumns; i++) {
      const left = i * columnWidth + (i < remainder ? i : remainder);
      const columnBuffer = await sharp(imagePath).extract({ left, top: 0, width: columnWidth, height }).toBuffer();
      const columnMeta = await sharp(columnBuffer).metadata();
      columns.push(columnBuffer);
      console.log(`Column ${i + 1}: left=${left}, width=${columnMeta.width}, height=${columnMeta.height}`);
    }

    const reversedColumns = columns.reverse();

    const newImage = await sharp({
      create: {
        width: width,
        height: height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    });

    let currentLeft = 0;
    for (const column of reversedColumns) {
      newImage.composite([{ input: column, left: currentLeft, top: 0 }]);
      currentLeft += columnWidth;
    }

    await newImage.toFile('reversed_image.png');
    console.log('Image processed successfully!');
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

main();