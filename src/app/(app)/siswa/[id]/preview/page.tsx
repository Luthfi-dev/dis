import { mockSiswaData } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Printer } from 'lucide-react';
import Image from 'next/image';

export default function PreviewSiswaPage({ params }: { params: { id: string } }) {
  const student = mockSiswaData.find(s => s.id === params.id);

  if (!student) {
    notFound();
  }

  return (
    <div className="bg-muted/30 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 print:hidden">
            <Button variant="outline" asChild>
                <Link href="/siswa">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Link>
            </Button>
            <Button onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" />
                Cetak
            </Button>
        </div>
        <Card className="shadow-lg print:shadow-none print:border-none">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">BUKU INDUK SISWA</CardTitle>
                <CardDescription>Tahun Pelajaran 2024/2025</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <section>
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">A. KETERANGAN PRIBADI SISWA</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
                        <div className="md:col-span-2 space-y-4">
                            <p>1. Nama Lengkap: <strong>{student.namaLengkap}</strong></p>
                            <p>2. NISN: <strong>{student.nisn}</strong></p>
                            <p>3. Jenis Kelamin: <strong>{student.jenisKelamin}</strong></p>
                            <p>4. Tempat, Tanggal Lahir: <strong>{`-, ${new Date(student.tanggalLahir).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}`}</strong></p>
                            <p>5. Agama: <strong>-</strong></p>
                            <p>6. Kewarganegaraan: <strong>Indonesia</strong></p>
                        </div>
                        <div className="relative w-32 h-40 bg-gray-200 border self-start">
                            <Image src="https://placehold.co/128x160.png" alt="Foto Siswa" layout="fill" objectFit="cover" data-ai-hint="student portrait" />
                             <p className="absolute bottom-[-20px] left-0 right-0 text-center text-xs">3x4</p>
                        </div>
                    </div>
                </section>
                 <section>
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">B. KETERANGAN TEMPAT TINGGAL</h3>
                     <p>1. Alamat: <strong>-</strong></p>
                </section>
                <section>
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">C. KETERANGAN KESEHATAN</h3>
                     <p>1. Golongan Darah: <strong>-</strong></p>
                     <p>2. Riwayat Penyakit: <strong>-</strong></p>
                </section>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
