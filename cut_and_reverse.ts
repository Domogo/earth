import { promises as fs } from 'node:fs';
import sharp from 'sharp';

async function main() {
  const imagePath = 'img/2025-01-19/20250119010436.png';
  const numColumns = 12;

  try {
    await fs.mkdir('test', { recursive: true }); 

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
      const columnMeta = await sharp(columnBuffer).metadata();

      // Create a new image with transparent background
      const newColumn = await sharp({
        create: {
          width: width,
          height: height,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .composite([{ input: columnBuffer, left: left, top: 0 }])
        .png() 
        .toBuffer();

      await sharp(newColumn).png().toFile(`test/column_${i + 1}.png`); 
      columns.push(newColumn);
      console.log(`Column ${i + 1}: left=${left}, width=${columnMeta.width}, height=${columnMeta.height}, buffer size: ${columnBuffer.length}`);
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
    for (let i = 0; i < reversedColumns.length; i++) {
      const column = reversedColumns[i];
      const columnMeta = await sharp(column).metadata();
      const colWidth = columnMeta.width;
      console.log(`Compositing column ${i+1}, currentLeft: ${currentLeft}, columnWidth: ${colWidth}, buffer size: ${column.length}`);
      if (colWidth) { 
        newImage.composite([{ input: column, left: currentLeft, top: 0 }]);
        currentLeft += colWidth;
      }
    }

    await newImage.png().toFile('reversed_image.png'); 
    console.log('Image processed successfully!');
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

main();