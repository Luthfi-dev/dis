
'use client';

import { useState, useTransition, useEffect, useMemo } from 'react';
import { useForm, FormProvider, useFormContext, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pegawaiFormSchema, PegawaiFormData, dataIdentitasPegawaiSchema, filePegawaiSchema } from '@/lib/pegawai-schema';
import { FormStepper } from './form-stepper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, ArrowRight, CalendarIcon, UploadCloud, User, FileCheck2, Trash2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { submitPegawaiData } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import type { Pegawai } from '@/lib/pegawai-data';
import Image from 'next/image';
import { Separator } from './ui/separator';
import { getKabupatens, getKecamatans, getDesas, Wilayah } from '@/lib/wilayah';
import { Combobox } from './ui/combobox';

const steps = [
  { id: 1, title: 'Identitas Pegawai', schema: dataIdentitasPegawaiSchema },
  { id: 2, title: 'File Pegawai', schema: filePegawaiSchema },
  { id: 3, title: 'Validasi' },
];

const initialFormValues: PegawaiFormData = {
    phaspoto: { fileName: '', file: undefined, fileURL: ''},
    nama: '',
    jenisKelamin: undefined,
    tempatLahir: '',
    tanggalLahir: undefined,
    nip: '',
    nuptk: '',
    nrg: '',
    statusPerkawinan: undefined,
    tanggalPerkawinan: undefined,
    namaPasangan: '',
    jumlahAnak: 0,
    jabatan: '',
    bidangStudi: '',
    tugasTambahan: undefined,
    terhitungMulaiTanggal: undefined,
    alamatDusun: '',
    alamatDesa: '',
    alamatKecamatan: '',
    alamatKabupaten: '',
    pendidikanSD: { tamatTahun: '', ijazah: { fileName: '' } },
    pendidikanSMP: { tamatTahun: '', ijazah: { fileName: '' } },
    pendidikanSMA: { tamatTahun: '', ijazah: { fileName: '' } },
    pendidikanDiploma: { tamatTahun: '', ijazah: { fileName: '' } },
    pendidikanS1: { tamatTahun: '', ijazah: { fileName: '' } },
    pendidikanS2: { tamatTahun: '', ijazah: { fileName: '' } },
    skPengangkatan: [],
    skNipBaru: undefined,
    skFungsional: [],
    beritaAcaraSumpah: undefined,
    sertifikatPendidik: undefined,
    sertifikatPelatihan: [],
    skp: [],
    karpeg: undefined,
    karisKarsu: undefined,
    bukuNikah: undefined,
    kartuKeluarga: undefined,
    ktp: undefined,
    akteKelahiran: undefined,
    kartuTaspen: undefined,
    npwp: undefined,
    kartuBpjs: undefined,
    bukuRekening: undefined,
};


export function PegawaiForm({ pegawaiData }: { pegawaiData?: Partial<Pegawai> & { tanggalLahir?: string | Date, tanggalPerkawinan?: string | Date, terhitungMulaiTanggal?: string | Date } }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const methods = useForm<PegawaiFormData>({
    resolver: zodResolver(pegawaiFormSchema),
    mode: 'onBlur', 
    defaultValues: pegawaiData
      ? {
        ...initialFormValues,
        ...pegawaiData,
        tanggalLahir: pegawaiData.tanggalLahir ? new Date(pegawaiData.tanggalLahir) : undefined,
        tanggalPerkawinan: pegawaiData.tanggalPerkawinan ? new Date(pegawaiData.tanggalPerkawinan) : undefined,
        terhitungMulaiTanggal: pegawaiData.terhitungMulaiTanggal ? new Date(pegawaiData.terhitungMulaiTanggal) : undefined,
      }
      : initialFormValues,
  });

  const { trigger, handleSubmit } = methods;

  const handleNext = async () => {
    const currentStepConfig = steps[currentStep - 1];
    let isValid = true;
    if (currentStepConfig.schema) {
      isValid = await trigger(Object.keys(currentStepConfig.schema.shape) as any, { shouldFocus: true });
    }
    
    if (isValid && currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const processForm = async (data: PegawaiFormData) => {
    startTransition(async () => {
        const dataWithURLs = { ...data };

        const processFile = (fileData: any) => {
            if (fileData?.file instanceof File) {
                fileData.fileURL = URL.createObjectURL(fileData.file);
            }
        };

        const processMultiFile = (files: any[]) => {
            if (Array.isArray(files)) {
                files.forEach(fileData => processFile(fileData));
            }
        };

        processFile(dataWithURLs.phaspoto);
        processFile(dataWithURLs.pendidikanSD?.ijazah);
        processFile(dataWithURLs.pendidikanSMP?.ijazah);
        processFile(dataWithURLs.pendidikanSMA?.ijazah);
        processFile(dataWithURLs.pendidikanDiploma?.ijazah);
        processFile(dataWithURLs.pendidikanS1?.ijazah);
        processFile(dataWithURLs.pendidikanS2?.ijazah);

        processMultiFile(dataWithURLs.skPengangkatan);
        processFile(dataWithURLs.skNipBaru);
        processMultiFile(dataWithURLs.skFungsional);
        processFile(dataWithURLs.beritaAcaraSumpah);
        processFile(dataWithURLs.sertifikatPendidik);
        processMultiFile(dataWithURLs.sertifikatPelatihan);
        processMultiFile(dataWithURLs.skp);
        processFile(dataWithURLs.karpeg);
        processFile(dataWithURLs.karisKarsu);
        processFile(dataWithURLs.bukuNikah);
        processFile(dataWithURLs.kartuKeluarga);
        processFile(dataWithURLs.ktp);
        processFile(dataWithURLs.akteKelahiran);
        processFile(dataWithURLs.kartuTaspen);
        processFile(dataWithURLs.npwp);
        processFile(dataWithURLs.kartuBpjs);
        processFile(dataWithURLs.bukuRekening);

        const result = await pegawaiFormSchema.safeParseAsync(data);
        const status = result.success ? 'Lengkap' : 'Belum Lengkap';
        const finalData = { ...dataWithURLs, id: pegawaiData?.id, status };
        
        const submissionResult = await submitPegawaiData(finalData);

        if (submissionResult.success) {
            toast({
                title: 'Sukses!',
                description: submissionResult.message,
                variant: 'default',
            });

            let existingPegawai: Pegawai[] = JSON.parse(localStorage.getItem('pegawaiData') || '[]');
            const newPegawai: Pegawai = { ...finalData, id: submissionResult.id };

            if (pegawaiData?.id) {
                existingPegawai = existingPegawai.map(p => p.id === pegawaiData.id ? newPegawai : p);
            } else {
                existingPegawai.push(newPegawai);
            }
            localStorage.setItem('pegawaiData', JSON.stringify(existingPegawai));

            router.push('/pegawai');
            router.refresh();

        } else {
            toast({
                title: 'Error',
                description: submissionResult.message,
                variant: 'destructive',
            });
        }
    });
};

  return (
    <FormProvider {...methods}>
      <div className="mt-12">
        <FormStepper steps={steps} currentStep={currentStep} />
      </div>
      <form onSubmit={handleSubmit(processForm)}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>Sesi {currentStep} dari {steps.length}. Kolom dengan tanda * wajib diisi.</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && <DataIdentitasPegawaiForm />}
            {currentStep === 2 && <FilePegawaiForm />}
            {currentStep === 3 && <DataValidasiForm />}
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-between">
          <Button type="button" variant="outline" onClick={handlePrev} disabled={currentStep === 1}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          {currentStep < steps.length ? (
            <Button type="button" onClick={handleNext}>
              Lanjut
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Data
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

function Grid({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4", className)}>{children}</div>;
}

function FormLabelRequired({ children }: { children: React.ReactNode }) {
    return <FormLabel>{children} <span className="text-destructive">*</span></FormLabel>
}

function DataIdentitasPegawaiForm() {
  const { control, watch, setValue, getValues } = useFormContext<PegawaiFormData>();
  const [preview, setPreview] = useState<string | null>(getValues('phaspoto.fileURL') || null);
  
  useEffect(() => {
    const fileURL = getValues('phaspoto.fileURL');
    if(fileURL && !preview) {
        setPreview(fileURL);
    }
    const subscription = watch((value, { name }) => {
      if (name === 'phaspoto') {
        const file = value.phaspoto?.file;
        if (file instanceof File) {
          const newPreview = URL.createObjectURL(file);
          setPreview(newPreview);
        } else if (value.phaspoto?.fileURL) {
          setPreview(value.phaspoto.fileURL);
        } else {
          setPreview(null);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, getValues, preview]);

  const [allKabupatens, setAllKabupatens] = useState<Wilayah[]>([]);
  
  const alamatKabupaten = watch('alamatKabupaten');
  const alamatKecamatan = watch('alamatKecamatan');
  
  useEffect(() => {
    setAllKabupatens(getKabupatens());
  }, []);

  const kecamatans = useMemo(() => getKecamatans(alamatKabupaten), [alamatKabupaten]);
  const desas = useMemo(() => getDesas(alamatKecamatan), [alamatKecamatan]);

  const wilayahToOptions = (wilayah: Wilayah[]) => wilayah.map(w => ({ value: w.id, label: w.name }));

  useEffect(() => {
     if(!getValues('alamatKecamatan')) setValue('alamatKecamatan', '');
  }, [alamatKabupaten, setValue, getValues]);

  useEffect(() => {
    if(!getValues('alamatDesa')) setValue('alamatDesa', '');
  }, [alamatKecamatan, setValue, getValues]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('phaspoto', { fileName: file.name, file: file, fileURL: URL.createObjectURL(file) });
    }
  };

  const handlePendidikanFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof PegawaiFormData) => {
    const file = e.target.files?.[0];
    if (file) {
      const currentPendidikan = getValues(fieldName as any);
      setValue(fieldName as any, { ...currentPendidikan, ijazah: { fileName: file.name, file: file, fileURL: URL.createObjectURL(file) } });
    }
  };

  return (
    <div className="space-y-6">
       <FormField
        control={control}
        name="phaspoto"
        render={() => (
          <FormItem>
            <FormLabel>Phaspoto 3x4 cm</FormLabel>
            <div className="flex items-center gap-4">
                <div className="w-24 h-32 bg-muted flex items-center justify-center border relative">
                    {preview ? (
                        <Image src={preview} alt="Preview Phaspoto" layout="fill" objectFit="cover" />
                    ) : (
                        <User className="w-12 h-12 text-muted-foreground" />
                    )}
                </div>
                <FormControl>
                     <Button asChild variant="outline">
                        <label htmlFor="phaspoto-upload" className="cursor-pointer">
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Unggah Foto
                             <input id="phaspoto-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                    </Button>
                </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <Grid>
        <FormField control={control} name="nama" render={({ field }) => (
            <FormItem><FormLabelRequired>Nama</FormLabelRequired><FormControl><Input placeholder="Nama lengkap pegawai" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="jenisKelamin" render={({ field }) => (
            <FormItem><FormLabelRequired>Jenis Kelamin</FormLabelRequired><FormControl>
            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center space-x-4 pt-2">
                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Laki-laki" /></FormControl><FormLabel className="font-normal">Laki-laki</FormLabel></FormItem>
                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Perempuan" /></FormControl><FormLabel className="font-normal">Perempuan</FormLabel></FormItem>
            </RadioGroup>
            </FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="tempatLahir" render={({ field }) => (
            <FormItem><FormLabelRequired>Tempat Lahir</FormLabelRequired><FormControl><Input placeholder="Contoh: Jakarta" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="tanggalLahir" render={({ field }) => (
            <FormItem className="flex flex-col"><FormLabelRequired>Tanggal Lahir</FormLabelRequired><Popover>
            <PopoverTrigger asChild><FormControl>
                <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                {field.value ? format(field.value, "PPP") : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </FormControl></PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
            </PopoverContent>
            </Popover><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="nip" render={({ field }) => (
            <FormItem><FormLabel>NIP</FormLabel><FormControl><Input placeholder="Nomor Induk Pegawai" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="nuptk" render={({ field }) => (
            <FormItem><FormLabel>NUPTK</FormLabel><FormControl><Input placeholder="Nomor Unik Pendidik dan Tenaga Kependidikan" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
         <FormField control={control} name="nrg" render={({ field }) => (
            <FormItem><FormLabel>NRG</FormLabel><FormControl><Input placeholder="Nomor Registrasi Guru" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="statusPerkawinan" render={({ field }) => (
            <FormItem><FormLabelRequired>Status Perkawinan</FormLabelRequired><Select onValueChange={field.onChange} value={field.value}>
            <FormControl><SelectTrigger><SelectValue placeholder="Pilih Status" /></SelectTrigger></FormControl>
            <SelectContent>
                <SelectItem value="Belum Kawin">Belum Kawin</SelectItem>
                <SelectItem value="Kawin">Kawin</SelectItem>
                <SelectItem value="Cerai Hidup">Cerai Hidup</SelectItem>
                <SelectItem value="Cerai Mati">Cerai Mati</SelectItem>
            </SelectContent>
            </Select><FormMessage /></FormItem>
        )} />
         <FormField control={control} name="tanggalPerkawinan" render={({ field }) => (
            <FormItem className="flex flex-col"><FormLabel>Tanggal Perkawinan</FormLabel><Popover>
            <PopoverTrigger asChild><FormControl>
                <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                {field.value ? format(field.value, "PPP") : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </FormControl></PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus />
            </PopoverContent>
            </Popover><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="namaPasangan" render={({ field }) => (
            <FormItem><FormLabel>Nama Istri / Suami</FormLabel><FormControl><Input placeholder="Nama lengkap pasangan" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="jumlahAnak" render={({ field }) => (
            <FormItem><FormLabel>Jumlah Anak</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="jabatan" render={({ field }) => (
            <FormItem><FormLabelRequired>Jabatan</FormLabelRequired><FormControl><Input placeholder="Contoh: Guru" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="bidangStudi" render={({ field }) => (
            <FormItem><FormLabelRequired>Mengampu Bidang Studi</FormLabelRequired><FormControl><Input placeholder="Contoh: Matematika" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="tugasTambahan" render={({ field }) => (
            <FormItem><FormLabel>Tugas Tambahan</FormLabel><Select onValueChange={field.onChange} value={field.value}>
            <FormControl><SelectTrigger><SelectValue placeholder="Pilih Tugas Tambahan" /></SelectTrigger></FormControl>
            <SelectContent>
                <SelectItem value="Kepala Sekolah">Kepala Sekolah</SelectItem>
                <SelectItem value="Wakasek Bidang Kesiswaan">Wakasek Bidang Kesiswaan</SelectItem>
                <SelectItem value="Wakasek Bidang Kurikulum">Wakasek Bidang Kurikulum</SelectItem>
                <SelectItem value="Wakasek Bidang Sarana">Wakasek Bidang Sarana</SelectItem>
                <SelectItem value="Wakasek Bidang Humas">Wakasek Bidang Humas</SelectItem>
                <SelectItem value="Kepala LAB">Kepala LAB</SelectItem>
                <SelectItem value="Kepala Perpustakaan">Kepala Perpustakaan</SelectItem>
            </SelectContent>
            </Select><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="terhitungMulaiTanggal" render={({ field }) => (
            <FormItem className="flex flex-col"><FormLabelRequired>Terhitung Mulai Tanggal</FormLabelRequired><Popover>
            <PopoverTrigger asChild><FormControl>
                <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                {field.value ? format(field.value, "PPP") : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </FormControl></PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus />
            </PopoverContent>
            </Popover><FormMessage /></FormItem>
        )} />
      </Grid>
      <Separator className="my-6" />
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Alamat Rumah</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField control={control} name="alamatKabupaten" render={({ field }) => (
                    <FormItem><FormLabelRequired>Kabupaten</FormLabelRequired><FormControl>
                        <Combobox
                          options={wilayahToOptions(allKabupatens)}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Pilih Kabupaten..."
                          searchPlaceholder="Cari kabupaten..."
                        />
                    </FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={control} name="alamatKecamatan" render={({ field }) => (
                    <FormItem><FormLabelRequired>Kecamatan</FormLabelRequired><FormControl>
                        <Combobox
                          options={wilayahToOptions(kecamatans)}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Pilih Kecamatan..."
                          searchPlaceholder="Cari kecamatan..."
                          disabled={!alamatKabupaten}
                        />
                    </FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={control} name="alamatDesa" render={({ field }) => (
                    <FormItem><FormLabelRequired>Desa</FormLabelRequired><FormControl>
                        <Combobox
                          options={wilayahToOptions(desas)}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Pilih Desa..."
                          searchPlaceholder="Cari desa..."
                          disabled={!alamatKecamatan}
                        />
                    </FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={control} name="alamatDusun" render={({ field }) => (
                    <FormItem><FormLabelRequired>Dusun</FormLabelRequired><FormControl><Input placeholder="Nama Dusun" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
        </div>
        <Separator className="my-6" />
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pendidikan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                {/* SD/MI */}
                <div className="space-y-2">
                    <FormLabel>SD/MI</FormLabel>
                    <div className="flex gap-4">
                        <FormField control={control} name="pendidikanSD.tamatTahun" render={({ field }) => (
                            <FormItem className="flex-1"><FormControl><Input placeholder="Tamat tahun..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={control} name="pendidikanSD.ijazah" render={() => (
                             <FormItem><FormControl>
                                <Button asChild variant="outline"><label htmlFor="ijazah-sd-upload" className="cursor-pointer">
                                    <UploadCloud className="mr-2 h-4 w-4" /> Ijazah <input id="ijazah-sd-upload" type="file" accept=".pdf" className="hidden" onChange={(e) => handlePendidikanFileChange(e, 'pendidikanSD')} />
                                </label></Button>
                            </FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                     <p className="text-xs text-muted-foreground">{watch('pendidikanSD.ijazah.fileName')}</p>
                </div>
                {/* SMP/MTs */}
                <div className="space-y-2">
                    <FormLabel>SMP/MTs</FormLabel>
                    <div className="flex gap-4">
                        <FormField control={control} name="pendidikanSMP.tamatTahun" render={({ field }) => (
                            <FormItem className="flex-1"><FormControl><Input placeholder="Tamat tahun..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={control} name="pendidikanSMP.ijazah" render={() => (
                             <FormItem><FormControl>
                                <Button asChild variant="outline"><label htmlFor="ijazah-smp-upload" className="cursor-pointer">
                                    <UploadCloud className="mr-2 h-4 w-4" /> Ijazah <input id="ijazah-smp-upload" type="file" accept=".pdf" className="hidden" onChange={(e) => handlePendidikanFileChange(e, 'pendidikanSMP')} />
                                </label></Button>
                            </FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <p className="text-xs text-muted-foreground">{watch('pendidikanSMP.ijazah.fileName')}</p>
                </div>
                {/* SMA/MA */}
                 <div className="space-y-2">
                    <FormLabel>SMA/MA</FormLabel>
                    <div className="flex gap-4">
                        <FormField control={control} name="pendidikanSMA.tamatTahun" render={({ field }) => (
                            <FormItem className="flex-1"><FormControl><Input placeholder="Tamat tahun..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={control} name="pendidikanSMA.ijazah" render={() => (
                             <FormItem><FormControl>
                                <Button asChild variant="outline"><label htmlFor="ijazah-sma-upload" className="cursor-pointer">
                                    <UploadCloud className="mr-2 h-4 w-4" /> Ijazah <input id="ijazah-sma-upload" type="file" accept=".pdf" className="hidden" onChange={(e) => handlePendidikanFileChange(e, 'pendidikanSMA')} />
                                </label></Button>
                            </FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <p className="text-xs text-muted-foreground">{watch('pendidikanSMA.ijazah.fileName')}</p>
                </div>
                {/* Diploma */}
                 <div className="space-y-2">
                    <FormLabel>Diploma</FormLabel>
                    <div className="flex gap-4">
                        <FormField control={control} name="pendidikanDiploma.tamatTahun" render={({ field }) => (
                            <FormItem className="flex-1"><FormControl><Input placeholder="Tamat tahun..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={control} name="pendidikanDiploma.ijazah" render={() => (
                             <FormItem><FormControl>
                                <Button asChild variant="outline"><label htmlFor="ijazah-diploma-upload" className="cursor-pointer">
                                    <UploadCloud className="mr-2 h-4 w-4" /> Ijazah <input id="ijazah-diploma-upload" type="file" accept=".pdf" className="hidden" onChange={(e) => handlePendidikanFileChange(e, 'pendidikanDiploma')} />
                                </label></Button>
                            </FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <p className="text-xs text-muted-foreground">{watch('pendidikanDiploma.ijazah.fileName')}</p>
                </div>
                {/* S1 */}
                <div className="space-y-2">
                    <FormLabel>S1</FormLabel>
                    <div className="flex gap-4">
                        <FormField control={control} name="pendidikanS1.tamatTahun" render={({ field }) => (
                            <FormItem className="flex-1"><FormControl><Input placeholder="Tamat tahun..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={control} name="pendidikanS1.ijazah" render={() => (
                             <FormItem><FormControl>
                                <Button asChild variant="outline"><label htmlFor="ijazah-s1-upload" className="cursor-pointer">
                                    <UploadCloud className="mr-2 h-4 w-4" /> Ijazah <input id="ijazah-s1-upload" type="file" accept=".pdf" className="hidden" onChange={(e) => handlePendidikanFileChange(e, 'pendidikanS1')} />
                                </label></Button>
                            </FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <p className="text-xs text-muted-foreground">{watch('pendidikanS1.ijazah.fileName')}</p>
                </div>
                {/* S2 */}
                <div className="space-y-2">
                    <FormLabel>S2</FormLabel>
                    <div className="flex gap-4">
                        <FormField control={control} name="pendidikanS2.tamatTahun" render={({ field }) => (
                            <FormItem className="flex-1"><FormControl><Input placeholder="Tamat tahun..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={control} name="pendidikanS2.ijazah" render={() => (
                             <FormItem><FormControl>
                                <Button asChild variant="outline"><label htmlFor="ijazah-s2-upload" className="cursor-pointer">
                                    <UploadCloud className="mr-2 h-4 w-4" /> Ijazah <input id="ijazah-s2-upload" type="file" accept=".pdf" className="hidden" onChange={(e) => handlePendidikanFileChange(e, 'pendidikanS2')} />
                                </label></Button>
                            </FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <p className="text-xs text-muted-foreground">{watch('pendidikanS2.ijazah.fileName')}</p>
                </div>
            </div>
        </div>
    </div>
  );
}

function SingleFileUpload({ name, label }: { name: keyof PegawaiFormData, label: string }) {
    const { control, watch, setValue } = useFormContext<PegawaiFormData>();
    const watchedFile = watch(name as any);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue(name as any, { fileName: file.name, file: file, fileURL: URL.createObjectURL(file) });
        }
    };

    return (
        <FormField
            control={control}
            name={name as any}
            render={() => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <div className="flex items-center gap-4">
                        <FormControl>
                            <Button asChild variant="outline" className="w-full justify-start text-left font-normal">
                                <label htmlFor={`file-upload-${name}`} className="cursor-pointer">
                                    <UploadCloud className="mr-2 h-4 w-4" />
                                    <span className="truncate">
                                        {watchedFile?.fileName || 'Pilih file (PDF)...'}
                                    </span>
                                    <input
                                        id={`file-upload-${name}`}
                                        type="file"
                                        accept=".pdf"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </Button>
                        </FormControl>
                        {watchedFile?.fileName && (
                            <div className="flex items-center gap-2 text-green-600">
                                <FileCheck2 className="h-5 w-5" />
                                <span className="sr-only">Terunggah</span>
                            </div>
                        )}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

function MultiFileUpload({ name, label }: { name: keyof PegawaiFormData, label: string }) {
    const { control, setValue, getValues } = useFormContext<PegawaiFormData>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: name as any,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            append({ fileName: file.name, file: file, fileURL: URL.createObjectURL(file) });
        }
        // Reset input value to allow uploading the same file again after removing
        e.target.value = '';
    };

    return (
        <div className="md:col-span-2 space-y-2">
            <FormLabel>{label}</FormLabel>
            <div className="space-y-3">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2 p-2 border rounded-md">
                        <FileCheck2 className="h-5 w-5 text-green-600" />
                        <a href={getValues(`${name as any}.${index}.fileURL`)} target="_blank" rel="noopener noreferrer" className="flex-1 text-sm truncate hover:underline">
                            {getValues(`${name as any}.${index}.fileName`)}
                        </a>
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                ))}
            </div>
            <Button asChild variant="outline" size="sm" className="mt-2">
                <label htmlFor={`multifile-upload-${name}`} className="cursor-pointer">
                    <UploadCloud className="mr-2 h-4 w-4" /> Tambah File
                    <input
                        id={`multifile-upload-${name}`}
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
            </Button>
        </div>
    );
}


function FilePegawaiForm() {
    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <MultiFileUpload name="skPengangkatan" label="SK Pengangkatan Pegawai (dari 80% s.d Sekarang)" />
                <SingleFileUpload name="skNipBaru" label="SK NIP Baru" />
                <MultiFileUpload name="skFungsional" label="SK Fungsional" />
                <SingleFileUpload name="beritaAcaraSumpah" label="Berita Acara Pengambilan Sumpah PNS" />
                <SingleFileUpload name="sertifikatPendidik" label="Sertifikat Pendidik" />
                <MultiFileUpload name="sertifikatPelatihan" label="Sertifikat Pelatihan" />
                <MultiFileUpload name="skp" label="SKP" />
                <SingleFileUpload name="karpeg" label="Karpeg" />
                <SingleFileUpload name="karisKarsu" label="Karis/Karsu" />
                <SingleFileUpload name="bukuNikah" label="Buku Nikah" />
                <SingleFileUpload name="kartuKeluarga" label="Kartu Keluarga" />
                <SingleFileUpload name="ktp" label="KTP" />
                <SingleFileUpload name="akteKelahiran" label="Akte Kelahiran" />
                <SingleFileUpload name="kartuTaspen" label="Kartu Peserta Taspen" />
                <SingleFileUpload name="npwp" label="NPWP" />
                <SingleFileUpload name="kartuBpjs" label="Kartu BPJS / ASKES" />
                <SingleFileUpload name="bukuRekening" label="Buku Rekening Gaji" />
            </div>
        </div>
    )
}

function DataValidasiForm() {
  return (
    <div>
        <h3 className="text-lg font-semibold">Konfirmasi Data Pegawai</h3>
        <p className="text-muted-foreground">Harap periksa kembali semua data yang telah diisi. Klik simpan untuk menyelesaikan.</p>
    </div>
  )
}
