/**
 * Markdown Import/Export Utilities for Blog Editor
 */

/**
 * Convert HTML to Markdown
 */
export function htmlToMarkdown(html: string): string {
  let markdown = html;

  // Headings
  markdown = markdown.replace(/<h2>(.*?)<\/h2>/gi, "## $1\n\n");
  markdown = markdown.replace(/<h3>(.*?)<\/h3>/gi, "### $1\n\n");
  markdown = markdown.replace(/<h4>(.*?)<\/h4>/gi, "#### $1\n\n");

  // Bold
  markdown = markdown.replace(/<strong>(.*?)<\/strong>/gi, "**$1**");
  markdown = markdown.replace(/<b>(.*?)<\/b>/gi, "**$1**");

  // Italic
  markdown = markdown.replace(/<em>(.*?)<\/em>/gi, "*$1*");
  markdown = markdown.replace(/<i>(.*?)<\/i>/gi, "*$1*");

  // Underline (not standard markdown, use HTML)
  markdown = markdown.replace(/<u>(.*?)<\/u>/gi, "<u>$1</u>");

  // Links
  markdown = markdown.replace(/<a href="(.*?)".*?>(.*?)<\/a>/gi, "[$2]($1)");

  // Images
  markdown = markdown.replace(/<img src="(.*?)" alt="(.*?)".*?>/gi, "![$2]($1)");
  markdown = markdown.replace(/<img src="(.*?)".*?>/gi, "![]($1)");

  // Lists
  markdown = markdown.replace(/<ul>(.*?)<\/ul>/gis, (match, content) => {
    const items = content.match(/<li>(.*?)<\/li>/gi) || [];
    return items.map((item: string) => {
      const text = item.replace(/<\/?li>/gi, "").trim();
      return `- ${text}`;
    }).join("\n") + "\n\n";
  });

  markdown = markdown.replace(/<ol>(.*?)<\/ol>/gis, (match, content) => {
    const items = content.match(/<li>(.*?)<\/li>/gi) || [];
    return items.map((item: string, index: number) => {
      const text = item.replace(/<\/?li>/gi, "").trim();
      return `${index + 1}. ${text}`;
    }).join("\n") + "\n\n";
  });

  // Code blocks
  markdown = markdown.replace(/<pre><code>(.*?)<\/code><\/pre>/gis, "```\n$1\n```\n\n");
  markdown = markdown.replace(/<code>(.*?)<\/code>/gi, "`$1`");

  // Blockquotes
  markdown = markdown.replace(/<blockquote>(.*?)<\/blockquote>/gis, (match, content) => {
    const lines = content.trim().split("\n");
    return lines.map((line: string) => `> ${line.trim()}`).join("\n") + "\n\n";
  });

  // Paragraphs
  markdown = markdown.replace(/<p>(.*?)<\/p>/gi, "$1\n\n");

  // Line breaks
  markdown = markdown.replace(/<br\s*\/?>/gi, "\n");

  // Remove remaining HTML tags
  markdown = markdown.replace(/<[^>]+>/g, "");

  // Clean up extra whitespace
  markdown = markdown.replace(/\n{3,}/g, "\n\n");
  markdown = markdown.trim();

  return markdown;
}

/**
 * Convert Markdown to HTML
 */
export function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Escape HTML entities first
  html = html.replace(/&/g, "&amp;");
  html = html.replace(/</g, "&lt;");
  html = html.replace(/>/g, "&gt;");

  // Code blocks (must be before inline code)
  html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Headings
  html = html.replace(/^#### (.*$)/gim, "<h4>$1</h4>");
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__([^_]+)__/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/_([^_]+)_/g, "<em>$1</em>");

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Unordered lists
  html = html.replace(/^\s*[-*+]\s+(.*)$/gim, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");

  // Ordered lists
  html = html.replace(/^\s*\d+\.\s+(.*)$/gim, "<li>$1</li>");

  // Blockquotes
  html = html.replace(/^>\s+(.*)$/gim, "<blockquote>$1</blockquote>");

  // Line breaks
  html = html.replace(/\n\n/g, "</p><p>");
  html = html.replace(/^(.+)$/gim, "<p>$1</p>");

  // Clean up
  html = html.replace(/<p><\/p>/g, "");
  html = html.replace(/<p>(<h[1-6]>)/g, "$1");
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, "$1");
  html = html.replace(/<p>(<ul>)/g, "$1");
  html = html.replace(/(<\/ul>)<\/p>/g, "$1");
  html = html.replace(/<p>(<ol>)/g, "$1");
  html = html.replace(/(<\/ol>)<\/p>/g, "$1");
  html = html.replace(/<p>(<blockquote>)/g, "$1");
  html = html.replace(/(<\/blockquote>)<\/p>/g, "$1");
  html = html.replace(/<p>(<pre>)/g, "$1");
  html = html.replace(/(<\/pre>)<\/p>/g, "$1");

  return html;
}

/**
 * Export editor content as Markdown file
 */
export function exportAsMarkdown(html: string, filename: string = "blog-post.md"): void {
  const markdown = htmlToMarkdown(html);
  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Import Markdown file and convert to HTML
 */
export function importMarkdownFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const markdown = e.target?.result as string;
      const html = markdownToHtml(markdown);
      resolve(html);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
