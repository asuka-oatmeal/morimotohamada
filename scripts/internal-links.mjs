import fs from "fs";
import path from "path";
import matter from "gray-matter";

const articlesDir = path.join(process.cwd(), "content", "articles");
const keywordsPath = path.join(process.cwd(), "content", "keywords.json");

// Max internal links to insert per article
const MAX_LINKS_PER_ARTICLE = 5;

function loadPublishedArticles() {
  const keywords = JSON.parse(fs.readFileSync(keywordsPath, "utf8"));
  const published = keywords.filter((kw) => kw.status === "published");

  return published.map((kw) => {
    const filePath = path.join(articlesDir, `${kw.slug}.md`);
    if (!fs.existsSync(filePath)) return null;
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    return {
      slug: kw.slug,
      keyword: kw.keyword,
      category: kw.category,
      title: data.title || "",
      content,
      frontmatter: data,
      filePath,
      raw: fileContents,
    };
  }).filter(Boolean);
}

// Build link targets: keyword phrases that map to article URLs
function buildLinkTargets(articles) {
  const targets = [];
  for (const article of articles) {
    // Primary keyword
    targets.push({
      slug: article.slug,
      phrase: article.keyword,
      title: article.title,
      category: article.category,
    });

    // Also match partial keywords (split by space)
    const parts = article.keyword.split(/\s+/);
    if (parts.length >= 2) {
      // Add the full keyword as-is (already added above)
      // Add each meaningful sub-phrase (2+ chars)
      for (const part of parts) {
        if (part.length >= 3) {
          targets.push({
            slug: article.slug,
            phrase: part,
            title: article.title,
            category: article.category,
            isPartial: true,
          });
        }
      }
    }
  }

  // Sort by phrase length descending so longer matches are tried first
  return targets.sort((a, b) => b.phrase.length - a.phrase.length);
}

function addInternalLinks(article, allTargets) {
  const lines = article.content.split("\n");
  let linksAdded = 0;
  const linkedSlugs = new Set();
  let inMermaid = false;

  // Check which slugs are already linked in the content
  const existingLinks = article.content.match(/\[.*?\]\(\/blog\/([^)]+)\)/g) || [];
  for (const link of existingLinks) {
    const slugMatch = link.match(/\/blog\/([^)]+)/);
    if (slugMatch) linkedSlugs.add(slugMatch[1]);
  }

  const newLines = lines.map((line) => {
    if (linksAdded >= MAX_LINKS_PER_ARTICLE) return line;

    // Skip mermaid blocks
    if (line.trim().startsWith("```mermaid")) { inMermaid = true; return line; }
    if (inMermaid) { if (line.trim() === "```") inMermaid = false; return line; }

    // Skip headings, frontmatter separators, HTML comments, empty lines
    if (/^#{1,6}\s/.test(line) || line.trim() === "---" || line.trim().startsWith("<!--") || line.trim() === "") {
      return line;
    }

    // Skip lines that are inside markdown links or code
    if (line.includes("](") && line.includes("[")) return line;

    let modified = line;
    for (const target of allTargets) {
      if (linksAdded >= MAX_LINKS_PER_ARTICLE) break;
      if (target.slug === article.slug) continue; // Don't self-link
      if (linkedSlugs.has(target.slug)) continue; // Already linked this article

      // Skip partial matches if full keyword match exists for same slug
      if (target.isPartial && linkedSlugs.has(target.slug)) continue;

      const escapedPhrase = target.phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(?<![\\[\\(])${escapedPhrase}(?![\\]\\)])`, "g");

      if (regex.test(modified)) {
        // Only replace first occurrence
        const link = `[${target.phrase}](/blog/${target.slug})`;
        modified = modified.replace(regex, () => {
          if (linkedSlugs.has(target.slug)) return target.phrase;
          linkedSlugs.add(target.slug);
          linksAdded++;
          return link;
        });
        break; // Move to next line after inserting a link
      }
    }

    return modified;
  });

  return { content: newLines.join("\n"), linksAdded };
}

// Also generate a "関連記事" section at the bottom
function generateRelatedSection(article, articles) {
  const sameCategory = articles.filter(
    (a) => a.slug !== article.slug && a.category === article.category
  );

  // Pick up to 3 related articles from same category
  const related = sameCategory.slice(0, 3);
  if (related.length === 0) return "";

  const links = related
    .map((a) => `- [${a.title}](/blog/${a.slug})`)
    .join("\n");

  return `\n\n## 関連記事\n\n${links}`;
}

// Main
const articles = loadPublishedArticles();
const linkTargets = buildLinkTargets(articles);

let totalLinksAdded = 0;
let articlesModified = 0;

for (const article of articles) {
  const { content: linkedContent, linksAdded } = addInternalLinks(article, linkTargets);

  // Check if related section already exists
  const hasRelatedSection = article.content.includes("## 関連記事");
  const relatedSection = hasRelatedSection ? "" : generateRelatedSection(article, articles);

  if (linksAdded === 0 && !relatedSection) {
    console.log(`  ${article.slug}: no changes needed`);
    continue;
  }

  // Rebuild the file with frontmatter
  const newContent = matter.stringify(linkedContent + relatedSection, article.frontmatter);
  fs.writeFileSync(article.filePath, newContent);

  totalLinksAdded += linksAdded;
  articlesModified++;
  console.log(`  ${article.slug}: +${linksAdded} inline links${relatedSection ? " + 関連記事" : ""}`);
}

console.log(`\n--- Internal Links Summary ---`);
console.log(`Articles processed: ${articles.length}`);
console.log(`Articles modified: ${articlesModified}`);
console.log(`Total inline links added: ${totalLinksAdded}`);
