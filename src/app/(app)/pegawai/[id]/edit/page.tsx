
'use server';
import { notFound } from 'next/navigation';
import { EditPegawaiForm } from './edit-form';

export default async function EditPegawaiPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  // The client component will handle data fetching via useEffect
  // to work with localStorage.
  return <EditPegawaiForm pegawaiId={id} />;
}
