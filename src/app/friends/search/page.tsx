import { redirect } from "next/navigation";
import { checkUserBan } from "@/lib/check-ban";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/layout/footer";
import { FriendSearch } from "@/components/friends/friend-search";

export const metadata = {
  title: "Arkadaş Ara | Zayıflama Planı",
  description: "Yeni arkadaşlar bul ve ekle",
};

export default async function FriendSearchPage() {
  const session = await checkUserBan();

  if (!session?.user) {
    redirect("/giris");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 dark:from-slate-950 dark:via-purple-950/20 dark:to-pink-950/20">
      <Navbar />

      <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <FriendSearch />
      </main>

      <Footer />
    </div>
  );
}
