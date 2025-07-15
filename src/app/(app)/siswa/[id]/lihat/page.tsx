
'use client';
import { Siswa, mockSiswaData } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FilePen, ArrowLeft, Building, User, Calendar, Mail, Phone, MapPin, Droplet, Stethoscope, BookOpen, File as FileIcon, Image as ImageIcon, Users, Languages, GraduationCap, School, HeartHandshake, Home, Briefcase, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { getDesaName, getKecamatanName, getKabupatenName, getProvinceName } from '@/lib/wilayah';
import { Separator } from '@/components/ui/separator';

function DetailItem({ label, value, icon }: { label: string; value: React.ReactNode; icon: React.ElementType }) {
  const Icon = icon;
  return (
    <div className="flex items-start gap-4 py-2">
      <Icon className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
      <div className="flex flex-col gap-1 w-full">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="text-base break-words font-semibold">{value || '-'}</div>
      </div>
    </div>
  );
}

function DocumentItem({ label, document }: { label: string; document?: { fileName: string, fileURL?: string }}) {
    if (!document || !document.fileName) {
        return <DetailItem label={label} value="-" icon={FileIcon} />;
    }

    const isImage = document.fileName.match(/\.(jpg|jpeg|png|gif)$/i);
    const Icon = isImage ? ImageIcon : FileIcon;

    return (
        <DetailItem 
            label={label} 
            value={
                <a href={document.fileURL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                    {document.fileName}
                </a>
            } 
            icon={Icon} 
        />
    );
}

export default function LihatSiswaPage({ params: { id } }: { params: { id: string } }) {
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

    const formatDate = (dateString?: string | Date) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    }

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
  
  const studentStatus = student.status === 'Lengkap' ? 'Lengkap' : 'Belum Lengkap';

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
          <CardHeader className="flex flex-col sm:flex-row items-start gap-4">
             {student.fotoProfil?.fileURL ? (
                <Image src={student.fotoProfil.fileURL} alt="Foto Profil" width={100} height={100} className="rounded-full border object-cover" />
             ) : (
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border">
                    <User className="w-12 h-12 text-muted-foreground" />
                </div>
             )}
            <div className="flex-1">
                <CardTitle className="text-2xl">{student.namaLengkap}</CardTitle>
                <CardDescription className='mt-2'>
                    <Badge variant={studentStatus === 'Lengkap' ? 'default' : 'outline'} className={studentStatus === 'Lengkap' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'text-amber-600 border-amber-500/50'}>
                        Status: {studentStatus}
                    </Badge>
                </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
             <div>
                <h3 className="text-lg font-semibold mb-2 border-b pb-2">Data Pribadi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <DetailItem label="NIS" value={student.nis} icon={User} />
                    <DetailItem label="NISN" value={student.nisn} icon={User} />
                    <DetailItem label="Jenis Kelamin" value={
                        <Badge variant={student.jenisKelamin === 'Laki-laki' ? 'default' : 'secondary'} className={student.jenisKelamin === 'Perempuan' ? 'bg-pink-100 text-pink-800' : ''}>
                            {student.jenisKelamin}
                        </Badge>
                    } icon={Users} />
                    <DetailItem label="Tempat Lahir" value={student.tempatLahir} icon={MapPin} />
                    <DetailItem label="Tanggal Lahir" value={formatDate(student.tanggalLahir)} icon={Calendar}/>
                    <DetailItem label="Agama" value={student.agama} icon={BookOpen} />
                    <DetailItem label="Kewarganegaraan" value={student.kewarganegaraan} icon={MapPin}/>
                    <DetailItem label="Jumlah Saudara" value={student.jumlahSaudara} icon={Users} />
                    <DetailItem label="Bahasa Sehari-hari" value={student.bahasa} icon={Languages}/>
                    <DetailItem label="Nomor HP/WA" value={student.telepon} icon={Phone}/>
                </div>
             </div>
             <div>
                <h3 className="text-lg font-semibold mb-2 border-b pb-2">Alamat Sesuai KK</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <DetailItem label="Kabupaten" value={getKabupatenName(student.alamatKkKabupaten)} icon={Home}/>
                    <DetailItem label="Kecamatan" value={getKecamatanName(student.alamatKkKecamatan)} icon={Home}/>
                    <DetailItem label="Desa" value={getDesaName(student.alamatKkDesa)} icon={Home}/>
                    <DetailItem label="Provinsi" value={getProvinceName(student.alamatKkProvinsi)} icon={Home}/>
                </div>
             </div>
             <div>
                <h3 className="text-lg font-semibold mb-2 border-b pb-2">Alamat Domisili</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <DetailItem label="Provinsi" value={getProvinceName(student.domisiliProvinsi)} icon={MapPin}/>
                    <DetailItem label="Kabupaten" value={getKabupatenName(student.domisiliKabupaten)} icon={MapPin}/>
                    <DetailItem label="Kecamatan" value={getKecamatanName(student.domisiliKecamatan)} icon={MapPin}/>
                    <DetailItem label="Desa" value={getDesaName(student.domisiliDesa)} icon={MapPin}/>
                </div>
             </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
            <CardHeader><CardTitle>Dokumen Utama</CardTitle></CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <DocumentItem label="Kartu Keluarga" document={student.documents?.kartuKeluarga} />
                    <DocumentItem label="KTP Ayah" document={student.documents?.ktpAyah} />
                    <DocumentItem label="KTP Ibu" document={student.documents?.ktpIbu} />
                    <DocumentItem label="Kartu Indonesia Pintar" document={student.documents?.kartuIndonesiaPintar} />
                    <DocumentItem label="Ijazah" document={student.documents?.ijazah} />
                    <DocumentItem label="Akta Kelahiran" document={student.documents?.aktaKelahiran} />
                    <DocumentItem label="Akte Kematian Ayah" document={student.documents?.akteKematianAyah} />
                    <DocumentItem label="Akte Kematian Ibu" document={student.documents?.akteKematianIbu} />
                </div>
            </CardContent>
        </Card>

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Keterangan Orang Tua / Wali</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold text-md mb-2">a. Nama Orang Tua Kandung</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <DetailItem label="Nama Ayah" value={student.namaAyah} icon={User}/>
                        <DetailItem label="Nama Ibu" value={student.namaIbu} icon={User}/>
                    </div>
                </div>
                <Separator/>
                <div>
                    <h4 className="font-semibold text-md mb-2">b. Pendidikan & Pekerjaan</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <DetailItem label="Pendidikan Tertinggi Ayah" value={student.pendidikanAyah} icon={GraduationCap}/>
                        <DetailItem label="Pekerjaan Ayah" value={student.pekerjaanAyah} icon={Briefcase}/>
                        <DetailItem label="Pendidikan Tertinggi Ibu" value={student.pendidikanIbu} icon={GraduationCap}/>
                        <DetailItem label="Pekerjaan Ibu" value={student.pekerjaanIbu} icon={Briefcase}/>
                    </div>
                </div>
                <Separator/>
                <div>
                    <h4 className="font-semibold text-md mb-2">c. Wali Murid</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <DetailItem label="Nama Wali" value={student.namaWali} icon={HeartHandshake}/>
                        <DetailItem label="Hubungan Keluarga" value={student.hubunganWali} icon={Users}/>
                        <DetailItem label="Pendidikan Terakhir" value={student.pendidikanWali} icon={GraduationCap}/>
                        <DetailItem label="Pekerjaan" value={student.pekerjaanWali} icon={Briefcase}/>
                    </div>
                </div>
                <Separator/>
                <div>
                    <h4 className="font-semibold text-md mb-2">d. Kontak & Alamat Orang Tua / Wali</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <DetailItem label="Alamat" value={student.alamatOrangTua} icon={Home}/>
                        <DetailItem label="Telepon" value={student.teleponOrangTua} icon={Phone}/>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="shadow-lg">
            <CardHeader><CardTitle>Rincian Kesehatan</CardTitle></CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <DetailItem label="Golongan Darah" value={student.golonganDarah} icon={Droplet} />
                    <DetailItem label="Tinggi Badan (cm)" value={student.tinggiBadan} icon={Stethoscope} />
                    <DetailItem label="Berat Badan (kg)" value={student.beratBadan} icon={Stethoscope} />
                    <DetailItem label="Riwayat Penyakit" value={student.penyakit} icon={Stethoscope} />
                    <DetailItem label="Kelainan Jasmani" value={student.kelainanJasmani} icon={Stethoscope} />
                </div>
            </CardContent>
        </Card>
        
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Perkembangan Siswa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold text-md mb-2">Pendidikan Sebelumnya (Siswa Baru)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <DetailItem label="Asal Sekolah" value={student.asalSekolah} icon={School}/>
                        <DetailItem label="Nomor STTB" value={student.nomorSttb} icon={FileText}/>
                        <DetailItem label="Tanggal STTB" value={formatDate(student.tanggalSttb)} icon={Calendar}/>
                    </div>
                </div>
                <Separator/>
                <div>
                    <h4 className="font-semibold text-md mb-2">Pendidikan Sebelumnya (Pindahan)</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <DetailItem label="Asal Sekolah" value={student.pindahanAsalSekolah} icon={School}/>
                        <DetailItem label="Dari Tingkat" value={student.pindahanDariTingkat} icon={GraduationCap}/>
                        <DetailItem label="Diterima Tanggal" value={formatDate(student.pindahanDiterimaTanggal)} icon={Calendar}/>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Meninggalkan Sekolah</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <h4 className="font-semibold text-md mb-2">Tamat Belajar / Lulus</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <DetailItem label="Tahun" value={student.lulusTahun} icon={Calendar}/>
                        <DetailItem label="Nomor Ijazah" value={student.lulusNomorIjazah} icon={FileText}/>
                        <DetailItem label="Melanjutkan Ke" value={student.lulusMelanjutkanKe} icon={Building}/>
                    </div>
                </div>
                <Separator/>
                <div>
                    <h4 className="font-semibold text-md mb-2">Pindah Sekolah</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <DetailItem label="Tingkat Kelas Ditinggalkan" value={student.pindahTingkatKelas} icon={GraduationCap}/>
                        <DetailItem label="Ke Sekolah" value={student.pindahKeSekolah} icon={Building}/>
                        <DetailItem label="Ke Tingkat" value={student.pindahKeTingkat} icon={GraduationCap}/>
                    </div>
                </div>
                <Separator/>
                <div>
                    <h4 className="font-semibold text-md mb-2">Keluar Sekolah</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <DetailItem label="Alasan Keluar" value={student.keluarAlasan} icon={FileText}/>
                        <DetailItem label="Tanggal Keluar" value={formatDate(student.keluarTanggal)} icon={Calendar}/>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="shadow-lg">
            <CardHeader><CardTitle>Laporan Hasil Capaian Belajar</CardTitle></CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <DocumentItem label="Rapor Semester 1" document={student.documents?.raporSmt1} />
                    <DocumentItem label="Rapor Semester 2" document={student.documents?.raporSmt2} />
                    <DocumentItem label="Rapor Semester 3" document={student.documents?.raporSmt3} />
                    <DocumentItem label="Rapor Semester 4" document={student.documents?.raporSmt4} />
                    <DocumentItem label="Rapor Semester 5" document={student.documents?.raporSmt5} />
                    <DocumentItem label="Rapor Semester 6" document={student.documents?.raporSmt6} />
                    <DocumentItem label="Ijazah SMP" document={student.documents?.ijazahSmp} />
                    <DocumentItem label="Transkrip SMP" document={student.documents?.transkripSmp} />
                </div>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
