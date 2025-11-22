import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { GroupDetailClient } from "./group-detail-client";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getGroup(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/groups/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching group:", error);
    return null;
  }
}

async function getGroupPosts(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/groups/${slug}/posts`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const group = await getGroup(slug);
  if (!group) {
    return { title: "Grup Bulunamadı" };
  }
  return {
    title: `${group.name} | ZayiflamaPlan`,
    description: group.description || `${group.name} grubuna katıl`,
  };
}

export default async function GroupPage({ params }: Props) {
  const { slug } = await params;
  const [group, posts] = await Promise.all([
    getGroup(slug),
    getGroupPosts(slug),
  ]);

  if (!group) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <Navbar />
      <GroupDetailClient group={group} posts={posts} />
    </div>
  );
}
