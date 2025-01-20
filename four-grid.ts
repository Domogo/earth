import { promises as fs } from 'node:fs';
import sharp from 'sharp';
import path from 'path';

async function main() {
  const images = [
    'img/2025-01-19/20250119010436.png',
    'img/2025-01-19/20250119025238.png',
    'img/2025-01-19/20250119044041.png',
    'img/2025-01-19/20250119062845.png',
  ];

  try {
    const imageBuffers = await Promise.all(
      images.map(async (imagePath) => {
        const buffer = await fs.readFile(imagePath);
        const image = sharp(buffer);
        const metadata = await image.metadata();
        if (!metadata.format) {
          throw new Error(`Unsupported image format for ${imagePath}`);
        }
        return image;
      })
    );

    const metadata = await Promise.all(imageBuffers.map((img) => img.metadata()));

    if (!metadata[0] || !metadata[1] || !metadata[2] || !metadata[3]) {
      console.error('Error: Could not get metadata for images.');
      return;
    }

    const width = metadata[0].width;
    const height = metadata[0].height;

    if (width === undefined || height === undefined) {
      console.error("Error: Image metadata is missing width or height.");
      return;
    }

    const date = path.basename(path.dirname(images[0]));
    const outputPath = `img/${date}/grid/output.png`;
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    await sharp({
      create: {
        width: width * 2,
        height: height * 2,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([
        { input: await imageBuffers[0].toBuffer(), top: 0, left: 0 },
        { input: await imageBuffers[1].toBuffer(), top: 0, left: width },
        { input: await imageBuffers[2].toBuffer(), top: height, left: 0 },
        { input: await imageBuffers[3].toBuffer(), top: height, left: width },
      ])
      .toFile(outputPath);

    console.log('Image grid created successfully!');
  } catch (error) {
    console.error('Error creating image grid:', error);
  }
}

main().catch(console.error);