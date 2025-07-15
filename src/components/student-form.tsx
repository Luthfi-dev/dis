
'use client';

import { useState, useTransition, useCallback, useEffect, useMemo } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentFormSchema, StudentFormData, completeStudentFormSchema, dataSiswaSchema } from '@/lib/schema';
import { FormStepper } from './form-stepper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, ArrowRight, CalendarIcon, UploadCloud, FileCheck2, FileX2, User, ShieldCheck } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { submitStudentData } from '@/lib/actions';
import { Textarea } from './ui/textarea';
import { useRouter } from 'next/navigation';
import type { Siswa } from '@/lib/data';
import Image from 'next/image';
import { getProvinces, getKabupatens, getKecamatans, getDesas, Wilayah } from '@/lib/wilayah';
import { Combobox } from './ui/combobox';
import { Separator } from './ui/separator';

const steps = [
  { id: 1, title: 'Data Siswa', schema: dataSiswaSchema },
  { id: 2, title: 'Dokumen Utama' },
  { id: 3, title: 'Data Orang Tua' },
  { id: 4, title: 'Perkembangan Siswa' },
  { id: 5, title: 'Meninggalkan Sekolah' },
  { id: 6, title: 'Laporan Belajar' },
  { id: 7, title: 'Validasi' },
];

const initialFormValues: Partial<StudentFormData> = {
  fotoProfil: undefined,
  namaLengkap: '',
  nis: '',
  nisn: '',
  jenisKelamin: undefined,
  tempatLahir: '',
  tanggalLahir: undefined,
  agama: undefined,
  kewarganegaraan: undefined,
  jumlahSaudara: 0,
  bahasa: '',
  golonganDarah: undefined,
  telepon: '',
  alamatKkProvinsi: '',
  alamatKkKabupaten: '',
  alamatKkKecamatan: '',
  alamatKkDesa: '',
  domisiliProvinsi: '',
  domisiliKabupaten: '',
  domisiliKecamatan: '',
  domisiliDesa: '',
  namaAyah: '',
  namaIbu: '',
  pendidikanAyah: '',
  pendidikanIbu: '',
  pekerjaanAyah: '',
  pekerjaanIbu: '',
  namaWali: '',
  hubunganWali: '',
  pendidikanWali: '',
  pekerjaanWali: '',
  alamatOrangTua: '',
  teleponOrangTua: '',
  tinggiBadan: undefined,
  beratBadan: undefined,
  penyakit: '',
  kelainanJasmani: '',
  asalSekolah: '',
  nomorSttb: '',
  tanggalSttb: undefined,
  pindahanAsalSekolah: '',
  pindahanDariTingkat: '',
  pindahanDiterimaTanggal: undefined,
  lulusTahun: '',
  lulusNomorIjazah: '',
  lulusMelanjutkanKe: '',
  pindahKeSekolah: '',
  pindahTingkatKelas: '',
  pindahKeTingkat: '',
  keluarAlasan: '',
  keluarTanggal: undefined,
  documents: {
    kartuKeluarga: undefined,
    ktpAyah: undefined,
    ktpIbu: undefined,
    kartuIndonesiaPintar: undefined,
    ijazah: undefined,
    aktaKelahiran: undefined,
    akteKematianAyah: undefined,
    akteKematianIbu: undefined,
    raporSmt1: undefined,
    raporSmt2: undefined,
    raporSmt3: undefined,
    raporSmt4: undefined,
    raporSmt5: undefined,
    raporSmt6: undefined,
    ijazahSmp: undefined,
    transkripSmp: undefined,
  }
};


export function StudentForm({ studentData }: { studentData?: Partial<Siswa> & { tanggalLahir?: string | Date } }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const methods = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    mode: 'onBlur', 
    defaultValues: studentData
      ? {
        ...initialFormValues,
        ...studentData,
        tanggalLahir: studentData.tanggalLahir ? new Date(studentData.tanggalLahir) : undefined,
        tanggalSttb: studentData.tanggalSttb ? new Date(studentData.tanggalSttb) : undefined,
        pindahanDiterimaTanggal: studentData.pindahanDiterimaTanggal ? new Date(studentData.pindahanDiterimaTanggal) : undefined,
        keluarTanggal: studentData.keluarTanggal ? new Date(studentData.keluarTanggal) : undefined,
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

  const processForm = async (data: StudentFormData) => {
    startTransition(async () => {
        const dataWithURLs = { ...data };

        // Manually create temporary file URLs for preview if new files are uploaded
        if (data.fotoProfil?.file) {
            dataWithURLs.fotoProfil.fileURL = URL.createObjectURL(data.fotoProfil.file);
        }
        if (data.documents) {
            for (const key in data.documents) {
                const docKey = key as keyof typeof data.documents;
                const document = data.documents[docKey];
                if (document?.file) {
                    document.fileURL = URL.createObjectURL(document.file);
                }
            }
        }

        const result = await completeStudentFormSchema.safeParseAsync(data);
        const status = result.success ? 'Lengkap' : 'Belum Lengkap';
        const finalData = { ...dataWithURLs, id: studentData?.id, status };

        const submissionResult = await submitStudentData(finalData);

        if (submissionResult.success) {
            toast({
                title: 'Sukses!',
                description: submissionResult.message,
                variant: 'default',
            });

            // Update localStorage
            let existingStudents: Siswa[] = JSON.parse(localStorage.getItem('siswaData') || '[]');
            const newStudent: Siswa = { ...finalData, id: submissionResult.id };

            if (studentData?.id) {
                // Update existing student
                existingStudents = existingStudents.map(s => s.id === studentData.id ? newStudent : s);
            } else {
                // Add new student
                existingStudents.push(newStudent);
            }
            localStorage.setItem('siswaData', JSON.stringify(existingStudents));

            router.push('/siswa');
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


  useEffect(() => {
    if (studentData) {
        const studentDataWithDates = {
            ...studentData,
            tanggalLahir: studentData.tanggalLahir ? new Date(studentData.tanggalLahir) : undefined,
            tanggalSttb: studentData.tanggalSttb ? new Date(studentData.tanggalSttb) : undefined,
            pindahanDiterimaTanggal: studentData.pindahanDiterimaTanggal ? new Date(studentData.pindahanDiterimaTanggal) : undefined,
            keluarTanggal: studentData.keluarTanggal ? new Date(studentData.keluarTanggal) : undefined,
        };
        methods.reset({...initialFormValues, ...studentDataWithDates});
    }
  }, [studentData, methods]);

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
            {currentStep === 1 && <DataSiswaForm />}
            {currentStep === 2 && <DataDokumenUtamaForm />}
            {currentStep === 3 && <DataOrangTuaForm />}
            {currentStep === 4 && <DataPerkembanganForm />}
            {currentStep === 5 && <DataMeninggalkanSekolahForm />}
            {currentStep === 6 && <DataLaporanBelajarForm />}
            {currentStep === 7 && <DataValidasiForm />}
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

function DataSiswaForm() {
  const { control, watch, setValue, getValues } = useFormContext<StudentFormData>();
  const [preview, setPreview] = useState<string | null>(getValues('fotoProfil.fileURL') || null);
  
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'fotoProfil') {
        const file = value.fotoProfil?.file;
        if (file) {
          const newPreview = URL.createObjectURL(file);
          setPreview(newPreview);
        } else if (value.fotoProfil?.fileURL) {
          setPreview(value.fotoProfil.fileURL);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  
  const [provinces, setProvinces] = useState<Wilayah[]>([]);
  
  const alamatKkProvinsi = watch('alamatKkProvinsi');
  const alamatKkKabupaten = watch('alamatKkKabupaten');
  const alamatKkKecamatan = watch('alamatKkKecamatan');
  
  const domisiliProvinsi = watch('domisiliProvinsi');
  const domisiliKabupaten = watch('domisiliKabupaten');
  const domisiliKecamatan = watch('domisiliKecamatan');

  useEffect(() => {
    setProvinces(getProvinces());
  }, []);

  const kkKabupatens = useMemo(() => getKabupatens(alamatKkProvinsi), [alamatKkProvinsi]);
  const kkKecamatans = useMemo(() => getKecamatans(alamatKkKabupaten), [alamatKkKabupaten]);
  const kkDesas = useMemo(() => getDesas(alamatKkKecamatan), [alamatKkKecamatan]);

  const domisiliKabupatens = useMemo(() => getKabupatens(domisiliProvinsi), [domisiliProvinsi]);
  const domisiliKecamatans = useMemo(() => getKecamatans(domisiliKabupaten), [domisiliKabupaten]);
  const domisiliDesas = useMemo(() => getDesas(domisiliKecamatan), [domisiliKecamatan]);

  const wilayahToOptions = (wilayah: Wilayah[]) => wilayah.map(w => ({ value: w.id, label: w.name }));

  // Reset dependent fields when a parent field changes
  useEffect(() => {
    setValue('alamatKkKabupaten', '');
    setValue('alamatKkKecamatan', '');
    setValue('alamatKkDesa', '');
  }, [alamatKkProvinsi, setValue]);

  useEffect(() => {
    setValue('alamatKkKecamatan', '');
    setValue('alamatKkDesa', '');
  }, [alamatKkKabupaten, setValue]);

  useEffect(() => {
    setValue('alamatKkDesa', '');
  }, [alamatKkKecamatan, setValue]);

  useEffect(() => {
    setValue('domisiliKabupaten', '');
    setValue('domisiliKecamatan', '');
    setValue('domisiliDesa', '');
  }, [domisiliProvinsi, setValue]);

  useEffect(() => {
    setValue('domisiliKecamatan', '');
    setValue('domisiliDesa', '');
  }, [domisiliKabupaten, setValue]);
  
  useEffect(() => {
    setValue('domisiliDesa', '');
  }, [domisiliKecamatan, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('fotoProfil', { fileName: file.name, file: file, fileURL: URL.createObjectURL(file) });
    }
  };

  return (
    <div className="space-y-6">
       <FormField
        control={control}
        name="fotoProfil"
        render={() => (
          <FormItem>
            <FormLabel>Foto Siswa (Opsional, JPG)</FormLabel>
            <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border relative">
                    {preview ? (
                        <Image src={preview} alt="Preview Foto Profil" layout="fill" objectFit="cover" className="rounded-full" />
                    ) : (
                        <User className="w-12 h-12 text-muted-foreground" />
                    )}
                </div>
                <FormControl>
                     <Button asChild variant="outline">
                        <label htmlFor="foto-profil-upload" className="cursor-pointer">
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Unggah Foto
                             <input id="foto-profil-upload" type="file" accept="image/jpeg,image/jpg" className="hidden" onChange={handleFileChange} />
                        </label>
                    </Button>
                </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <Grid>
        <FormField control={control} name="namaLengkap" render={({ field }) => (
            <FormItem><FormLabelRequired>Nama</FormLabelRequired><FormControl><Input placeholder="Nama lengkap siswa" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="nis" render={({ field }) => (
            <FormItem><FormLabelRequired>Nomor Induk Sekolah</FormLabelRequired><FormControl><Input placeholder="NIS" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="nisn" render={({ field }) => (
            <FormItem><FormLabelRequired>Nomor Induk Nasional Siswa</FormLabelRequired><FormControl><Input placeholder="10 digit NISN" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="jenisKelamin" render={({ field }) => (
            <FormItem><FormLabelRequired>Jenis Kelamin</FormLabelRequired><FormControl>
            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center space-x-4 pt-2">
                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Laki-laki" /></FormControl><FormLabel className="font-normal">Laki-laki</FormLabel></FormItem>
                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Perempuan" /></FormControl><FormLabel className="font-normal">Perempuan</FormLabel></FormItem>
            </RadioGroup>
            </FormControl><FormMessage /></FormItem>
        )} />
        <div className="md:col-span-2 space-y-2">
            <h3 className="text-sm font-medium"><FormLabelRequired>Kelahiran Siswa</FormLabelRequired></h3>
            <Grid>
                <FormField control={control} name="tempatLahir" render={({ field }) => (
                    <FormItem><FormLabel>Tempat Lahir</FormLabel><FormControl><Input placeholder="Contoh: Jakarta" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={control} name="tanggalLahir" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Tanggal Lahir</FormLabel><Popover>
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
            </Grid>
        </div>
        <FormField control={control} name="agama" render={({ field }) => (
            <FormItem><FormLabelRequired>Agama</FormLabelRequired><Select onValueChange={field.onChange} value={field.value}>
            <FormControl><SelectTrigger><SelectValue placeholder="Pilih Agama" /></SelectTrigger></FormControl>
            <SelectContent>
                <SelectItem value="Islam">Islam</SelectItem><SelectItem value="Kristen">Kristen</SelectItem>
                <SelectItem value="Hindu">Hindu</SelectItem><SelectItem value="Budha">Budha</SelectItem>
            </SelectContent>
            </Select><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="kewarganegaraan" render={({ field }) => (
            <FormItem><FormLabelRequired>Kewarganegaraan</FormLabelRequired><Select onValueChange={field.onChange} value={field.value}>
            <FormControl><SelectTrigger><SelectValue placeholder="Pilih Kewarganegaraan" /></SelectTrigger></FormControl>
            <SelectContent>
                <SelectItem value="WNI">WNI</SelectItem><SelectItem value="WNA">WNA</SelectItem>
            </SelectContent>
            </Select><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="jumlahSaudara" render={({ field }) => (
            <FormItem><FormLabelRequired>Jumlah Saudara</FormLabelRequired><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="bahasa" render={({ field }) => (
            <FormItem><FormLabelRequired>Bahasa Sehari-hari</FormLabelRequired><FormControl><Input placeholder="Contoh: Indonesia" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="golonganDarah" render={({ field }) => (
        <FormItem><FormLabelRequired>Golongan Darah</FormLabelRequired><Select onValueChange={field.onChange} value={field.value}>
          <FormControl><SelectTrigger><SelectValue placeholder="Pilih Gol. Darah" /></SelectTrigger></FormControl>
          <SelectContent><SelectItem value="A">A</SelectItem><SelectItem value="B">B</SelectItem><SelectItem value="AB">AB</SelectItem><SelectItem value="O">O</SelectItem></SelectContent>
        </Select><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="telepon" render={({ field }) => (
            <FormItem><FormLabelRequired>Nomor HP/WA</FormLabelRequired><FormControl><Input placeholder="08xxxxxxxxxx" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <div className="md:col-span-2 space-y-2">
            <h3 className="text-sm font-medium"><FormLabelRequired>Alamat Sesuai Kartu Keluarga</FormLabelRequired></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <FormField control={control} name="alamatKkProvinsi" render={({ field }) => (
                    <FormItem><FormLabel>Provinsi</FormLabel><FormControl>
                        <Combobox
                          options={wilayahToOptions(provinces)}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Pilih Provinsi..."
                          searchPlaceholder="Cari provinsi..."
                        />
                    </FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={control} name="alamatKkKabupaten" render={({ field }) => (
                    <FormItem><FormLabel>Kabupaten</FormLabel><FormControl>
                        <Combobox
                          options={wilayahToOptions(kkKabupatens)}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Pilih Kabupaten..."
                          searchPlaceholder="Cari kabupaten..."
                          disabled={!alamatKkProvinsi}
                        />
                    </FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={control} name="alamatKkKecamatan" render={({ field }) => (
                    <FormItem><FormLabel>Kecamatan</FormLabel><FormControl>
                        <Combobox
                          options={wilayahToOptions(kkKecamatans)}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Pilih Kecamatan..."
                          searchPlaceholder="Cari kecamatan..."
                          disabled={!alamatKkKabupaten}
                        />
                    </FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={control} name="alamatKkDesa" render={({ field }) => (
                    <FormItem><FormLabel>Desa</FormLabel><FormControl>
                        <Combobox
                          options={wilayahToOptions(kkDesas)}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Pilih Desa..."
                          searchPlaceholder="Cari desa..."
                          disabled={!alamatKkKecamatan}
                        />
                    </FormControl><FormMessage /></FormItem>
                )} />
            </div>
        </div>

        <div className="md:col-span-2 space-y-2">
            <h3 className="text-sm font-medium"><FormLabelRequired>Domisili</FormLabelRequired></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <FormField control={control} name="domisiliProvinsi" render={({ field }) => (
                    <FormItem><FormLabel>Provinsi</FormLabel><FormControl>
                        <Combobox
                          options={wilayahToOptions(provinces)}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Pilih Provinsi..."
                          searchPlaceholder="Cari provinsi..."
                        />
                    </FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={control} name="domisiliKabupaten" render={({ field }) => (
                    <FormItem><FormLabel>Kabupaten</FormLabel><FormControl>
                        <Combobox
                           options={wilayahToOptions(domisiliKabupatens)}
                           value={field.value}
                           onChange={field.onChange}
                           placeholder="Pilih Kabupaten..."
                           searchPlaceholder="Cari kabupaten..."
                           disabled={!domisiliProvinsi}
                        />
                    </FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={control} name="domisiliKecamatan" render={({ field }) => (
                    <FormItem><FormLabel>Kecamatan</FormLabel><FormControl>
                        <Combobox
                          options={wilayahToOptions(domisiliKecamatans)}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Pilih Kecamatan..."
                          searchPlaceholder="Cari kecamatan..."
                          disabled={!domisiliKabupaten}
                        />
                    </FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={control} name="domisiliDesa" render={({ field }) => (
                    <FormItem><FormLabel>Desa</FormLabel><FormControl>
                        <Combobox
                          options={wilayahToOptions(domisiliDesas)}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Pilih Desa..."
                          searchPlaceholder="Cari desa..."
                          disabled={!domisiliKecamatan}
                        />
                    </FormControl><FormMessage /></FormItem>
                )} />
            </div>
        </div>
      </Grid>
    </div>
  );
}

function DataOrangTuaForm() {
  const { control } = useFormContext<StudentFormData>();
  return (
    <div className="space-y-6">
        <div>
            <h3 className="text-md font-semibold mb-3">a. Nama Orang Tua Kandung</h3>
            <Grid>
                <FormField control={control} name="namaAyah" render={({ field }) => (
                    <FormItem><FormLabel>Nama Ayah</FormLabel><FormControl><Input placeholder="Nama lengkap ayah" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={control} name="namaIbu" render={({ field }) => (
                    <FormItem><FormLabel>Nama Ibu</FormLabel><FormControl><Input placeholder="Nama lengkap ibu" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </Grid>
        </div>
        <Separator/>
        <div>
            <h3 className="text-md font-semibold mb-3">b. Pendidikan & Pekerjaan</h3>
            <Grid>
                <FormField control={control} name="pendidikanAyah" render={({ field }) => (
                    <FormItem><FormLabel>Pendidikan Tertinggi Ayah</FormLabel><FormControl><Input placeholder="Contoh: S1" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={control} name="pekerjaanAyah" render={({ field }) => (
                    <FormItem><FormLabel>Pekerjaan Ayah</FormLabel><FormControl><Input placeholder="Contoh: Wiraswasta" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={control} name="pendidikanIbu" render={({ field }) => (
                    <FormItem><FormLabel>Pendidikan Tertinggi Ibu</FormLabel><FormControl><Input placeholder="Contoh: SMA" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={control} name="pekerjaanIbu" render={({ field }) => (
                    <FormItem><FormLabel>Pekerjaan Ibu</FormLabel><FormControl><Input placeholder="Contoh: Ibu Rumah Tangga" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </Grid>
        </div>
        <Separator/>
         <div>
            <h3 className="text-md font-semibold mb-3">c. Wali Murid (jika ada)</h3>
            <Grid>
                <FormField control={control} name="namaWali" render={({ field }) => (
                    <FormItem><FormLabel>Nama Wali</FormLabel><FormControl><Input placeholder="Nama lengkap wali" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={control} name="hubunganWali" render={({ field }) => (
                    <FormItem><FormLabel>Hubungan Keluarga</FormLabel><FormControl><Input placeholder="Contoh: Paman" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={control} name="pendidikanWali" render={({ field }) => (
                    <FormItem><FormLabel>Pendidikan Terakhir</FormLabel><FormControl><Input placeholder="Pendidikan terakhir wali" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={control} name="pekerjaanWali" render={({ field }) => (
                    <FormItem><FormLabel>Pekerjaan</FormLabel><FormControl><Input placeholder="Pekerjaan wali" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </Grid>
        </div>
        <Separator/>
        <div>
             <h3 className="text-md font-semibold mb-3">d. Kontak & Alamat Orang Tua / Wali</h3>
             <Grid>
                <FormField control={control} name="alamatOrangTua" render={({ field }) => (
                    <FormItem><FormLabel>Alamat Orang Tua/Wali</FormLabel><FormControl><Textarea placeholder="Alamat lengkap orang tua/wali" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={control} name="teleponOrangTua" render={({ field }) => (
                    <FormItem><FormLabel>Telepon Orang Tua/Wali</FormLabel><FormControl><Input placeholder="Nomor telepon" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
             </Grid>
        </div>
    </div>
  );
}


function DataPerkembanganForm() {
    const { control } = useFormContext<StudentFormData>();
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-md font-semibold mb-3">a. Masuk Menjadi Siswa Baru Tingkat I</h3>
                <Grid>
                    <FormField control={control} name="asalSekolah" render={({ field }) => (
                        <FormItem><FormLabel>1. Asal Sekolah</FormLabel><FormControl><Input placeholder="Contoh: TK Tunas Bangsa" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={control} name="nomorSttb" render={({ field }) => (
                        <FormItem><FormLabel>2. Nomor STTB</FormLabel><FormControl><Input placeholder="Nomor STTB" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={control} name="tanggalSttb" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>3. Tanggal STTB</FormLabel><Popover>
                        <PopoverTrigger asChild><FormControl>
                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP") : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl></PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                        </Popover><FormMessage /></FormItem>
                    )} />
                </Grid>
            </div>
            <Separator/>
            <div>
                <h3 className="text-md font-semibold mb-3">b. Pindahan Dari Sekolah Lain</h3>
                <Grid>
                     <FormField control={control} name="pindahanAsalSekolah" render={({ field }) => (
                        <FormItem><FormLabel>1. Asal Sekolah</FormLabel><FormControl><Input placeholder="Nama sekolah asal" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={control} name="pindahanDariTingkat" render={({ field }) => (
                        <FormItem><FormLabel>2. Dari Tingkat</FormLabel><FormControl><Input placeholder="Contoh: Kelas 4" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={control} name="pindahanDiterimaTanggal" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>3. Diterima Tanggal</FormLabel><Popover>
                        <PopoverTrigger asChild><FormControl>
                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP") : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl></PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                        </Popover><FormMessage /></FormItem>
                    )} />
                </Grid>
            </div>
        </div>
    );
}

function DataMeninggalkanSekolahForm() {
    const { control } = useFormContext<StudentFormData>();
    return (
        <div className="space-y-6">
             <div>
                <h3 className="text-md font-semibold mb-3">a. Tamat Belajar / Lulus</h3>
                <Grid>
                    <FormField control={control} name="lulusTahun" render={({ field }) => (
                        <FormItem><FormLabel>Tahun</FormLabel><FormControl><Input placeholder="Contoh: 2024" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={control} name="lulusNomorIjazah" render={({ field }) => (
                        <FormItem><FormLabel>Nomor Ijazah / STTB</FormLabel><FormControl><Input placeholder="Nomor Ijazah" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={control} name="lulusMelanjutkanKe" render={({ field }) => (
                        <FormItem><FormLabel>Melanjutkan ke sekolah</FormLabel><FormControl><Input placeholder="Nama sekolah lanjutan" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </Grid>
            </div>
            <Separator/>
            <div>
                <h3 className="text-md font-semibold mb-3">b. Pindah Sekolah</h3>
                <Grid>
                     <FormField control={control} name="pindahTingkatKelas" render={({ field }) => (
                        <FormItem><FormLabel>Tingkat kelas yang ditinggalkan</FormLabel><FormControl><Input placeholder="Contoh: Kelas 5" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={control} name="pindahKeSekolah" render={({ field }) => (
                        <FormItem><FormLabel>Ke sekolah</FormLabel><FormControl><Input placeholder="Nama sekolah tujuan" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={control} name="pindahKeTingkat" render={({ field }) => (
                        <FormItem><FormLabel>Ke Tingkat</FormLabel><FormControl><Input placeholder="Tingkat di sekolah baru" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </Grid>
            </div>
            <Separator/>
            <div>
                <h3 className="text-md font-semibold mb-3">c. Keluar Sekolah</h3>
                <Grid className="md:grid-cols-1">
                    <FormField control={control} name="keluarAlasan" render={({ field }) => (
                        <FormItem><FormLabel>Alasan keluar sekolah</FormLabel><FormControl><Textarea placeholder="Jelaskan alasan keluar" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={control} name="keluarTanggal" render={({ field }) => (
                        <FormItem className="flex flex-col max-w-sm"><FormLabel>Hari dan tanggal keluar sekolah</FormLabel><Popover>
                        <PopoverTrigger asChild><FormControl>
                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP") : <span>Pilih tanggal</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl></PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                        </Popover><FormMessage /></FormItem>
                    )} />
                </Grid>
            </div>
        </div>
    );
}

type DocumentUploadFieldProps = {
    name: keyof NonNullable<StudentFormData['documents']>;
    label: string;
}

const documentUtamaList: DocumentUploadFieldProps[] = [
    { name: "kartuKeluarga", label: "Kartu Keluarga" },
    { name: "ktpAyah", label: "KTP Ayah" },
    { name: "ktpIbu", label: "KTP Ibu" },
    { name: "kartuIndonesiaPintar", label: "Kartu Indonesia Pintar" },
    { name: "ijazah", label: "Ijazah SD/Sederajat" },
    { name: "aktaKelahiran", label: "Akta Kelahiran" },
    { name: "akteKematianAyah", label: "Akte Kematian Ayah (opsional)" },
    { name: "akteKematianIbu", label: "Akte Kematian Ibu (opsional)" },
];

const laporanBelajarList: DocumentUploadFieldProps[] = [
    { name: "raporSmt1", label: "Rapor Semester 1" },
    { name: "raporSmt2", label: "Rapor Semester 2" },
    { name: "raporSmt3", label: "Rapor Semester 3" },
    { name: "raporSmt4", label: "Rapor Semester 4" },
    { name: "raporSmt5", label: "Rapor Semester 5" },
    { name: "raporSmt6", label: "Rapor Semester 6" },
    { name: "ijazahSmp", label: "Ijazah SMP" },
    { name: "transkripSmp", label: "Transkrip Nilai SMP" },
];


function DocumentUploadField({ name, label }: DocumentUploadFieldProps) {
    const { control, watch, setValue, formState: { errors } } = useFormContext<StudentFormData>();
    const fieldName = `documents.${name}`;
    const watchedFile = watch(fieldName as any);
    const error = errors.documents?.[name];
  
    return (
      <FormField
        control={control}
        name={fieldName as any}
        render={() => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <div className="flex items-center gap-4">
              <FormControl>
                  <Button asChild variant="outline" className="w-full justify-start text-left font-normal">
                      <label htmlFor={`file-upload-${name}`} className="cursor-pointer">
                          <UploadCloud className="mr-2 h-4 w-4" />
                          <span className="truncate">
                              {watchedFile?.fileName || 'Pilih file (PDF/Gambar)...'}
                          </span>
                          <input 
                              id={`file-upload-${name}`}
                              type="file" 
                              accept="application/pdf,image/*" 
                              className="hidden"
                              onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                      setValue(fieldName as any, { fileName: file.name, file: file, fileURL: URL.createObjectURL(file) });
                                  }
                              }}
                          />
                      </label>
                  </Button>
              </FormControl>
              {watchedFile?.fileName ? (
                  <div className="flex items-center gap-2 text-green-600">
                      <FileCheck2 className="h-5 w-5" />
                      <span className="sr-only">Terunggah</span>
                  </div>
              ) : (
                !error && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                      <FileX2 className="h-5 w-5" />
                      <span className="sr-only">Belum diunggah</span>
                  </div>
                )
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

function DataDokumenUtamaForm() {
    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Silakan unggah semua berkas administrasi yang diperlukan dalam format PDF atau Gambar.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {documentUtamaList.map((doc) => (
                    <DocumentUploadField key={doc.name} name={doc.name} label={doc.label} />
                ))}
            </div>
        </div>
    );
}

function DataLaporanBelajarForm() {
    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Silakan unggah file rapor dan ijazah dalam format PDF.
            </p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {laporanBelajarList.map((doc) => (
                    <DocumentUploadField key={doc.name} name={doc.name} label={doc.label} />
                ))}
            </div>
        </div>
    );
}


function DataValidasiForm() {
    const { getValues } = useFormContext<StudentFormData>();
    const values = getValues();
    
    const allFields = [
        // Data Siswa
        { label: "Nama Lengkap", value: values.namaLengkap },
        { label: "NIS", value: values.nis },
        { label: "NISN", value: values.nisn },
        // ... tambahkan field lain yang ingin divalidasi
        { label: "Foto Profil", value: values.fotoProfil?.fileName },
        // Dokumen
        ...Object.entries(values.documents || {}).map(([key, value]) => ({
            label: `Dokumen: ${key}`,
            value: value?.fileName
        }))
    ].filter(field => field.value);

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 py-8">
        <ShieldCheck className="w-16 h-16 text-primary" />
        <h2 className="text-2xl font-bold">Konfirmasi Akhir</h2>
        <p className="text-muted-foreground max-w-md">
            Anda telah mencapai langkah terakhir. Silakan periksa kembali ringkasan data di bawah. Jika semua sudah benar, klik "Simpan Data" untuk menyelesaikan.
        </p>
        <Card className="w-full max-w-lg text-left">
            <CardHeader><CardTitle>Ringkasan Data</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm max-h-60 overflow-y-auto">
                {allFields.map((field, index) => (
                    <div key={index} className="flex justify-between">
                        <span className="font-medium text-muted-foreground">{field.label}:</span>
                        <span className="truncate ml-4">{field.value}</span>
                    </div>
                ))}
                 {allFields.length === 0 && <p className="text-center text-muted-foreground">Belum ada data yang diisi.</p>}
            </CardContent>
        </Card>
    </div>
  )
}
