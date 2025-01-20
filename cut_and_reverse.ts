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

    console.log(`Image dimensions: width=${width}, height=${height}`);
    console.log(`Column width: ${columnWidth}`);

    const columns = [];
    for (let i = 0; i < numColumns; i++) {
      const left = i * columnWidth;
      const w = columnWidth;
      const columnBuffer = await sharp(imagePath)
        .extract({ left, top: 0, width: w, height })
        .toBuffer();
      columns.push(columnBuffer);
    }

    const newImage = await sharp({
      create: {
        width: width,
        height: height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    });

    let currentLeft = 0;
    let composites = []
    for (let i = 0; i < columns.length; i++) { 
      const column = columns[numColumns - 1 - i];
      const columnMeta = await sharp(column).metadata();
      const colWidth = columnMeta.width;
      console.log(`Compositing column ${i+1}, currentLeft: ${currentLeft}, columnWidth: ${colWidth}, buffer size: ${column.length}`);
      if (colWidth) { 
        composites.push({ input: column, left: currentLeft, top: 0 });
        currentLeft += colWidth;
      }
    }


    await newImage.composite(composites).png().toFile('img/2025-01-19/reversed/reversed_image.png'); 
    console.log('Image processed successfully!');
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

main();