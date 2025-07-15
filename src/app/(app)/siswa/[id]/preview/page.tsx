'use client';
import { Siswa, mockSiswaData } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Printer, User, Calendar, MapPin, Droplet, Stethoscope, BookOpen, Building, Phone, Home, Users, Languages, HeartHandshake, Map, School, GraduationCap, History, CheckCircle2, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { getDesaName, getKecamatanName, getKabupatenName, getProvinceName } from '@/lib/wilayah';
import { cn } from '@/lib/utils';

function InfoRow({ label, value, icon, className }: { label: string, value?: React.ReactNode, icon?: React.ElementType, className?: string }) {
    const Icon = icon;
    return (
        <div className={cn("flex items-start text-sm", className)}>
            {Icon && <Icon className="w-4 h-4 mr-3 mt-0.5 text-muted-foreground" />}
            <span className="font-medium w-40 text-muted-foreground shrink-0">{label}</span>
            <span className="mr-2">:</span>
            <span className="flex-1 break-words">{value || '-'}</span>
        </div>
    )
}

export default function PreviewSiswaPage({ params: { id } }: { params: { id: string } }) {
  const [student, setStudent] = useState<Siswa | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('siswaData');
      const allStudents: Siswa[] = storedData ? JSON.parse(storedData) : mockSiswaData;
      const foundStudent = allStudents.find(s => s.id === id);
      
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
          <div className="bg-muted/30 p-4 md:p-8">
              <div className="max-w-4xl mx-auto">
                  <div className="flex justify-between items-center mb-6">
                      <Skeleton className="h-10 w-24" />
                      <Skeleton className="h-10 w-24" />
                  </div>
                  <Skeleton className="h-[800px] w-full" />
              </div>
          </div>
      )
  }

  if (!student) {
    notFound();
  }

  const formatDate = (dateString?: string | Date) => {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  }
  
  const studentStatus = student.status === 'Lengkap';

  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-4 md:p-8 print:bg-white">
      <div className="max-w-4xl mx-auto bg-white dark:bg-card rounded-xl shadow-2xl print:shadow-none print:border-none">
        <div className="p-6 sm:p-10 flex justify-between items-center print:hidden">
            <Button variant="outline" asChild>
                <Link href="/siswa">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Link>
            </Button>
            <h2 className="text-xl font-semibold text-center text-primary">Resume Buku Induk Siswa</h2>
            <Button onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" />
                Cetak
            </Button>
        </div>

        <main className="p-6 sm:p-10">
            {/* Header */}
            <header className="flex flex-col sm:flex-row items-center gap-6 mb-8 text-center sm:text-left">
                {student.fotoProfil?.fileURL ? (
                    <Image src={student.fotoProfil.fileURL} alt="Foto Siswa" width={128} height={128} className="rounded-full border-4 border-primary/20 shadow-lg object-cover w-32 h-32" />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-4 border-primary/20 shadow-lg">
                        <User className="w-20 h-20 text-muted-foreground" />
                    </div>
                )}
                <div>
                    <h1 className="text-3xl font-bold text-card-foreground">{student.namaLengkap}</h1>
                    <p className="text-lg text-muted-foreground">NISN: {student.nisn}</p>
                     <Badge variant={studentStatus ? 'default' : 'destructive'} className="mt-2">
                        {studentStatus ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <XCircle className="mr-2 h-4 w-4" />}
                        Status: {student.status}
                    </Badge>
                </div>
            </header>
            
            <Separator className="my-8" />
            
            <div className="space-y-10">
                {/* Keterangan Pribadi */}
                <section>
                    <h3 className="font-bold text-xl mb-4 border-b-2 border-primary pb-2 text-primary">A. Keterangan Pribadi Siswa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                        <InfoRow label="Nama Lengkap" value={student.namaLengkap} icon={User} />
                        <InfoRow label="NIS" value={student.nis} icon={User} />
                        <InfoRow label="NISN" value={student.nisn} icon={User} />
                        <InfoRow label="Jenis Kelamin" value={student.jenisKelamin} icon={Users} />
                        <InfoRow label="Tempat, Tgl Lahir" value={`${student.tempatLahir}, ${formatDate(student.tanggalLahir)}`} icon={Calendar} />
                        <InfoRow label="Agama" value={student.agama} icon={BookOpen} />
                        <InfoRow label="Kewarganegaraan" value={student.kewarganegaraan} icon={Map} />
                        <InfoRow label="Jumlah Saudara" value={student.jumlahSaudara} icon={Users}/>
                        <InfoRow label="Bahasa Sehari-hari" value={student.bahasa} icon={Languages}/>
                        <InfoRow label="Golongan Darah" value={student.golonganDarah} icon={Droplet} />
                        <InfoRow label="Nomor HP/WA" value={student.telepon} icon={Phone} />
                    </div>
                </section>
                
                {/* Keterangan Tempat Tinggal */}
                 <section>
                    <h3 className="font-bold text-xl mb-4 border-b-2 border-primary pb-2 text-primary">B. Keterangan Tempat Tinggal</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                            <h4 className='font-semibold text-md'>Alamat Sesuai KK</h4>
                            <InfoRow label="Desa" value={getDesaName(student.alamatKkDesa)} icon={Home} />
                            <InfoRow label="Kecamatan" value={getKecamatanName(student.alamatKkKecamatan)} icon={Home} />
                            <InfoRow label="Kabupaten" value={getKabupatenName(student.alamatKkKabupaten)} icon={Home} />
                            <InfoRow label="Provinsi" value={getProvinceName(student.alamatKkProvinsi)} icon={Home} />
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                            <h4 className='font-semibold text-md'>Domisili</h4>
                            <InfoRow label="Desa" value={getDesaName(student.domisiliDesa)} icon={MapPin} />
                            <InfoRow label="Kecamatan" value={getKecamatanName(student.domisiliKecamatan)} icon={MapPin} />
                            <InfoRow label="Kabupaten" value={getKabupatenName(student.domisiliKabupaten)} icon={MapPin} />
                            <InfoRow label="Provinsi" value={getProvinceName(student.domisiliProvinsi)} icon={MapPin} />
                        </div>
                    </div>
                </section>

                {/* Keterangan Kesehatan */}
                <section>
                    <h3 className="font-bold text-xl mb-4 border-b-2 border-primary pb-2 text-primary">C. Keterangan Kesehatan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                         <InfoRow label="Riwayat Penyakit" value={student.penyakit} icon={Stethoscope} />
                         <InfoRow label="Kelainan Jasmani" value={student.kelainanJasmani} />
                         <InfoRow label="Tinggi & Berat Badan" value={`${student.tinggiBadan || '-'} cm / ${student.beratBadan || '-'} kg`} />
                    </div>
                </section>

                {/* Keterangan Orang Tua */}
                 <section>
                    <h3 className="font-bold text-xl mb-4 border-b-2 border-primary pb-2 text-primary">D. Keterangan Orang Tua</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 p-4 bg-muted/50 rounded-lg">
                           <InfoRow label="Nama Ayah" value={student.namaAyah} icon={User} />
                           <InfoRow label="Pendidikan Ayah" value={student.pendidikanAyah} />
                           <InfoRow label="Pekerjaan Ayah" value={student.pekerjaanAyah} icon={Building} />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 p-4 bg-muted/50 rounded-lg">
                           <InfoRow label="Nama Ibu" value={student.namaIbu} icon={User} />
                           <InfoRow label="Pendidikan Ibu" value={student.pendidikanIbu} />
                           <InfoRow label="Pekerjaan Ibu" value={student.pekerjaanIbu} icon={Building} />
                        </div>
                        <InfoRow label="Alamat Orang Tua" value={student.alamatOrangTua} icon={Home} />
                        <InfoRow label="Telepon Orang Tua" value={student.teleponOrangTua} icon={Phone} />
                    </div>
                </section>

                 {/* Keterangan Wali */}
                 <section>
                    <h3 className="font-bold text-xl mb-4 border-b-2 border-primary pb-2 text-primary">E. Keterangan Wali</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                       <InfoRow label="Nama Wali" value={student.namaWali} icon={HeartHandshake} />
                       <InfoRow label="Hubungan Keluarga" value={student.hubunganWali} icon={Users} />
                       <InfoRow label="Pendidikan Wali" value={student.pendidikanWali} icon={GraduationCap} />
                       <InfoRow label="Pekerjaan Wali" value={student.pekerjaanWali} icon={Building} />
                    </div>
                </section>

                {/* Perkembangan Siswa */}
                <section>
                    <h3 className="font-bold text-xl mb-4 border-b-2 border-primary pb-2 text-primary">F. Perkembangan Siswa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                        <InfoRow label="Asal Sekolah" value={student.asalSekolah} icon={School}/>
                        <InfoRow label="Tanggal Diterima" value={formatDate(student.tanggalMasuk)} icon={Calendar} />
                        <InfoRow label="Hobi" value={student.hobi} />
                        <InfoRow label="Melanjutkan Ke" value={student.melanjutkanKe} icon={GraduationCap} />
                        <InfoRow label="Tanggal Lulus" value={formatDate(student.tanggalLulus)} icon={Calendar} />
                        <InfoRow label="Alasan Pindah" value={student.alasanPindah} icon={History} />
                    </div>
                </section>
            </div>
        </main>
      </div>
    </div>
  );
}
