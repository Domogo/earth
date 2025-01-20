import sharp from 'sharp';

export async function cut_and_reverse(inputImage: sharp.Sharp, numColumns: number): Promise<sharp.Sharp> {
  const image = await inputImage.metadata();
  const width = image.width!;

  const height = image.height!;
  const columnWidth = Math.floor(width / numColumns);

  console.log(`Image dimensions: width=${width}, height=${height}`);
  console.log(`Column width: ${columnWidth}`);

  const columns = [];
  for (let i = 0; i < numColumns; i++) {
    const left = i * columnWidth;
    const columnBuffer = await inputImage
      .clone()
      .extract({ left, top: 0, width: columnWidth, height })
      .toBuffer();
    columns.push(columnBuffer);
  }

  const newImage = sharp({
    create: {
      width: columnWidth * numColumns,
      height: height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  });

  let currentLeft = 0;
  let composites = [];
  for (let i = 0; i < columns.length; i++) {
    const column = columns[numColumns - 1 - i];
    composites.push({ input: column, left: currentLeft, top: 0 });
    currentLeft += columnWidth;
  }

  return newImage.composite(composites).png();
}