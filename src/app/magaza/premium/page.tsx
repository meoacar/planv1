import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/navbar';
import { PremiumShopClient } from '@/components/premium-shop-client';

export const metadata = {
  title: 'Premium Mağaza | Zayıflama Planım',
  description: 'Premium üyelikler ve özel hizmetler',
};

export default async function PremiumShopPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/giris?callbackUrl=/magaza/premium');
  }

  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ category: 'asc' }, { price: 'asc' }],
  });

  return (
    <>
      <Navbar />
      <PremiumShopClient products={products} />
    </>
  );
}
