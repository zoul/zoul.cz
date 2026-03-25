import {
  type Config,
  type Node,
  type RenderableTreeNode,
  type Schema,
  Tag,
} from "@markdoc/markdoc";
import { slugify } from "./utils";

/** Custom heading node that auto-generates heading IDs */
const heading: Schema = {
  children: ["inline"],
  attributes: {
    id: { type: String },
    level: { type: Number, required: true, default: 1 },
  },
  transform(node: Node, config: Config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);
    const id = generateID(children, attributes);
    return new Tag("Heading", { ...attributes, id }, children);
  },
};

const table_of_contents: Schema = {
  render: "TableOfContents",
  selfClosing: true,
};

function generateID(
  children: RenderableTreeNode[],
  attributes: Record<string, unknown>,
) {
  const stringify = (node: RenderableTreeNode): string => {
    if (Tag.isTag(node)) {
      return node.children.map(stringify).join(" ");
    } else {
      return `${node}`;
    }
  };
  if (attributes.id && typeof attributes.id === "string") {
    return attributes.id;
  }
  const id = children.map(stringify).join(" ");
  return slugify(id);
}

export type HeadingMarker = {
  level: number;
  title: string;
  id: string;
};

export function collectHeadings(
  node: RenderableTreeNode,
  sections: Array<HeadingMarker> = [],
) {
  if (Tag.isTag(node)) {
    if (node.name === "Heading") {
      const title = node.children[0];
      if (typeof title === "string") {
        sections.push({
          level: node.attributes.level,
          id: node.attributes.id,
          title,
        });
      }
    }
    if (node.children) {
      for (const child of node.children) {
        collectHeadings(child, sections);
      }
    }
  }

  return sections;
}

export const markdownConfig: Config = {
  nodes: {
    heading,
  },
  tags: {
    table_of_contents,
  },
};
