import { z } from 'zod';

// Only DataSiswa is fully required
export const dataSiswaSchema = z.object({
  namaLengkap: z.string({ required_error: "Nama lengkap wajib diisi." }).min(3, "Nama lengkap minimal 3 karakter."),
  nis: z.string().optional(),
  nisn: z.string({ required_error: "NISN wajib diisi." }).length(10, "NISN harus 10 digit."),
  namaPanggilan: z.string().optional(),
  jenisKelamin: z.enum(['Laki-laki', 'Perempuan'], { required_error: "Jenis kelamin wajib dipilih." }),
  tempatLahir: z.string({ required_error: "Tempat lahir wajib diisi." }).min(1, "Tempat lahir wajib diisi."),
  tanggalLahir: z.date({ required_error: "Tanggal lahir wajib diisi." }),
  agama: z.string({ required_error: "Agama wajib diisi." }).min(1, "Agama wajib diisi."),
  kewarganegaraan: z.string({ required_error: "Kewarganegaraan wajib diisi." }).min(1, "Kewarganegaraan wajib diisi."),
  anakKe: z.coerce.number().positive("Anak ke- harus positif.").optional(),
  jumlahSaudara: z.coerce.number().nonnegative("Jumlah saudara tidak boleh negatif.").optional(),
  bahasa: z.string().optional(),
  alamat: z.string({ required_error: "Alamat wajib diisi." }).min(1, "Alamat wajib diisi."),
  telepon: z.string().optional(),
  jarakKeSekolah: z.string().optional(),
});

// Other schemas are optional
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

export const documentFileSchema = z.object({
  fileName: z.string().optional(),
  file: z.any().optional(),
});

export const dataDokumenSchema = z.object({
  documents: z.object({
    kartuKeluarga: documentFileSchema.optional(),
    ktpAyah: documentFileSchema.optional(),
    ktpIbu: documentFileSchema.optional(),
    kartuIndonesiaPintar: documentFileSchema.optional(),
    ijazah: documentFileSchema.optional(),
    aktaKelahiran: documentFileSchema.optional(),
    akteKematianAyah: documentFileSchema.optional(),
    akteKematianIbu: documentFileSchema.optional(),
  }).optional(),
});

export const studentFormSchema = dataSiswaSchema
  .merge(dataOrangTuaSchema)
  .merge(dataRincianSchema)
  .merge(dataPerkembanganSchema)
  .merge(dataLanjutanSchema)
  .merge(dataDokumenSchema);

export type StudentFormData = z.infer<typeof studentFormSchema>;
export type DocumentData = z.infer<typeof dataDokumenSchema>;
