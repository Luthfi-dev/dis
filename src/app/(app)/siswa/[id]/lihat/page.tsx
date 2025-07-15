'use client';
import { Siswa, mockSiswaData } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FilePen, ArrowLeft, Building, User, Calendar, Mail, Phone, MapPin, Droplet, Stethoscope, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function DetailItem({ label, value, icon }: { label: string; value: React.ReactNode; icon: React.ElementType }) {
  const Icon = icon;
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="text-base">{value || '-'}</div>
      </div>
    </div>
  );
}

export default function LihatSiswaPage({ params }: { params: { id: string } }) {
    const [student, setStudent] = useState<Siswa | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
          const storedData = localStorage.getItem('siswaData');
          const allStudents: Siswa[] = storedData ? JSON.parse(storedData) : mockSiswaData;
          const foundStudent = allStudents.find(s => s.id === params.id);
          
          if (foundStudent) {
            setStudent(foundStudent);
          }
        } catch (error) {
          console.error("Failed to parse student data from localStorage", error);
        } finally {
            setLoading(false);
        }
    }, [params.id]);


  if (loading) {
    return <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-96 w-full" />
    </div>
  }

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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center truncate">Detail Siswa</h1>
        <Button asChild>
          <Link href={`/siswa/${student.id}/edit`}>
            <FilePen className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{student.namaLengkap}</CardTitle>
            <CardDescription>
                <Badge variant={student.status === 'Lengkap' ? 'default' : 'outline'} className={student.status === 'Lengkap' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'text-amber-600 border-amber-500/50'}>
                    Status: {student.status}
                </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Data Pribadi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DetailItem label="NISN" value={student.nisn} icon={User} />
                    <DetailItem label="Jenis Kelamin" value={
                    <Badge variant={student.jenisKelamin === 'Laki-laki' ? 'default' : 'secondary'} className={student.jenisKelamin === 'Perempuan' ? 'bg-pink-100 text-pink-800' : ''}>
                        {student.jenisKelamin}
                    </Badge>
                    } icon={User} />
                    <DetailItem label="Tempat Lahir" value={student.tempatLahir} icon={MapPin} />
                    <DetailItem label="Tanggal Lahir" value={new Date(student.tanggalLahir).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} icon={Calendar}/>
                    <DetailItem label="Agama" value={student.agama} icon={BookOpen} />
                    <DetailItem label="Alamat" value={student.alamat} icon={MapPin} />
                </div>
             </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Data Orang Tua / Wali</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DetailItem label="Nama Ayah" value={student.namaAyah} icon={User}/>
                    <DetailItem label="Pekerjaan Ayah" value={student.pekerjaanAyah} icon={Building}/>
                    <DetailItem label="Nama Ibu" value={student.namaIbu} icon={User}/>
                    <DetailItem label="Pekerjaan Ibu" value={student.pekerjaanIbu} icon={Building}/>
                 </div>
            </CardContent>
        </Card>
        
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Data Kesehatan & Rincian</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DetailItem label="Tinggi Badan" value={student.tinggiBadan ? `${student.tinggiBadan} cm` : '-'} icon={User}/>
                    <DetailItem label="Berat Badan" value={student.beratBadan ? `${student.beratBadan} kg` : '-'} icon={User}/>
                    <DetailItem label="Golongan Darah" value={student.golonganDarah} icon={Droplet}/>
                    <DetailItem label="Riwayat Penyakit" value={student.penyakit} icon={Stethoscope}/>
                 </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
