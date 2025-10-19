export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/styles.css");

  eleventyConfig.addFilter("date", (value, format = "yyyy-MM-dd") => {
    if (!value) {
      return "";
    }

    const date = new Date(value);
    if (Number.isNaN(date.valueOf())) {
      return "";
    }

    const yyyy = String(date.getFullYear());
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    if (format === "yyyy-MM-dd") {
      return `${yyyy}-${MM}-${dd}`;
    }

    // Fall back to ISO string or simple tokens
    if (format === "yyyy") return yyyy;
    if (format === "MM") return MM;
    if (format === "dd") return dd;

    return date.toISOString();
  });

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
