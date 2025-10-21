import { execSync } from "node:child_process";

const buildTime = new Date().toISOString();

let commitHash = "unknown";
try {
  commitHash = execSync("git rev-parse --short HEAD").toString().trim();
} catch (error) {
  console.warn("[Eleventy] Unable to read git commit hash:", error);
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addFilter("date", (value, format = "yyyy-MM-dd") => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.valueOf())) return "";

    const tokens = {
      yyyy: String(date.getFullYear()),
      MM: String(date.getMonth() + 1).padStart(2, "0"),
      dd: String(date.getDate()).padStart(2, "0"),
      HH: String(date.getHours()).padStart(2, "0"),
      mm: String(date.getMinutes()).padStart(2, "0"),
      ss: String(date.getSeconds()).padStart(2, "0"),
      fff: String(date.getMilliseconds()).padStart(3, "0"),
    };

    const orderedTokens = Object.keys(tokens).sort((a, b) => b.length - a.length);

    let result = format;
    orderedTokens.forEach((token) => {
      result = result.replace(new RegExp(token, "g"), tokens[token]);
    });

    return result;
  });

  eleventyConfig.addFilter("excerpt", (content, marker = "<!--more-->") => {
    if (!content) return "";
    const markerIndex = content.indexOf(marker);
    const raw = markerIndex === -1 ? content : content.slice(0, markerIndex);
    return raw.trim();
  });

  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const reserved = new Set(["all", "post", "posts"]);
    const tags = new Set();

    collectionApi.getAll().forEach((item) => {
      (item.data.tags || []).forEach((tag) => {
        if (!reserved.has(tag)) {
          tags.add(tag);
        }
      });
    });

    return Array.from(tags).sort((a, b) =>
      a.localeCompare(b, "zh-Hans", { sensitivity: "base" }),
    );
  });

  eleventyConfig.addGlobalData("buildTime", buildTime);
  eleventyConfig.addGlobalData("commitHash", commitHash);

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "output",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
