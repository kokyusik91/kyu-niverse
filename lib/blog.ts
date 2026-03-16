import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Marked } from "marked";
import { createHighlighter, type Highlighter } from "shiki";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface BlogFrontmatter {
  title: string;
  date: string;
  tags: string[];
  category: "dev" | "retrospect" | "daily" | "anime";
  summary: string;
  thumbnail?: string;
  published: boolean;
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
  html: string;
}

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["one-dark-pro"],
      langs: [
        "typescript",
        "tsx",
        "javascript",
        "jsx",
        "css",
        "html",
        "json",
        "yaml",
        "bash",
        "markdown",
        "sql",
      ],
    });
  }
  return highlighterPromise;
}

async function createMarkedWithHighlighter(): Promise<Marked> {
  const highlighter = await getHighlighter();
  const instance = new Marked();

  instance.use({
    renderer: {
      code({ text, lang }) {
        const language = lang || "text";
        try {
          const html = highlighter.codeToHtml(text, {
            lang: language,
            theme: "one-dark-pro",
          });
          return `<div class="neo-code-block">${html}</div>`;
        } catch {
          const escaped = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
          return `<div class="neo-code-block"><pre class="shiki"><code>${escaped}</code></pre></div>`;
        }
      },
    },
  });

  return instance;
}

async function renderMarkdown(content: string): Promise<string> {
  const markedInstance = await createMarkedWithHighlighter();
  return markedInstance.parse(content, { async: false }) as string;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = await Promise.all(
    files.map(async (filename) => {
      const filePath = path.join(BLOG_DIR, filename);
      const source = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(source);

      return {
        slug: filename.replace(".mdx", ""),
        frontmatter: data as BlogFrontmatter,
        content,
        html: await renderMarkdown(content),
      };
    }),
  );

  return posts
    .filter((post) => post.frontmatter.published)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    );
}

export async function getPostBySlug(
  slug: string,
): Promise<BlogPost | undefined> {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return undefined;

  const source = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(source);

  return {
    slug,
    frontmatter: data as BlogFrontmatter,
    content,
    html: await renderMarkdown(content),
  };
}

export async function getPostsByCategory(
  category: BlogFrontmatter["category"],
): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.frontmatter.category === category);
}
