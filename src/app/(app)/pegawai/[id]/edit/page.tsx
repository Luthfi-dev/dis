
'use server';
import { EditPegawaiForm } from './edit-form';

export default async function EditPegawaiPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  // The client component will handle data fetching.
  return <EditPegawaiForm pegawaiId={id} />;
}
