import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { CreateGroupForm } from "./create-group-form";

const categories = [
  { value: "general", label: "Genel", icon: "👥", description: "Genel sohbet ve paylaşım" },
  { value: "motivation", label: "Motivasyon", icon: "💪", description: "Motivasyon ve ilham" },
  { value: "recipes", label: "Tarifler", icon: "🍽️", description: "Sağlıklı tarif paylaşımı" },
  { value: "exercise", label: "Egzersiz", icon: "🏃", description: "Spor ve egzersiz" },
  { value: "support", label: "Destek", icon: "🤝", description: "Duygusal destek" },
  { value: "age_based", label: "Yaş Grupları", icon: "👨‍👩‍👧‍👦", description: "20'ler, 30'lar, 40'lar vb." },
  { value: "goal_based", label: "Hedef Bazlı", icon: "🎯", description: "10kg, 20kg hedefler" },
  { value: "lifestyle", label: "Yaşam Tarzı", icon: "🌱", description: "Vegan, Keto, vb." },
];

export default async function CreateGroupPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/giris?redirect=/gruplar/olustur");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <CreateGroupForm categories={categories} />
    </div>
  );
}
