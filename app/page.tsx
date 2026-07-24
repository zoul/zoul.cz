import type { Metadata } from "next";
import PostPage, { generateMetadata as generatePostMetadata } from "./[slug]/page";

/**
 * Home page
 *
 * The home page is just the `index` post. We could do this better
 * with an internal rewrite, but that’s not available for static site
 * exports.
 */
export default function Home() {
  return PostPage({
    params: Promise.resolve({
      slug: "index",
    }),
  });
}

export function generateMetadata(): Promise<Metadata> {
  return generatePostMetadata({
    params: Promise.resolve({
      slug: "index",
    }),
  });
}
