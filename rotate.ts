import sharp from 'sharp';

async function rotateImage() {
  try {
    const rotatedImage = await sharp('img/2025-01-19/reversed/reversed_image.png')
      .rotate(90)
      .toFile('img/2025-01-19/rotated/output.png');
    console.log('Image rotated and saved successfully!');
  } catch (error) {
    console.error('Error rotating image:', error);
  }
}

rotateImage();
rotateImage();