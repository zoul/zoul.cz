import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import Markdoc from "@markdoc/markdoc";
import matter from "gray-matter";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import { optional, record, string } from "typescript-json-decoder";
import {
  collectHeadings,
  type HeadingMarker,
  markdownConfig,
} from "@/src/markdoc";
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
  const content = Markdoc.transform(ast, markdownConfig);
  const headings = collectHeadings(content);
  return Markdoc.renderers.react(content, React, {
    components: {
      TableOfContents: TableOfContents(headings),
      Heading,
    },
  });
}

//
// Content Render
//

/** Custom heading component that generates an anchor to link to */
const Heading = ({
  id,
  children,
  level,
}: {
  children: React.ReactNode;
  id: string | undefined;
  level: number;
}) => {
  // biome-ignore lint/suspicious/noExplicitAny: keyof JSX.IntrinsicElements no longer works, whatever
  const Tag = `h${level}` as any;
  return (
    <Tag id={id}>
      {children}
      {id && level > 1 && (
        <a href={`#${id}`} className="heading-anchor">
          #
        </a>
      )}
    </Tag>
  );
};

const TableOfContents = (headingMarkers: Array<HeadingMarker>) => () => (
  <ol className="table-of-contents">
    {headingMarkers
      .filter(({ level }) => level > 1)
      .map((marker) => (
        <li key={marker.id}>
          <a href={`#${marker.id}`}>{marker.title}</a>
        </li>
      ))}
  </ol>
);

//
// Data Generation
//

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

//
// Helpers
//

const slurp = (path: string) => readFile(path, "utf-8");

const postPathForSlug = (slug: string) =>
  join(process.cwd(), "content", `${slug}.md`);

const decodeFrontmatter = record({
  title: string,
  description: optional(string),
  image: optional(string),
});
