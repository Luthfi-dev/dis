
'use server';
import { EditPegawaiForm } from './edit-form';
import { decryptId } from '@/lib/utils';

export default async function EditPegawaiPage({ params }: { params: { id: string } }) {
  const decryptedId = decryptId(params.id);
  
  // The client component will handle data fetching.
  return <EditPegawaiForm pegawaiId={decryptedId} />;
}
