import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { globby } from "globby";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const sourceDir = path.join(projectRoot, "src");
const outputDir = path.join(sourceDir, "assets", "fonts");
const fontConfigs = [
  {
    fontFamily: "LXGW WenKai",
    packageRoot: path.join(
      projectRoot,
      "node_modules",
      "@callmebill",
      "lxgw-wenkai-web",
    ),
    outputDir: "lxgw",
    outputCss: "lxgw.css",
    fonts: [
      { dir: "lxgwwenkai-light", weight: 300, style: "normal" },
      { dir: "lxgwwenkai-regular", weight: 400, style: "normal" },
    ],
  },
  {
    fontFamily: "Maple Mono CN",
    packageRoot: path.join(
      projectRoot,
      "node_modules",
      "@chinese-fonts",
      "maple-mono-cn",
      "dist",
    ),
    outputDir: "maple-mono-cn",
    outputCss: "maple-mono-cn.css",
    fonts: [
      { dir: "MapleMono-CN-Thin", weight: 100, style: "normal" },
      { dir: "MapleMono-CN-Light", weight: 300, style: "normal" },
      { dir: "MapleMono-CN-Regular", weight: 400, style: "normal" },
    ],
  },
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

async function processFontConfig(config, charCodes) {
  const outputFontDir = path.join(outputDir, config.outputDir);
  await ensureCleanDirectory(outputFontDir);

  const copiedFiles = new Set();
  const cssBlocks = [];

  for (const font of config.fonts) {
    const fontDir = path.join(config.packageRoot, font.dir);
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

      const fontStyleMatch = block.match(/font-style\s*:\s*([^;]+);/i);
      const fontWeightMatch = block.match(/font-weight\s*:\s*([^;]+);/i);
      const fontDisplayMatch = block.match(/font-display\s*:\s*([^;]+);/i);

      const fontStyle = fontStyleMatch ? fontStyleMatch[1].trim() : font.style || "normal";
      const fontWeight = fontWeightMatch ? fontWeightMatch[1].trim() : String(font.weight ?? 400);
      const fontDisplay = fontDisplayMatch ? fontDisplayMatch[1].trim() : "swap";

      const blockLines = [
        "@font-face {",
        `  font-family: "${config.fontFamily}";`,
        `  font-style: ${fontStyle};`,
        `  font-weight: ${fontWeight};`,
        `  font-display: ${fontDisplay};`,
        `  src: url("/assets/fonts/${config.outputDir}/${targetName}") format("woff2");`,
      ];

      if (unicodeMatch) {
        blockLines.push(`  unicode-range: ${unicodeMatch[1].trim()};`);
      }

      blockLines.push("}", "");
      cssBlocks.push(...blockLines);
    }
  }

  const cssOutput = cssBlocks.join("\n").trim();
  await fs.writeFile(
    path.join(outputDir, config.outputCss),
    cssOutput ? `${cssOutput}\n` : "",
    "utf8",
  );
}

async function generateFontCss() {
  const charCodes = await collectCharacters();

  await fs.mkdir(outputDir, { recursive: true });

  for (const config of fontConfigs) {
    await processFontConfig(config, charCodes);
  }
}

generateFontCss().catch((error) => {
  console.error("[fonts] Failed to generate font CSS:", error);
  process.exitCode = 1;
});
