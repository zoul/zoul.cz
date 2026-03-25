import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import Markdoc from "@markdoc/markdoc";
import { image } from "@markdoc/markdoc/dist/src/schema";
import matter from "gray-matter";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import { optional, record, string } from "typescript-json-decoder";
import { getFilesRecursively } from "@/src/utils";

type Params = {
  slug: string;
};

type Props = {
  params: Promise<Params>;
};

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const path = postPathForSlug(slug);
  if (!existsSync(path)) {
    notFound();
  }
  const source = await slurp(path);
  const ast = Markdoc.parse(source);
  const content = Markdoc.transform(ast);
  return Markdoc.renderers.react(content, React);
}

export async function generateStaticParams(): Promise<Params[]> {
  const toSlug = (path: string) =>
    path
      // Strip everything up to last path separator including
      .replace(/^.*[\\/]/, "")
      // Strip file suffix
      .replace(/\.md$/, "");
  const paths = await getFilesRecursively("content");
  return paths.map(toSlug).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const path = postPathForSlug(slug);
  if (!existsSync(path)) {
    notFound();
  }
  const source = await slurp(path);
  const { data } = matter(source);
  const { title, image, description } = decodeFrontmatter(data);
  return {
    title,
    description,
    openGraph: {
      title,
      images: image,
    },
  };
}

const slurp = (path: string) => readFile(path, "utf-8");

const postPathForSlug = (slug: string) =>
  join(process.cwd(), "content", `${slug}.md`);

const decodeFrontmatter = record({
  title: string,
  description: optional(string),
  image: optional(string),
});
