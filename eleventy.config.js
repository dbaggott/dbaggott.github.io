import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import footnote from "markdown-it-footnote";

import site from "./src/_data/site.json" with { type: "json" };

export const config = {
  dir: { input: "src", output: "dist" },
  // Posts are prose, so a `{{` in one is text rather than a template tag.
  markdownTemplateEngine: false,
};

// Wraps each image in a link to itself, which js/post.js opens in a lightbox;
// without the script, the link opens the image. An image that is already a
// link, in Markdown or HTML, keeps its own.
function expandableImages(md) {
  const render = md.renderer.rules.image;
  const opens = (token) =>
    token.type === "link_open" || (token.type === "html_inline" && /^<a\b/i.test(token.content));
  const closes = (token) =>
    token.type === "link_close" || (token.type === "html_inline" && /^<\/a\s*>/i.test(token.content));

  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const img = render(tokens, idx, options, env, self);
    let depth = 0;
    for (let i = idx - 1; i >= 0; i--) {
      if (closes(tokens[i])) depth--;
      else if (opens(tokens[i]) && ++depth > 0) return img;
    }
    const src = md.utils.escapeHtml(tokens[idx].attrGet("src"));
    return `<a class="expand" href="${src}">${img}</a>`;
  };
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/*.{ico,png}");
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-opsz-normal.woff2": "fonts/source-serif-4.woff2",
    "node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-opsz-italic.woff2": "fonts/source-serif-4-italic.woff2",
  });

  eleventyConfig.addGlobalData("buildYear", new Date().getUTCFullYear());

  eleventyConfig.amendLibrary("md", (md) => md.use(footnote).use(expandableImages));
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    collection: { name: "writings" },
    metadata: {
      title: `${site.writingsTitle} · ${site.author}`,
      subtitle: site.tagline,
      language: "en",
      base: site.url,
      author: { name: site.author },
    },
  });

  eleventyConfig.addCollection("writingsNewestFirst", (collections) =>
    collections.getFilteredByTag("writings").reverse(),
  );

  // Dates in front matter are calendar days, which Eleventy reads as UTC
  // midnight; formatting them in UTC keeps the day the post was dated.
  eleventyConfig.addFilter("longDate", (date) =>
    date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }),
  );
  eleventyConfig.addFilter("isoDate", (date) => date.toISOString().slice(0, 10));
  eleventyConfig.addFilter("year", (date) => date.getUTCFullYear());
}
