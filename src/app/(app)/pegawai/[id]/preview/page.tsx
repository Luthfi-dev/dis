
'use client';
import { Pegawai, mockPegawaiData } from '@/lib/pegawai-data';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Printer, User, Calendar, MapPin, Briefcase, Home, Users, HeartHandshake, School, GraduationCap, FileText, CheckCircle2, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getDesaName, getKecamatanName, getKabupatenName } from '@/lib/wilayah';

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

function PendidikanRow({ level, data }: { level: string, data?: { tamatTahun?: string, ijazah?: { fileName?: string }}}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 p-4 bg-muted/50 rounded-lg">
            <InfoRow label="Tingkat" value={level} icon={GraduationCap} />
            <InfoRow label="Tamat Tahun" value={data?.tamatTahun} icon={Calendar} />
            <InfoRow label="Ijazah" value={data?.ijazah?.fileName || 'Tidak ada'} icon={FileText} />
        </div>
    )
}

export default function PreviewPegawaiPage({ params: { id } }: { params: { id: string } }) {
  const [pegawai, setPegawai] = useState<Pegawai | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('pegawaiData');
      const allPegawai: Pegawai[] = storedData ? JSON.parse(storedData) : mockPegawaiData;
      const foundPegawai = allPegawai.find(s => s.id === id);
      
      if (foundPegawai) {
        setPegawai(foundPegawai);
      }
    } catch (error) {
      console.error("Failed to parse pegawai data from localStorage", error);
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

  if (!pegawai) {
    notFound();
  }

  const formatDate = (dateString?: string | Date) => {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  }
  
  const pegawaiStatus = pegawai.status === 'Lengkap';

  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-4 md:p-8 print:bg-white">
      <div className="max-w-4xl mx-auto bg-white dark:bg-card rounded-xl shadow-2xl print:shadow-none print:border-none">
        <div className="p-6 sm:p-10 flex justify-between items-center print:hidden">
            <Button variant="outline" asChild>
                <Link href="/pegawai">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Link>
            </Button>
            <h2 className="text-xl font-semibold text-center text-primary">Resume Buku Induk Pegawai</h2>
            <Button onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" />
                Cetak
            </Button>
        </div>

        <main className="p-6 sm:p-10">
            {/* Header */}
            <header className="flex flex-col sm:flex-row items-center gap-6 mb-8 text-center sm:text-left">
                {pegawai.phaspoto?.fileURL ? (
                    <Image src={pegawai.phaspoto.fileURL} alt="Foto Pegawai" width={128} height={170} className="border-4 border-primary/20 shadow-lg object-cover w-32 h-40" />
                ) : (
                    <div className="w-32 h-40 rounded-lg bg-muted flex items-center justify-center border-4 border-primary/20 shadow-lg">
                        <User className="w-20 h-20 text-muted-foreground" />
                    </div>
                )}
                <div>
                    <h1 className="text-3xl font-bold text-card-foreground">{pegawai.nama}</h1>
                    <p className="text-lg text-muted-foreground">NIP: {pegawai.nip || '-'}</p>
                     <Badge variant={pegawaiStatus ? 'default' : 'destructive'} className="mt-2">
                        {pegawaiStatus ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <XCircle className="mr-2 h-4 w-4" />}
                        Status: {pegawai.status}
                    </Badge>
                </div>
            </header>
            
            <Separator className="my-8" />
            
            <div className="space-y-10">
                <section>
                    <h3 className="font-bold text-xl mb-4 border-b-2 border-primary pb-2 text-primary">A. Identitas Pegawai</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                        <InfoRow label="Nama Lengkap" value={pegawai.nama} icon={User} />
                        <InfoRow label="Jenis Kelamin" value={pegawai.jenisKelamin} icon={Users} />
                        <InfoRow label="Tempat, Tgl Lahir" value={`${pegawai.tempatLahir}, ${formatDate(pegawai.tanggalLahir)}`} icon={Calendar} />
                        <InfoRow label="NIP" value={pegawai.nip} icon={FileText} />
                        <InfoRow label="NUPTK" value={pegawai.nuptk} icon={FileText} />
                        <InfoRow label="NRG" value={pegawai.nrg} icon={FileText} />
                        <InfoRow label="Jabatan" value={pegawai.jabatan} icon={Briefcase}/>
                        <InfoRow label="Bidang Studi" value={pegawai.bidangStudi} icon={School}/>
                        <InfoRow label="Tugas Tambahan" value={pegawai.tugasTambahan} icon={Briefcase}/>
                        <InfoRow label="TMT" value={formatDate(pegawai.terhitungMulaiTanggal)} icon={Calendar}/>
                    </div>
                </section>

                <section>
                    <h3 className="font-bold text-xl mb-4 border-b-2 border-primary pb-2 text-primary">B. Status Keluarga</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                        <InfoRow label="Status Perkawinan" value={pegawai.statusPerkawinan} icon={HeartHandshake} />
                        <InfoRow label="Tgl Perkawinan" value={formatDate(pegawai.tanggalPerkawinan)} icon={Calendar} />
                        <InfoRow label="Nama Pasangan" value={pegawai.namaPasangan} icon={User} />
                        <InfoRow label="Jumlah Anak" value={pegawai.jumlahAnak} icon={Users} />
                    </div>
                </section>
                
                <section>
                    <h3 className="font-bold text-xl mb-4 border-b-2 border-primary pb-2 text-primary">C. Alamat Rumah</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                         <InfoRow label="Kabupaten" value={getKabupatenName(pegawai.alamatKabupaten)} icon={MapPin} />
                         <InfoRow label="Kecamatan" value={getKecamatanName(pegawai.alamatKecamatan)} icon={MapPin} />
                         <InfoRow label="Desa" value={getDesaName(pegawai.alamatDesa)} icon={Home} />
                         <InfoRow label="Dusun" value={pegawai.alamatDusun} icon={Home} />
                    </div>
                </section>

                <section>
                    <h3 className="font-bold text-xl mb-4 border-b-2 border-primary pb-2 text-primary">D. Riwayat Pendidikan</h3>
                    <div className="space-y-4">
                        <PendidikanRow level="SD/MI" data={pegawai.pendidikanSD} />
                        <PendidikanRow level="SMP/MTs" data={pegawai.pendidikanSMP} />
                        <PendidikanRow level="SMA/MA" data={pegawai.pendidikanSMA} />
                        <PendidikanRow level="Diploma" data={pegawai.pendidikanDiploma} />
                        <PendidikanRow level="S1" data={pegawai.pendidikanS1} />
                        <PendidikanRow level="S2" data={pegawai.pendidikanS2} />
                    </div>
                </section>
            </div>
        </main>
      </div>
    </div>
  );
}
