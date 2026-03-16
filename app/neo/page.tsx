import { getAllPosts } from "@/lib/blog";
import { BOOK_LIST } from "@/app/constants/books";
import {
  getClientDtoFromNotionAPI,
  getQueryFromNotionDBbyId,
} from "@/app/providers/notion";
import NeoDesktop from "./components/NeoDesktop";

export interface BookData {
  id: string;
  coverUrl: string;
  title: string;
}

async function getAllBookData(): Promise<BookData[]> {
  const dbId = process.env.NOTION_BOOK_DATABASE_ID;
  if (!dbId) return [];

  try {
    const data = await getQueryFromNotionDBbyId(dbId);
    return data.results
      .map((item) => getClientDtoFromNotionAPI(item))
      .filter(
        (book) =>
          book.properties?.subtitle?.rich_text?.[0]?.plain_text != null,
      )
      .map((book) => {
        const title = book.properties.subtitle.rich_text[0].plain_text;
        return { id: book.id, coverUrl: BOOK_LIST[title] ?? "", title };
      })
      .filter((book) => book.coverUrl !== "");
  } catch {
    return [];
  }
}

export default async function NeoPage() {
  const [posts, books] = await Promise.all([
    getAllPosts(),
    getAllBookData(),
  ]);

  const blogData = posts.map((post) => ({
    slug: post.slug,
    frontmatter: post.frontmatter,
    html: post.html,
  }));

  return <NeoDesktop blogPosts={blogData} books={books} />;
}
