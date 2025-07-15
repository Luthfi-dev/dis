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

// Merged schema for the entire form, mostly optional for draft saving
export const studentFormSchema = dataSiswaSchema
  .merge(dataOrangTuaSchema)
  .merge(dataRincianSchema)
  .merge(dataPerkembanganSchema)
  .merge(dataLanjutanSchema)
  .merge(dataDokumenSchema);

// A stricter schema to check for completion status
// All fields that are optional in the main form are made required here, except for truly optional ones.
export const completeStudentFormSchema = z.object({
    // Data Siswa - a few fields remain optional
    fotoProfil: fileSchema,
    namaLengkap: z.string().min(3, "Nama lengkap minimal 3 karakter."),
    nis: z.string().min(1, "NIS wajib diisi."),
    nisn: z.string().length(10, "NISN harus 10 digit."),
    namaPanggilan: z.string().min(1, "Nama panggilan wajib diisi."),
    jenisKelamin: z.enum(['Laki-laki', 'Perempuan'], { required_error: "Jenis kelamin wajib dipilih." }),
    tempatLahir: z.string().min(1, "Tempat lahir wajib diisi."),
    tanggalLahir: z.date({ required_error: "Tanggal lahir wajib diisi." }),
    agama: z.string().min(1, "Agama wajib diisi."),
    kewarganegaraan: z.string().min(1, "Kewarganegaraan wajib diisi."),
    anakKe: z.coerce.number().positive("Anak ke- harus positif."),
    jumlahSaudara: z.coerce.number().nonnegative("Jumlah saudara tidak boleh negatif."),
    bahasa: z.string().min(1, "Bahasa wajib diisi."),
    alamat: z.string().min(1, "Alamat wajib diisi."),
    telepon: z.string().min(1, "Telepon wajib diisi."),
    jarakKeSekolah: z.string().min(1, "Jarak ke sekolah wajib diisi."),

    // Dokumen - Kematian remains optional
    documents: z.object({
        kartuKeluarga: z.object({ fileName: z.string().min(1), file: z.any(), fileURL: z.string().optional() }),
        ktpAyah: z.object({ fileName: z.string().min(1), file: z.any(), fileURL: z.string().optional() }),
        ktpIbu: z.object({ fileName: z.string().min(1), file: z.any(), fileURL: z.string().optional() }),
        kartuIndonesiaPintar: z.object({ fileName: z.string().min(1), file: z.any(), fileURL: z.string().optional() }),
        ijazah: z.object({ fileName: z.string().min(1), file: z.any(), fileURL: z.string().optional() }),
        aktaKelahiran: z.object({ fileName: z.string().min(1), file: z.any(), fileURL: z.string().optional() }),
        akteKematianAyah: fileSchema.nullable(),
        akteKematianIbu: fileSchema.nullable(),
    }),

    // Orang Tua - Wali remains optional
    namaAyah: z.string().min(1, "Nama Ayah wajib diisi."),
    namaIbu: z.string().min(1, "Nama Ibu wajib diisi."),
    pekerjaanAyah: z.string().min(1, "Pekerjaan Ayah wajib diisi."),
    pekerjaanIbu: z.string().min(1, "Pekerjaan Ibu wajib diisi."),
    pendidikanAyah: z.string().optional(),
    pendidikanIbu: z.string().optional(),
    alamatOrangTua: z.string().min(1, "Alamat Orang Tua wajib diisi."),
    teleponOrangTua: z.string().optional(),
    namaWali: z.string().optional(),
    pekerjaanWali: z.string().optional(),

    // Rincian
    tinggiBadan: z.coerce.number().positive("Tinggi badan harus diisi."),
    beratBadan: z.coerce.number().positive("Berat badan harus diisi."),
    golonganDarah: z.enum(['A', 'B', 'AB', 'O']),
    penyakit: z.string().optional(), // Riwayat penyakit can be empty
    kelainanJasmani: z.string().optional(), // Kelainan jasmani can be empty

    // Perkembangan
    asalSekolah: z.string().min(1, "Asal sekolah wajib diisi."),
    tanggalMasuk: z.date({ required_error: "Tanggal masuk wajib diisi." }),
    hobi: z.string().min(1, "Hobi wajib diisi."),

    // Lanjutan - All are optional as they relate to leaving the school
    melanjutkanKe: z.string().optional(),
    tanggalLulus: z.date().optional(),
    alasanPindah: z.string().optional(),
});


export type StudentFormData = z.infer<typeof studentFormSchema>;
export type DocumentData = z.infer<typeof dataDokumenSchema>;
