import { StudentForm } from '@/components/student-form';
import { mockSiswaData } from '@/lib/data';
import { notFound } from 'next/navigation';

export default function EditSiswaPage({ params }: { params: { id: string } }) {
  const student = mockSiswaData.find(s => s.id === params.id);

  if (!student) {
    notFound();
  }
  
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Edit Data Siswa</h1>
        <p className="text-muted-foreground">Perbarui data untuk {student.namaLengkap}.</p>
      </div>
      <StudentForm studentData={student} />
    </div>
  );
}
