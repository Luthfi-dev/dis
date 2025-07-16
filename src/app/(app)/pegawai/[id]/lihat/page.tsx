
'use client';
import { Pegawai, mockPegawaiData } from '@/lib/pegawai-data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FilePen, ArrowLeft, Building, User, Calendar, Mail, Phone, MapPin, Droplet, Stethoscope, BookOpen, File as FileIcon, Image as ImageIcon, Users, Languages, GraduationCap, School, HeartHandshake, Home, Briefcase, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { getDesaName, getKecamatanName, getKabupatenName } from '@/lib/wilayah';


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

function MultiDocumentItem({ label, documents }: { label: string; documents?: { fileName: string, fileURL?: string }[]}) {
    if (!documents || documents.length === 0) {
        return <DetailItem label={label} value="-" icon={FileIcon} />;
    }

    return (
        <div className="md:col-span-2">
             <DetailItem 
                label={label} 
                value={
                    <ul className="list-disc list-inside space-y-1">
                        {documents.map((doc, index) => (
                             <li key={index}>
                                <a href={doc.fileURL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                                    {doc.fileName}
                                </a>
                            </li>
                        ))}
                    </ul>
                } 
                icon={FileIcon} 
            />
        </div>
    );
}


export default function LihatPegawaiPage({ params: { id } }: { params: { id: string } }) {
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

  if (!pegawai) {
    notFound();
  }
  
  const pegawaiStatus = pegawai.status === 'Lengkap' ? 'Lengkap' : 'Belum Lengkap';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4">
        <Button variant="outline" asChild>
          <Link href="/pegawai">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center truncate">Detail Pegawai</h1>
        <Button asChild>
          <Link href={`/pegawai/${pegawai.id}/edit`}>
            <FilePen className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-col sm:flex-row items-start gap-4">
             {pegawai.phaspoto?.fileURL ? (
                <Image src={pegawai.phaspoto.fileURL} alt="Foto Pegawai" width={100} height={133} className="border object-cover" />
             ) : (
                <div className="w-24 h-32 bg-muted flex items-center justify-center border">
                    <User className="w-12 h-12 text-muted-foreground" />
                </div>
             )}
            <div className="flex-1">
                <CardTitle className="text-2xl">{pegawai.nama}</CardTitle>
                 <div className="text-muted-foreground mt-2 space-y-2">
                    <div className="flex items-center gap-2"><Briefcase className='w-4 h-4' /> {pegawai.jabatan}</div>
                    <div className="flex items-center gap-2"><BookOpen className='w-4 h-4' /> {pegawai.bidangStudi}</div>
                </div>
                <Badge variant={pegawaiStatus === 'Lengkap' ? 'default' : 'outline'} className={`mt-4 ${pegawaiStatus === 'Lengkap' ? 'bg-green-100 text-green-800' : 'text-amber-600 border-amber-500/50'}`}>
                    Status: {pegawaiStatus}
                </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
             <div>
                <h3 className="text-lg font-semibold mb-2 border-b pb-2">Identitas Pegawai</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <DetailItem label="NIP" value={pegawai.nip} icon={User} />
                    <DetailItem label="NUPTK" value={pegawai.nuptk} icon={User} />
                    <DetailItem label="NRG" value={pegawai.nrg} icon={User} />
                    <DetailItem label="Jenis Kelamin" value={pegawai.jenisKelamin} icon={Users} />
                    <DetailItem label="Tempat Lahir" value={pegawai.tempatLahir} icon={MapPin} />
                    <DetailItem label="Tanggal Lahir" value={formatDate(pegawai.tanggalLahir)} icon={Calendar}/>
                    <DetailItem label="Status Perkawinan" value={pegawai.statusPerkawinan} icon={HeartHandshake} />
                    <DetailItem label="Tanggal Perkawinan" value={formatDate(pegawai.tanggalPerkawinan)} icon={Calendar} />
                    <DetailItem label="Nama Pasangan" value={pegawai.namaPasangan} icon={User} />
                    <DetailItem label="Jumlah Anak" value={pegawai.jumlahAnak} icon={Users} />
                    <DetailItem label="Tugas Tambahan" value={pegawai.tugasTambahan} icon={Briefcase} />
                    <DetailItem label="TMT" value={formatDate(pegawai.terhitungMulaiTanggal)} icon={Calendar} />
                </div>
             </div>
             <div>
                <h3 className="text-lg font-semibold mb-2 border-b pb-2">Alamat Rumah</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <DetailItem label="Kabupaten" value={getKabupatenName(pegawai.alamatKabupaten)} icon={Home}/>
                    <DetailItem label="Kecamatan" value={getKecamatanName(pegawai.alamatKecamatan)} icon={Home}/>
                    <DetailItem label="Desa" value={getDesaName(pegawai.alamatDesa)} icon={Home}/>
                    <DetailItem label="Dusun" value={pegawai.alamatDusun} icon={Home}/>
                </div>
             </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
            <CardHeader><CardTitle>Riwayat Pendidikan</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                 <h4 className="font-semibold text-md">SD/MI</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <DetailItem label="Tamat Tahun" value={pegawai.pendidikanSD?.tamatTahun} icon={Calendar} />
                    <DocumentItem label="Ijazah" document={pegawai.pendidikanSD?.ijazah} />
                 </div>
                 <Separator/>
                 <h4 className="font-semibold text-md">SMP/MTs</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <DetailItem label="Tamat Tahun" value={pegawai.pendidikanSMP?.tamatTahun} icon={Calendar} />
                    <DocumentItem label="Ijazah" document={pegawai.pendidikanSMP?.ijazah} />
                 </div>
                 <Separator/>
                 <h4 className="font-semibold text-md">SMA/MA</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <DetailItem label="Tamat Tahun" value={pegawai.pendidikanSMA?.tamatTahun} icon={Calendar} />
                    <DocumentItem label="Ijazah" document={pegawai.pendidikanSMA?.ijazah} />
                 </div>
                 <Separator/>
                 <h4 className="font-semibold text-md">Diploma</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <DetailItem label="Tamat Tahun" value={pegawai.pendidikanDiploma?.tamatTahun} icon={Calendar} />
                    <DocumentItem label="Ijazah" document={pegawai.pendidikanDiploma?.ijazah} />
                 </div>
                 <Separator/>
                 <h4 className="font-semibold text-md">S1</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <DetailItem label="Tamat Tahun" value={pegawai.pendidikanS1?.tamatTahun} icon={Calendar} />
                    <DocumentItem label="Ijazah" document={pegawai.pendidikanS1?.ijazah} />
                 </div>
                  <Separator/>
                 <h4 className="font-semibold text-md">S2</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <DetailItem label="Tamat Tahun" value={pegawai.pendidikanS2?.tamatTahun} icon={Calendar} />
                    <DocumentItem label="Ijazah" document={pegawai.pendidikanS2?.ijazah} />
                 </div>
            </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader><CardTitle>File Pegawai</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <MultiDocumentItem label="SK Pengangkatan Pegawai" documents={pegawai.skPengangkatan} />
              <DocumentItem label="SK NIP Baru" document={pegawai.skNipBaru} />
              <MultiDocumentItem label="SK Fungsional" documents={pegawai.skFungsional} />
              <DocumentItem label="Berita Acara Sumpah PNS" document={pegawai.beritaAcaraSumpah} />
              <DocumentItem label="Sertifikat Pendidik" document={pegawai.sertifikatPendidik} />
              <MultiDocumentItem label="Sertifikat Pelatihan" documents={pegawai.sertifikatPelatihan} />
              <MultiDocumentItem label="SKP" documents={pegawai.skp} />
              <DocumentItem label="Karpeg" document={pegawai.karpeg} />
              <DocumentItem label="Karis/Karsu" document={pegawai.karisKarsu} />
              <DocumentItem label="Buku Nikah" document={pegawai.bukuNikah} />
              <DocumentItem label="Kartu Keluarga" document={pegawai.kartuKeluarga} />
              <DocumentItem label="KTP" document={pegawai.ktp} />
              <DocumentItem label="Akte Kelahiran" document={pegawai.akteKelahiran} />
              <DocumentItem label="Kartu Peserta Taspen" document={pegawai.kartuTaspen} />
              <DocumentItem label="NPWP" document={pegawai.npwp} />
              <DocumentItem label="Kartu BPJS / ASKES" document={pegawai.kartuBpjs} />
              <DocumentItem label="Buku Rekening Gaji" document={pegawai.bukuRekening} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
