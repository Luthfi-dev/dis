'use client';

import { useState, useTransition, useCallback, useEffect, useRef } from 'react';
import { useForm, FormProvider, useFormContext, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentFormSchema, StudentFormData, completeStudentFormSchema } from '@/lib/schema';
import { FormStepper } from './form-stepper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, ArrowRight, CalendarIcon, PlusCircle, Trash2, UploadCloud, FileCheck2, FileX2, User } from 'lucide-react';
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

const steps = [
  { id: 1, title: 'Data Siswa' },
  { id: 2, title: 'Unggah Dokumen' },
  { id: 3, title: 'Data Orang Tua' },
  { id: 4, title: 'Data Rincian' },
  { id: 5, title: 'Perkembangan' },
  { id: 6, title: 'Data Lanjutan' },
];

export function StudentForm({ studentData }: { studentData?: Partial<Siswa> & { tanggalLahir: string | Date } }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const methods = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    mode: 'onBlur', 
    defaultValues: studentData
      ? {
        ...studentData,
        tanggalLahir: studentData.tanggalLahir ? new Date(studentData.tanggalLahir) : undefined,
        tanggalMasuk: studentData.tanggalMasuk ? new Date(studentData.tanggalMasuk) : undefined,
        tanggalLulus: studentData.tanggalLulus ? new Date(studentData.tanggalLulus) : undefined,
      }
      : {
      namaLengkap: '',
      nis: '',
      nisn: '',
      namaPanggilan: '',
      jenisKelamin: undefined,
      tempatLahir: '',
      tanggalLahir: undefined,
      agama: '',
      kewarganegaraan: 'Indonesia',
      anakKe: undefined,
      jumlahSaudara: undefined,
      bahasa: '',
      alamat: '',
      telepon: '',
      jarakKeSekolah: '',
      namaAyah: '',
      namaIbu: '',
      pekerjaanAyah: '',
      pekerjaanIbu: '',
      pendidikanAyah: '',
      pendidikanIbu: '',
      alamatOrangTua: '',
      teleponOrangTua: '',
      namaWali: '',
      pekerjaanWali: '',
      tinggiBadan: undefined,
      beratBadan: undefined,
      golonganDarah: '',
      penyakit: '',
      kelainanJasmani: '',
      asalSekolah: '',
      tanggalMasuk: undefined,
      hobi: '',
      melanjutkanKe: '',
      tanggalLulus: undefined,
      alasanPindah: '',
      fotoProfil: undefined,
      documents: {
        kartuKeluarga: undefined,
        ktpAyah: undefined,
        ktpIbu: undefined,
        kartuIndonesiaPintar: undefined,
        ijazah: undefined,
        aktaKelahiran: undefined,
        akteKematianAyah: undefined,
        akteKematianIbu: undefined,
      },
    },
  });

  const { trigger, handleSubmit, getValues, formState } = methods;

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const processForm = async (data: StudentFormData) => {
    // Manually create file URLs for preview
    const dataWithURLs = {...data};
    if (data.fotoProfil?.file) {
      dataWithURLs.fotoProfil.fileURL = URL.createObjectURL(data.fotoProfil.file);
    }
    if (data.documents) {
      for (const key in data.documents) {
        const docKey = key as keyof typeof data.documents;
        if (data.documents[docKey]?.file) {
            data.documents[docKey]!.fileURL = URL.createObjectURL(data.documents[docKey]!.file);
        }
      }
    }

    startTransition(async () => {
      // Check for full completion
      const result = await completeStudentFormSchema.safeParseAsync(data);
      const status = result.success ? 'Lengkap' : 'Belum Lengkap';
      
      const submissionResult = await submitStudentData({...dataWithURLs, status});
      
      if (submissionResult.success) {
        toast({
          title: 'Sukses!',
          description: submissionResult.message,
          variant: 'default',
        });
        
        const newStudent = {
          id: studentData?.id || submissionResult.id || crypto.randomUUID(),
          ...dataWithURLs,
          tanggalLahir: data.tanggalLahir?.toISOString() || new Date().toISOString(),
          status: status,
        }
        
        let existingStudents = JSON.parse(localStorage.getItem('siswaData') || '[]');
        if (studentData?.id) {
            existingStudents = existingStudents.map((s: Siswa) => s.id === studentData.id ? newStudent : s);
        } else {
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
      methods.reset(studentData as any);
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
            <CardDescription>Sesi {currentStep} dari {steps.length}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && <DataSiswaForm />}
            {currentStep === 2 && <DataDokumenForm />}
            {currentStep === 3 && <DataOrangTuaForm />}
            {currentStep === 4 && <DataRincianForm />}
            {currentStep === 5 && <DataPerkembanganForm />}
            {currentStep === 6 && <DataLanjutanForm />}
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
            <Button type="submit" disabled={isSubmitting || !formState.isValid}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Data
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">{children}</div>;
}

function DataSiswaForm() {
  const { control, watch, setValue } = useFormContext<StudentFormData>();
  const fotoProfil = watch('fotoProfil');
  const [preview, setPreview] = useState<string | null>(fotoProfil?.fileURL || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('fotoProfil', { fileName: file.name, file: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
       <FormField
        control={control}
        name="fotoProfil"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Foto Profil (Opsional)</FormLabel>
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
                             <input id="foto-profil-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
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
            <FormItem><FormLabel>Nama Lengkap</FormLabel><FormControl><Input placeholder="Contoh: Budi Santoso" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="nis" render={({ field }) => (
            <FormItem><FormLabel>NIS</FormLabel><FormControl><Input placeholder="Nomor Induk Siswa" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="nisn" render={({ field }) => (
            <FormItem><FormLabel>NISN</FormLabel><FormControl><Input placeholder="10 digit NISN" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="namaPanggilan" render={({ field }) => (
            <FormItem><FormLabel>Nama Panggilan</FormLabel><FormControl><Input placeholder="Contoh: Budi" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="jenisKelamin" render={({ field }) => (
            <FormItem><FormLabel>Jenis Kelamin</FormLabel><FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center space-x-4">
                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Laki-laki" /></FormControl><FormLabel className="font-normal">Laki-laki</FormLabel></FormItem>
                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Perempuan" /></FormControl><FormLabel className="font-normal">Perempuan</FormLabel></FormItem>
            </RadioGroup>
            </FormControl><FormMessage /></FormItem>
        )} />
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
        <FormField control={control} name="agama" render={({ field }) => (
            <FormItem><FormLabel>Agama</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl><SelectTrigger><SelectValue placeholder="Pilih Agama" /></SelectTrigger></FormControl>
            <SelectContent>
                <SelectItem value="Islam">Islam</SelectItem><SelectItem value="Kristen">Kristen</SelectItem>
                <SelectItem value="Katolik">Katolik</SelectItem><SelectItem value="Hindu">Hindu</SelectItem>
                <SelectItem value="Buddha">Buddha</SelectItem><SelectItem value="Konghucu">Konghucu</SelectItem>
            </SelectContent>
            </Select><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="kewarganegaraan" render={({ field }) => (
            <FormItem><FormLabel>Kewarganegaraan</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="anakKe" render={({ field }) => (
            <FormItem><FormLabel>Anak ke-</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="jumlahSaudara" render={({ field }) => (
            <FormItem><FormLabel>Jumlah Saudara</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="bahasa" render={({ field }) => (
            <FormItem><FormLabel>Bahasa Sehari-hari</FormLabel><FormControl><Input placeholder="Contoh: Indonesia" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="alamat" render={({ field }) => (
            <FormItem className="md:col-span-2"><FormLabel>Alamat</FormLabel><FormControl><Textarea placeholder="Alamat lengkap siswa" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
      </Grid>
    </div>
  );
}

function DataOrangTuaForm() {
  const { control } = useFormContext<StudentFormData>();
  return (
    <Grid>
      <FormField control={control} name="namaAyah" render={({ field }) => (
        <FormItem><FormLabel>Nama Ayah</FormLabel><FormControl><Input placeholder="Nama lengkap ayah" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name="namaIbu" render={({ field }) => (
        <FormItem><FormLabel>Nama Ibu</FormLabel><FormControl><Input placeholder="Nama lengkap ibu" {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name="pekerjaanAyah" render={({ field }) => (
        <FormItem><FormLabel>Pekerjaan Ayah</FormLabel><FormControl><Input placeholder="Contoh: Wiraswasta" {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name="pekerjaanIbu" render={({ field }) => (
        <FormItem><FormLabel>Pekerjaan Ibu</FormLabel><FormControl><Input placeholder="Contoh: Ibu Rumah Tangga" {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>
      )} />
       <FormField control={control} name="namaWali" render={({ field }) => (
        <FormItem><FormLabel>Nama Wali (jika ada)</FormLabel><FormControl><Input placeholder="Nama lengkap wali" {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name="pekerjaanWali" render={({ field }) => (
        <FormItem><FormLabel>Pekerjaan Wali</FormLabel><FormControl><Input placeholder="Pekerjaan wali" {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name="alamatOrangTua" render={({ field }) => (
        <FormItem className="md:col-span-2"><FormLabel>Alamat Orang Tua/Wali</FormLabel><FormControl><Textarea placeholder="Alamat lengkap orang tua/wali" {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>
      )} />
    </Grid>
  );
}

function DataRincianForm() {
  const { control } = useFormContext<StudentFormData>();
  return (
    <Grid>
        <FormField control={control} name="tinggiBadan" render={({ field }) => (
            <FormItem><FormLabel>Tinggi Badan (cm)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="beratBadan" render={({ field }) => (
            <FormItem><FormLabel>Berat Badan (kg)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="golonganDarah" render={({ field }) => (
        <FormItem><FormLabel>Golongan Darah</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl><SelectTrigger><SelectValue placeholder="Pilih Gol. Darah" /></SelectTrigger></FormControl>
          <SelectContent><SelectItem value="A">A</SelectItem><SelectItem value="B">B</SelectItem><SelectItem value="AB">AB</SelectItem><SelectItem value="O">O</SelectItem></SelectContent>
        </Select><FormMessage /></FormItem>
      )} />
      <FormField control={control} name="penyakit" render={({ field }) => (
        <FormItem className="md:col-span-2"><FormLabel>Riwayat Penyakit</FormLabel><FormControl><Textarea placeholder="Penyakit yang pernah diderita" {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>
      )} />
    </Grid>
  );
}

function DataPerkembanganForm() {
    const { control } = useFormContext<StudentFormData>();
    return (
        <Grid>
             <FormField control={control} name="asalSekolah" render={({ field }) => (
                <FormItem><FormLabel>Asal Sekolah</FormLabel><FormControl><Input placeholder="Contoh: TK Tunas Bangsa" {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={control} name="tanggalMasuk" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Tanggal Diterima</FormLabel><Popover>
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
             <FormField control={control} name="hobi" render={({ field }) => (
                <FormItem className="md:col-span-2"><FormLabel>Hobi</FormLabel><FormControl><Textarea placeholder="Hobi siswa" {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>
            )} />
        </Grid>
    );
}

function DataLanjutanForm() {
    const { control } = useFormContext<StudentFormData>();
    return (
        <Grid>
             <FormField control={control} name="melanjutkanKe" render={({ field }) => (
                <FormItem><FormLabel>Melanjutkan ke</FormLabel><FormControl><Input placeholder="Contoh: SMP Negeri 1" {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={control} name="tanggalLulus" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Tanggal Lulus</FormLabel><Popover>
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
             <FormField control={control} name="alasanPindah" render={({ field }) => (
                <FormItem className="md:col-span-2"><FormLabel>Alasan Pindah (jika pindahan)</FormLabel><FormControl><Textarea placeholder="Alasan pindah sekolah" {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>
            )} />
        </Grid>
    );
}

type DocumentUploadFieldProps = {
    name: keyof StudentFormData['documents'];
    label: string;
}

const documentList: DocumentUploadFieldProps[] = [
    { name: "kartuKeluarga", label: "Kartu Keluarga" },
    { name: "ktpAyah", label: "KTP Ayah" },
    { name: "ktpIbu", label: "KTP Ibu" },
    { name: "kartuIndonesiaPintar", label: "Kartu Indonesia Pintar" },
    { name: "ijazah", label: "Ijazah SD/Sederajat" },
    { name: "aktaKelahiran", label: "Akta Kelahiran" },
    { name: "akteKematianAyah", label: "Akte Kematian Ayah (opsional)" },
    { name: "akteKematianIbu", label: "Akte Kematian Ibu (opsional)" },
];


function DocumentUploadField({ name, label }: DocumentUploadFieldProps) {
    const { control, watch, setValue } = useFormContext<StudentFormData>();
    const fieldName = `documents.${name}`;
    const watchedFile = watch(fieldName as any);
  
    return (
      <FormField
        control={control}
        name={fieldName as any}
        render={({ field: { onChange, ...fieldProps }, fieldState }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <div className="flex items-center gap-4">
              <FormControl>
                  <Button asChild variant="outline" className="w-full justify-start text-left font-normal">
                      <label htmlFor={`file-upload-${name}`} className="cursor-pointer">
                          <UploadCloud className="mr-2 h-4 w-4" />
                          <span className="truncate">
                              {watchedFile?.fileName || 'Pilih file...'}
                          </span>
                          <input 
                              id={`file-upload-${name}`}
                              type="file" 
                              accept="image/*,.pdf" 
                              className="hidden"
                              onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                      setValue(fieldName as any, { fileName: file.name, file: file });
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
                  <div className="flex items-center gap-2 text-muted-foreground">
                      <FileX2 className="h-5 w-5" />
                      <span className="sr-only">Belum diunggah</span>
                  </div>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

function DataDokumenForm() {
    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Silakan unggah semua berkas administrasi yang diperlukan dalam format PDF atau Gambar.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {documentList.map((doc) => (
                    <DocumentUploadField key={doc.name} name={doc.name} label={doc.label} />
                ))}
            </div>
        </div>
    );
}
