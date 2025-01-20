import { exec } from "node:child_process";
import { readdir } from "node:fs/promises";
import { resolve } from "node:path";

const dateString = new Date().toLocaleDateString('en-CA').replace(/\//g, "-");
const imgDir = resolve(`img/${dateString}`);
const outputGif = resolve(`img/${dateString}/${dateString}.gif`);

const main = async () => {
    try {
        const files = await readdir(imgDir);
        const pngFiles = files.filter(file => file.endsWith(".png")).sort();
        const inputFiles = pngFiles.map(file => resolve(imgDir, file)).join(" ");

        await new Promise((resolve, reject) => {
            exec(`gifsicle --delay=50 --loop --optimize=3 ${inputFiles} > ${outputGif}`, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else if (stderr) {
                    reject(new Error(stderr));
                } else {
                    resolve(stdout);
                }
            });
        });
        console.log(`GIF created at ${outputGif}`);
    } catch (error: any) {
        console.error("Error generating GIF:", error);
    }
};

main();