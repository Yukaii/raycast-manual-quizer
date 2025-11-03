import TurndownService from "turndown";
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

// Initialize Turndown service
const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  emDelimiter: "_",
});

// Add custom rules for better markdown conversion
turndownService.addRule("preserveLineBreaks", {
  filter: ["div", "span"],
  replacement: (content) => content,
});

// Remove empty paragraphs and divs
turndownService.addRule("removeEmptyElements", {
  filter: (node) => {
    return (
      (node.nodeName === "DIV" || node.nodeName === "P") &&
      node.textContent?.trim() === ""
    );
  },
  replacement: () => "\n",
});

// Handle notion-specific classes better
turndownService.addRule("notionCallout", {
  filter: (node) => {
    return (
      node.nodeName === "DIV" &&
      node.classList.contains("notion-callout")
    );
  },
  replacement: (content) => {
    return `\n> ${content.trim()}\n\n`;
  },
});

const inputDir = "./clean_content";
const outputDir = "./markdown";

// Create output directory if it doesn't exist
try {
  mkdirSync(outputDir, { recursive: true });
} catch (e) {
  // Directory already exists
}

// Get all HTML files
const files = readdirSync(inputDir).filter((file) => file.endsWith(".html"));

console.log(`Found ${files.length} HTML files to convert`);

// Convert each file
for (const file of files) {
  const inputPath = join(inputDir, file);
  const outputPath = join(outputDir, file.replace(".html", ".md"));

  try {
    // Read HTML content
    const html = readFileSync(inputPath, "utf-8");

    // Convert to markdown
    let markdown = turndownService.turndown(html);

    // Clean up the markdown
    // Remove excessive blank lines
    markdown = markdown.replace(/\n{3,}/g, "\n\n");

    // Trim whitespace
    markdown = markdown.trim();

    // Write to file
    writeFileSync(outputPath, markdown, "utf-8");

    console.log(`✓ Converted: ${file} -> ${file.replace(".html", ".md")}`);
  } catch (error) {
    console.error(`✗ Error converting ${file}:`, error);
  }
}

console.log(`\nConversion complete! Markdown files saved to ${outputDir}/`);
