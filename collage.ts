import { cut_and_reverse } from './cut_and_reverse.ts';
import sharp from 'sharp';

async function main() {
  try {
    // const gridImagePath = 'img/2025-01-19/grid/output.png';
    const gridImagePath = 'img/2025-01-19/20250119190500.png'
    const gridImage = await sharp(gridImagePath);
    const reversedImageBuffer = await (await cut_and_reverse(gridImage, 16)).toBuffer();
    const reversedImage = sharp(reversedImageBuffer);
    const rotatedImage = await reversedImage.rotate(90).png();
    const finalImage = await cut_and_reverse(rotatedImage, 16);
    console.log('Final image created');
    await finalImage.toFile('collage_single.png');
    console.log('Collage created successfully!');
  } catch (error) {
    console.error('Error creating collage:', error);
  }
}

main();