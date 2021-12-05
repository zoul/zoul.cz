import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { getPhotosById, Photo } from "./photos";

export interface Post {
  slug: string;
  title: string;
  content: string;
  photos: Photo[];
}

const postsDirectory = join(process.cwd(), "posts");

export function getPostFilenames(): string[] {
  return fs.readdirSync(postsDirectory);
}

export function getPostByFilename(fileName: string): Post {
  const slug = fileName.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  if (data.album_id) {
    data.photos = getPhotosById(data.album_id);
  }

  return {
    slug,
    content,
    title: data.title || "Unnamed",
    photos: data.photos || [],
  };
}

export function getAllPosts() {
  return getPostFilenames().map(getPostByFilename);
}
