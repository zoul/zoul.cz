import { readFile } from "node:fs/promises";
import { join } from "node:path";
import Markdoc from "@markdoc/markdoc";
import React from "react";
import { getFilesRecursively } from "@/src/utils";

type Params = {
  slug: string;
};

type Props = {
  params: Promise<Params>;
};

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const postPath = join(process.cwd(), "content", `${slug}.md`);
  const source = await readFile(postPath, "utf-8");
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
