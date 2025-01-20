import sharp from 'sharp';

export async function rotateImage(image: sharp.Sharp): Promise<sharp.Sharp> {
  try {
    return await image.rotate(90).png();
  } catch (error) {
    console.error('Error rotating image:', error);
    throw error;
  }
}
