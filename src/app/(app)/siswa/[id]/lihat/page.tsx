import { mockSiswaData } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FilePen, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base">{value || '-'}</p>
    </div>
  );
}

export default function LihatSiswaPage({ params }: { params: { id: string } }) {
  const student = mockSiswaData.find(s => s.id === params.id);

  if (!student) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4">
        <Button variant="outline" asChild>
          <Link href="/siswa">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center">Detail Siswa</h1>
        <Button asChild>
          <Link href={`/siswa/${student.id}/edit`}>
            <FilePen className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">{student.namaLengkap}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DetailItem label="NISN" value={student.nisn} />
            <DetailItem label="Jenis Kelamin" value={
              <Badge variant={student.jenisKelamin === 'Laki-laki' ? 'default' : 'secondary'} className={student.jenisKelamin === 'Perempuan' ? 'bg-pink-100 text-pink-800' : ''}>
                {student.jenisKelamin}
              </Badge>
            } />
            <DetailItem label="Tanggal Lahir" value={new Date(student.tanggalLahir).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} />
            <DetailItem label="Tempat Lahir" value="-" />
            <DetailItem label="Agama" value="-" />
            <DetailItem label="Alamat" value="-" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
