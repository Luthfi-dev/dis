import { z } from 'zod';

const fileSchema = z.object({
  fileName: z.string(),
  file: z.any().refine(file => file instanceof File, "File is required."),
  fileURL: z.string().optional(),
}).optional();

// Base schema with minimum requirements
export const dataSiswaSchema = z.object({
  fotoProfil: fileSchema,
  namaLengkap: z.string().min(3, "Nama lengkap minimal 3 karakter."),
  nis: z.string().optional(),
  nisn: z.string().length(10, "NISN harus 10 digit."),
  namaPanggilan: z.string().optional(),
  jenisKelamin: z.enum(['Laki-laki', 'Perempuan'], { required_error: "Jenis kelamin wajib dipilih." }),
  tempatLahir: z.string().min(1, "Tempat lahir wajib diisi."),
  tanggalLahir: z.date({ required_error: "Tanggal lahir wajib diisi." }),
  agama: z.string().min(1, "Agama wajib diisi."),
  kewarganegaraan: z.string().min(1, "Kewarganegaraan wajib diisi."),
  anakKe: z.coerce.number().positive("Anak ke- harus positif.").optional(),
  jumlahSaudara: z.coerce.number().nonnegative("Jumlah saudara tidak boleh negatif.").optional(),
  bahasa: z.string().optional(),
  alamat: z.string().min(1, "Alamat wajib diisi."),
  telepon: z.string().optional(),
  jarakKeSekolah: z.string().optional(),
});

// Schemas for other steps
export const dataOrangTuaSchema = z.object({
  namaAyah: z.string().optional(),
  namaIbu: z.string().optional(),
  pekerjaanAyah: z.string().optional(),
  pekerjaanIbu: z.string().optional(),
  pendidikanAyah: z.string().optional(),
  pendidikanIbu: z.string().optional(),
  alamatOrangTua: z.string().optional(),
  teleponOrangTua: z.string().optional(),
  namaWali: z.string().optional(),
  pekerjaanWali: z.string().optional(),
});

export const dataRincianSchema = z.object({
  tinggiBadan: z.coerce.number().optional(),
  beratBadan: z.coerce.number().optional(),
  golonganDarah: z.enum(['A', 'B', 'AB', 'O', '']).optional(),
  penyakit: z.string().optional(),
  kelainanJasmani: z.string().optional(),
});

export const dataPerkembanganSchema = z.object({
  asalSekolah: z.string().optional(),
  tanggalMasuk: z.date().optional(),
  hobi: z.string().optional(),
});

export const dataLanjutanSchema = z.object({
  melanjutkanKe: z.string().optional(),
  tanggalLulus: z.date().optional(),
  alasanPindah: z.string().optional(),
});

export const dataDokumenSchema = z.object({
  documents: z.object({
    kartuKeluarga: fileSchema,
    ktpAyah: fileSchema,
    ktpIbu: fileSchema,
    kartuIndonesiaPintar: fileSchema,
    ijazah: fileSchema,
    aktaKelahiran: fileSchema,
    akteKematianAyah: fileSchema.nullable(), // Optional fields can be null
    akteKematianIbu: fileSchema.nullable(),
  }).optional(),
});

// Merged schema for the entire form, mostly optional
export const studentFormSchema = dataSiswaSchema
  .merge(dataOrangTuaSchema)
  .merge(dataRincianSchema)
  .merge(dataPerkembanganSchema)
  .merge(dataLanjutanSchema)
  .merge(dataDokumenSchema);

// A stricter schema to check for completion status
export const completeStudentFormSchema = studentFormSchema.strict();


export type StudentFormData = z.infer<typeof studentFormSchema>;
export type DocumentData = z.infer<typeof dataDokumenSchema>;
