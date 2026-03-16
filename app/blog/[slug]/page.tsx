import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import NeoDesktop from "@/app/neo/components/NeoDesktop";
import type { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) return { title: "Not Found" };

  return {
    title: `${post.frontmatter.title} | KYU-NIVERSE`,
    description: post.frontmatter.summary,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.summary,
      type: "article",
      publishedTime: post.frontmatter.date,
      tags: post.frontmatter.tags,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) notFound();

  const allPosts = await getAllPosts();
  const blogData = allPosts.map((p) => ({
    slug: p.slug,
    frontmatter: p.frontmatter,
    html: p.html,
  }));

  return <NeoDesktop blogPosts={blogData} initialPostSlug={params.slug} />;
}
