import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { Navbar } from '@/components/navbar';
import { ShopClient } from '@/components/shop-client';

export default async function ShopPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/giris?callbackUrl=/magaza');
  }

  const [items, user] = await Promise.all([
    db.shopItem.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    }),
    db.user.findUnique({
      where: { id: session.user.id },
      select: { coins: true },
    }),
  ]);

  return (
    <>
      <Navbar />
      <ShopClient items={items} userCoins={user?.coins || 0} />
    </>
  );
}
