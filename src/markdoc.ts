import {
  type Config,
  type Node,
  type RenderableTreeNode,
  type Schema,
  Tag,
} from "@markdoc/markdoc";
import { slugify } from "./utils";

/** Custom heading node that auto-generates heading IDs */
export const heading: Schema = {
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

export const markdownConfig: Config = {
  nodes: {
    heading,
  },
};
