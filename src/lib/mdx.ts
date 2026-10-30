import remarkGfm from "remark-gfm";

/** Parse Markdown tables before applying the shared semantic MDX components. */
export const mdxOptions = {
  remarkPlugins: [remarkGfm],
};
