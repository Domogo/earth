import { cut_and_reverse } from './cut_and_reverse.ts';
import { rotateImage } from './rotate.ts';
import sharp from 'sharp';

async function main() {
  try {
    const gridImagePath = 'img/2025-01-19/grid/output.png';
    const gridImage = await sharp(gridImagePath);
    const reversedImage = await cut_and_reverse(gridImage, 16);
    await reversedImage.toFile('collage_1.png');
    
    reversedImage.rotate(90).png()
    await reversedImage.toFile('collage_2.png');

    console.log('Rotated image created');
    const finalImage = await cut_and_reverse(reversedImage, 16);
    console.log('Final image created');
    await finalImage.toFile('collage.png');
    console.log('Collage created successfully!');
  } catch (error) {
    console.error('Error creating collage:', error);
  }
}

main();