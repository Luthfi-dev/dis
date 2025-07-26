
'use server';
import { EditStudentForm } from './edit-form';
import { decryptId } from '@/lib/utils';

export default async function EditSiswaPage({ params }: { params: { id: string } }) {
  const decryptedId = decryptId(params.id);
  
  // The client component will handle data fetching.
  return <EditStudentForm studentId={decryptedId} />;
}
