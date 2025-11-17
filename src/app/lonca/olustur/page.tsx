import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Navbar } from '@/components/navbar';
import { CreateGuildForm } from './create-guild-form';

export default async function CreateGuildPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/giris?redirect=/lonca/olustur');
  }

  return (
    <>
      <Navbar />
      <CreateGuildForm />
    </>
  );
}
