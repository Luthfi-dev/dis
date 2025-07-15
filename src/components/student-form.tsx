'use client';

import { useState, useTransition, useCallback, useEffect } from 'react';
import { useForm, FormProvider, useFormContext, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentFormSchema, StudentFormData, dataSiswaSchema, dataOrangTuaSchema, dataRincianSchema, dataPerkembanganSchema, dataLanjutanSchema, dataDokumenSchema, DocumentData } from '@/lib/schema';
import { FormStepper } from './form-stepper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, ArrowRight, CalendarIcon, PlusCircle, Trash2, UploadCloud, GripVertical } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getCategorySuggestion, submitStudentData } from '@/lib/actions';
import { Textarea } from './ui/textarea';
import { useRouter } from 'next/navigation';
import type { Siswa } from '@/lib/data';

const steps = [
  { id: 1, title: 'Data Siswa', schema: dataSiswaSchema },
  { id: 2, title: 'Data Orang Tua', schema: dataOrangTuaSchema },
  { id: 3, title: 'Data Rincian', schema: dataRincianSchema },
  { id: 4, title: 'Perkembangan', schema: dataPerkembanganSchema },
  { id: 5, title: 'Data Lanjutan', schema: dataLanjutanSchema },
  { id: 6, title: 'Unggah Dokumen', schema: dataDokumenSchema },
];

export function StudentForm({ studentData }: { studentData?: Partial<Siswa> & { tanggalLahir: string | Date } }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const methods = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    mode: 'onChange',
    defaultValues: {
      ...studentData,
      tanggalLahir: studentData?.tanggalLahir ? new Date(studentData.tanggalLahir) : undefined,
      kewarganegaraan: 'Indonesia',
      documents: [],
    },
  });

  const { trigger, handleSubmit } = methods;

  const handleNext = async () => {
    const currentSchema = steps[currentStep - 1].schema;
    const fields = Object.keys(currentSchema.shape);
    const isValid = await trigger(fields as any, { shouldFocus: true });
    
    if (isValid) {
      if (currentStep < steps.length) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const processForm = (data: StudentFormData) => {
    startTransition(async () => {
      const result = await submitStudentData(data);
      if (result.success) {
        toast({
          title: 'Sukses!',
          description: result.message,
          variant: 'default',
        });
        router.push('/siswa');
      } else {
        toast({
          title: 'Error',
          description: result.message,
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
            <CardDescription>Sesi {currentStep} dari {steps.length}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && <DataSiswaForm />}
            {currentStep === 2 && <DataOrangTuaForm />}
            {currentStep === 3 && <DataRincianForm />}
            {currentStep === 4 && <DataPerkembanganForm />}
            {currentStep === 5 && <DataLanjutanForm />}
            {currentStep === 6 && <DataDokumenForm />}
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

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">{children}</div>;
}

function DataSiswaForm() {
  const { control } = useFormContext<StudentFormData>();
  return (
    <Grid>
      <FormField control={control} name="namaLengkap" render={({ field }) => (
        <FormItem>
          <FormLabel>Nama Lengkap</FormLabel>
          <FormControl><Input placeholder="Contoh: Budi Santoso" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="nis" render={({ field }) => (
        <FormItem><FormLabel>NIS</FormLabel><FormControl><Input placeholder="Nomor Induk Siswa" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name="nisn" render={({ field }) => (
        <FormItem><FormLabel>NISN</FormLabel><FormControl><Input placeholder="10 digit NISN" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name="namaPanggilan" render={({ field }) => (
        <FormItem><FormLabel>Nama Panggilan</FormLabel><FormControl><Input placeholder="Contoh: Budi" {...field} /></FormControl><FormMessage /></FormItem>
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
        <FormItem><FormLabel>Anak ke-</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name="jumlahSaudara" render={({ field }) => (
        <FormItem><FormLabel>Jumlah Saudara</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name="bahasa" render={({ field }) => (
        <FormItem><FormLabel>Bahasa Sehari-hari</FormLabel><FormControl><Input placeholder="Contoh: Indonesia" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name="alamat" render={({ field }) => (
        <FormItem className="md:col-span-2"><FormLabel>Alamat</FormLabel><FormControl><Textarea placeholder="Alamat lengkap siswa" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
    </Grid>
  );
}

function DataOrangTuaForm() {
  const { control } = useFormContext<StudentFormData>();
  return (
    <Grid>
      <FormField control={control} name="namaAyah" render={({ field }) => (
        <FormItem><FormLabel>Nama Ayah</FormLabel><FormControl><Input placeholder="Nama lengkap ayah" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name="namaIbu" render={({ field }) => (
        <FormItem><FormLabel>Nama Ibu</FormLabel><FormControl><Input placeholder="Nama lengkap ibu" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name="pekerjaanAyah" render={({ field }) => (
        <FormItem><FormLabel>Pekerjaan Ayah</FormLabel><FormControl><Input placeholder="Contoh: Wiraswasta" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name="pekerjaanIbu" render={({ field }) => (
        <FormItem><FormLabel>Pekerjaan Ibu</FormLabel><FormControl><Input placeholder="Contoh: Ibu Rumah Tangga" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
       <FormField control={control} name="namaWali" render={({ field }) => (
        <FormItem><FormLabel>Nama Wali (jika ada)</FormLabel><FormControl><Input placeholder="Nama lengkap wali" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name="pekerjaanWali" render={({ field }) => (
        <FormItem><FormLabel>Pekerjaan Wali</FormLabel><FormControl><Input placeholder="Pekerjaan wali" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={control} name="alamatOrangTua" render={({ field }) => (
        <FormItem className="md:col-span-2"><FormLabel>Alamat Orang Tua/Wali</FormLabel><FormControl><Textarea placeholder="Alamat lengkap orang tua/wali" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
    </Grid>
  );
}

function DataRincianForm() {
  const { control } = useFormContext<StudentFormData>();
  return (
    <Grid>
        <FormField control={control} name="tinggiBadan" render={({ field }) => (
            <FormItem><FormLabel>Tinggi Badan (cm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="beratBadan" render={({ field }) => (
            <FormItem><FormLabel>Berat Badan (kg)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={control} name="golonganDarah" render={({ field }) => (
        <FormItem><FormLabel>Golongan Darah</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl><SelectTrigger><SelectValue placeholder="Pilih Gol. Darah" /></SelectTrigger></FormControl>
          <SelectContent><SelectItem value="A">A</SelectItem><SelectItem value="B">B</SelectItem><SelectItem value="AB">AB</SelectItem><SelectItem value="O">O</SelectItem></SelectContent>
        </Select><FormMessage /></FormItem>
      )} />
      <FormField control={control} name="penyakit" render={({ field }) => (
        <FormItem className="md:col-span-2"><FormLabel>Riwayat Penyakit</FormLabel><FormControl><Textarea placeholder="Penyakit yang pernah diderita" {...field} /></FormControl><FormMessage /></FormItem>
      )} />
    </Grid>
  );
}

function DataPerkembanganForm() {
    const { control } = useFormContext<StudentFormData>();
    return (
        <Grid>
             <FormField control={control} name="asalSekolah" render={({ field }) => (
                <FormItem><FormLabel>Asal Sekolah</FormLabel><FormControl><Input placeholder="Contoh: TK Tunas Bangsa" {...field} /></FormControl><FormMessage /></FormItem>
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
                <FormItem className="md:col-span-2"><FormLabel>Hobi</FormLabel><FormControl><Textarea placeholder="Hobi siswa" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </Grid>
    );
}

function DataLanjutanForm() {
    const { control } = useFormContext<StudentFormData>();
    return (
        <Grid>
             <FormField control={control} name="melanjutkanKe" render={({ field }) => (
                <FormItem><FormLabel>Melanjutkan ke</FormLabel><FormControl><Input placeholder="Contoh: SMP Negeri 1" {...field} /></FormControl><FormMessage /></FormItem>
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
                <FormItem className="md:col-span-2"><FormLabel>Alasan Pindah (jika pindahan)</FormLabel><FormControl><Textarea placeholder="Alasan pindah sekolah" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </Grid>
    );
}

const docCategories = ["Ijazah", "Transkrip", "Rapor", "Akta Kelahiran", "Kartu Keluarga", "Surat Pindah", "Sertifikat Prestasi", "Lainnya"];

function DataDokumenForm() {
  const { control, setValue, watch } = useFormContext<StudentFormData>();
  const { fields, append, remove } = useFieldArray({ control, name: "documents" });
  const [suggestionLoading, setSuggestionLoading] = useState<Record<string, boolean>>({});

  const handleDescriptionChange = useCallback(
    (description: string, index: number) => {
      const timer = setTimeout(async () => {
        if (description.length > 10) {
          setSuggestionLoading(prev => ({ ...prev, [index]: true }));
          const result = await getCategorySuggestion(description);
          if (result.success && result.category && docCategories.includes(result.category)) {
            setValue(`documents.${index}.category`, result.category, { shouldValidate: true });
          }
          setSuggestionLoading(prev => ({ ...prev, [index]: false }));
        }
      }, 1000); // 1-second debounce
      return () => clearTimeout(timer);
    },
    [setValue]
  );
  
  const watchedDocs = watch('documents');

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <Card key={field.id} className="p-4 relative bg-muted/30">
          <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <FormField control={control} name={`documents.${index}.file`} render={({ field: { onChange, ...fieldProps } }) => (
              <FormItem className="md:col-span-1">
                <FormLabel>File Dokumen</FormLabel>
                <FormControl>
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor={`dropzone-file-${index}`} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground">
                                    {watchedDocs[index]?.fileName ? <span className="font-semibold">{watchedDocs[index]?.fileName}</span> : <><span className="font-semibold">Klik untuk unggah</span><span className="hidden sm:inline"><br/>atau seret file</span></> }
                                </p>
                            </div>
                            <input id={`dropzone-file-${index}`} type="file" className="hidden" 
                                {...fieldProps}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if(file) {
                                        setValue(`documents.${index}.fileName`, file.name);
                                        onChange(file);
                                    }
                                }}
                            />
                        </label>
                    </div> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="md:col-span-2 space-y-4">
              <FormField control={control} name={`documents.${index}.description`} render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi Dokumen</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Contoh: Ijazah Sekolah Dasar Negeri 1 Jakarta" {...field} onChange={e => {
                        field.onChange(e);
                        handleDescriptionChange(e.target.value, index);
                    }}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name={`documents.${index}.category`} render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                   <div className="flex items-center gap-2">
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger></FormControl>
                        <SelectContent>
                            {docCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     {suggestionLoading[index] && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                    </div>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>
        </Card>
      ))}
      <Button type="button" variant="outline" onClick={() => append({ id: crypto.randomUUID(), fileName: '', description: '', category: '', file: null })}>
        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Dokumen
      </Button>
    </div>
  );
}
