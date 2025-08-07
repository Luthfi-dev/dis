
'use server';
import { EditStudentForm } from './edit-form';

export default async function EditSiswaPage({ params }: { params: { id: string } }) {
  const id = params.id;
  
  // The client component will handle data fetching.
  return <EditStudentForm studentId={id} />;
}
