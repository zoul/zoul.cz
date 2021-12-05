import fs from "fs";
import { join } from "path";
import sizeOf from "image-size";

export interface Photo {
  absoluteUrl: string;
  width: number;
  height: number;
}

const rootFolder = join(process.cwd(), "public/photos");

export function getPhotosById(id: string): Photo[] {
  const albumFolder = join(rootFolder, id);
  const files = fs.readdirSync(albumFolder);
  return files.map((name) => {
    const path = join(albumFolder, name);
    const size = sizeOf(path);
    console.debug(
      `Found image ${id}/${name}, dimensions ${size.width}✕${size.height} px.`
    );
    return {
      absoluteUrl: `/photos/${id}/${name}`,
      width: size.width || 0,
      height: size.height || 0,
    };
  });
}
