export default {
  eleventyComputed: {
    redirectUrl: ({ collections }) => {
      const tags = collections?.tagList ?? [];
      const first = tags.find((tag) => tag !== "Special");
      return first ? `/tags/${first}/` : null;
    },
  },
};
