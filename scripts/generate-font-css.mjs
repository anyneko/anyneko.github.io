import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { globby } from "globby";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const fontPackageRoot = path.join(
  projectRoot,
  "node_modules",
  "@callmebill",
  "lxgw-wenkai-web",
);

const sourceDir = path.join(projectRoot, "src");
const outputDir = path.join(sourceDir, "assets", "fonts");
const outputFontDir = path.join(outputDir, "lxgw");
const outputCssPath = path.join(outputDir, "lxgw.css");

const fonts = [
  { dir: "lxgwwenkai-light", weight: 300 },
  { dir: "lxgwwenkai-regular", weight: 400 },
  { dir: "lxgwwenkai-medium", weight: 500 },
];

const fallbackCharacters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" +
  " ，。、！？；：“”‘’（）—…·《》〈〉「」『』【】·、〃\\" +
  "0123456789-_=+/*&^%$#@!~`|;:'\",.<>?「」『』（）［］｛｝" +
  "　　" +
  "\n\r\t";

function addCharacterToSet(charSet, char) {
  const code = char.codePointAt(0);
  if (typeof code === "number") {
    charSet.add(code);
  }
}

function parseUnicodeToken(token) {
  if (!token.startsWith("U+")) {
    return null;
  }
  const body = token.slice(2);

  if (body.includes("?")) {
    const start = parseInt(body.replace(/\?/g, "0"), 16);
    const end = parseInt(body.replace(/\?/g, "F"), 16);
    return { start, end };
  }

  const [startHex, endHex] = body.split("-");
  const start = parseInt(startHex, 16);
  const end = endHex ? parseInt(endHex, 16) : start;
  return { start, end };
}

function parseUnicodeRange(rangeString) {
  return rangeString
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((token) => parseUnicodeToken(token))
    .filter((token) => token && !Number.isNaN(token.start) && !Number.isNaN(token.end));
}

function rangeIntersects(rangeList, charCodes) {
  if (!rangeList || rangeList.length === 0) {
    return true;
  }
  for (const { start, end } of rangeList) {
    for (const code of charCodes) {
      if (code >= start && code <= end) {
        return true;
      }
    }
  }
  return false;
}

async function collectCharacters() {
  const files = await globby(
    ["src/**/*.{md,njk,html,json,txt}", "!src/assets/fonts/**"],
    {
      cwd: projectRoot,
    },
  );

  const charSet = new Set();
  for (const char of fallbackCharacters) {
    addCharacterToSet(charSet, char);
  }

  await Promise.all(
    files.map(async (relative) => {
      const absolute = path.join(projectRoot, relative);
      const content = await fs.readFile(absolute, "utf8");
      for (const char of content) {
        addCharacterToSet(charSet, char);
      }
    }),
  );

  return Array.from(charSet);
}

async function ensureCleanDirectory(directory) {
  await fs.rm(directory, { recursive: true, force: true });
  await fs.mkdir(directory, { recursive: true });
}

async function generateFontCss() {
  const charCodes = await collectCharacters();

  await ensureCleanDirectory(outputFontDir);
  await fs.mkdir(path.dirname(outputCssPath), { recursive: true });

  const copiedFiles = new Set();
  const cssBlocks = [];

  for (const font of fonts) {
    const fontDir = path.join(fontPackageRoot, font.dir);
    const cssPath = path.join(fontDir, "result.css");
    const cssContent = await fs.readFile(cssPath, "utf8");
    const matches = cssContent.match(/@font-face\s*\{[^}]+\}/g) || [];

    for (const block of matches) {
      const unicodeMatch = block.match(/unicode-range\s*:\s*([^;]+);/i);
      const srcMatch = block.match(/url\((['"]?)(\.\/[^'")]+\.woff2)\1\)/i);

      if (!srcMatch) {
        continue;
      }

      const unicodeRanges = unicodeMatch ? parseUnicodeRange(unicodeMatch[1]) : [];
      if (!rangeIntersects(unicodeRanges, charCodes)) {
        continue;
      }

      const relativeFile = srcMatch[2].replace("./", "");
      const sourcePath = path.join(fontDir, relativeFile);
      const targetName = `${font.dir}-${relativeFile}`;
      const targetPath = path.join(outputFontDir, targetName);

      if (!copiedFiles.has(targetName)) {
        await fs.copyFile(sourcePath, targetPath);
        copiedFiles.add(targetName);
      }

      const unicodeLine = unicodeMatch ? `  unicode-range: ${unicodeMatch[1]};` : "";
      cssBlocks.push(
        "@font-face {",
        '  font-family: "LXGW WenKai";',
        "  font-style: normal;",
        `  font-weight: ${font.weight};`,
        "  font-display: swap;",
        `  src: url("/assets/fonts/lxgw/${targetName}") format("woff2");`,
        unicodeLine,
        "}",
        "",
      );
    }
  }

  const cssOutput = cssBlocks.join("\n").trim();
  await fs.writeFile(outputCssPath, `${cssOutput}\n`, "utf8");
}

generateFontCss().catch((error) => {
  console.error("[fonts] Failed to generate font CSS:", error);
  process.exitCode = 1;
});
