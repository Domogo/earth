import { cut_and_reverse } from './cut_and_reverse.ts';
import { rotateImage } from './rotate.ts';
import sharp from 'sharp';

async function main() {
  try {
    const gridImagePath = 'img/2025-01-19/grid/output.png';
    const gridImage = await sharp(gridImagePath);
    const reversedImage = await cut_and_reverse(gridImage, 16);
    const rotatedImage = await rotateImage(reversedImage);
    const finalImage = await cut_and_reverse(rotatedImage, 16);

    console.log("final")
    await finalImage.png().toFile('collage.png');
    console.log('Collage created successfully!');
  } catch (error) {
    console.error('Error creating collage:', error);
  }
}

main();