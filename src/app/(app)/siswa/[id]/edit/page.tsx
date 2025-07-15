'use client';
import { StudentForm } from '@/components/student-form';
import { Siswa, mockSiswaData } from '@/lib/data';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditSiswaPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [student, setStudent] = useState<Siswa | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('siswaData');
      const allStudents = storedData ? JSON.parse(storedData) : mockSiswaData;
      const foundStudent = allStudents.find((s: Siswa) => s.id === id);
      
      if (foundStudent) {
        setStudent(foundStudent);
      }
    } catch (error) {
      console.error("Failed to parse student data from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-6">
                <Skeleton className="h-9 w-1/2 mb-2" />
                <Skeleton className="h-5 w-1/3" />
            </div>
            <Skeleton className="h-[600px] w-full" />
        </div>
    )
  }

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
