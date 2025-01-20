import { writeFile, mkdir } from "node:fs/promises";
import axios from "axios";

const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";

const getDateString = (date: Date = new Date()): string => {
  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, "0");
  const day = String(yesterday.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const dateString = getDateString();
const directory = `img/${dateString}`;

const fetchIdentifiers = async (date: string): Promise<string[]> => {
  const url = `https://api.nasa.gov/EPIC/api/natural/date/${date}?api_key=${apiKey}`;
  try {
    const response = await axios.get(url);
    return response.data.map((item: { identifier: string }) => item.identifier);
  } catch (error: any) {
    console.error(`Error fetching identifiers: ${error}`);
    return [];
  }
};

const fetchImage = async (identifier: string, date: string): Promise<Uint8Array | null> => {
  const [year, month, day] = date.split("-");
  const url = `https://api.nasa.gov/EPIC/archive/natural/${year}/${month}/${day}/png/epic_1b_${identifier}.png?api_key=${apiKey}`;
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return new Uint8Array(response.data);
  } catch (error: any) {
    console.error(`Error fetching image for identifier ${identifier}: ${error}`);
    return null;
  }
};

const main = async () => {
  try {
    await mkdir(directory, { recursive: true });
    const identifiers = await fetchIdentifiers(dateString);
    await Promise.all(identifiers.map(async (identifier) => {
      const buffer = await fetchImage(identifier, dateString);
      if (buffer) {
        const filePath = `${directory}/${identifier}.png`;
        await writeFile(filePath, buffer);
        console.log(`Image saved to ${filePath}`);
      }
    }));
  } catch (error: any) {
    console.error("Error:", error);
  }
};

main();