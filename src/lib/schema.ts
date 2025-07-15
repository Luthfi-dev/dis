import { z } from 'zod';

const fileSchema = z.object({
  fileName: z.string(),
  file: z.any().refine(file => file instanceof File, "File is required."),
  fileURL: z.string().optional(),
}).optional();

// Base schema with minimum requirements for Step 1
export const dataSiswaSchema = z.object({
  fotoProfil: fileSchema,
  namaLengkap: z.string().min(3, "Nama lengkap minimal 3 karakter."),
  nis: z.string().min(1, "Nomor Induk Sekolah wajib diisi."),
  nisn: z.string().length(10, "NISN harus 10 digit."),
  jenisKelamin: z.enum(['Laki-laki', 'Perempuan'], { required_error: "Jenis kelamin wajib dipilih." }),
  tempatLahir: z.string().min(1, "Tempat lahir wajib diisi."),
  tanggalLahir: z.date({ required_error: "Tanggal lahir wajib diisi." }),
  agama: z.enum(['Islam', 'Kristen', 'Hindu', 'Budha'], { required_error: "Agama wajib dipilih." }),
  kewarganegaraan: z.enum(['WNI', 'WNA'], { required_error: "Kewarganegaraan wajib dipilih." }),
  jumlahSaudara: z.coerce.number().nonnegative("Jumlah saudara tidak boleh negatif."),
  bahasa: z.string().min(1, "Bahasa sehari-hari wajib diisi."),
  golonganDarah: z.enum(['A', 'B', 'AB', 'O'], { required_error: "Golongan darah wajib dipilih." }),
  alamatKkProvinsi: z.string().min(1, "Provinsi (KK) wajib dipilih."),
  alamatKkKabupaten: z.string().min(1, "Kabupaten (KK) wajib dipilih."),
  alamatKkKecamatan: z.string().min(1, "Kecamatan (KK) wajib dipilih."),
  alamatKkDesa: z.string().min(1, "Desa (KK) wajib diisi."),
  telepon: z.string().min(1, "Nomor HP/WA wajib diisi."),
  domisiliProvinsi: z.string().min(1, "Provinsi domisili wajib dipilih."),
  domisiliKabupaten: z.string().min(1, "Kabupaten domisili wajib dipilih."),
  domisiliKecamatan: z.string().min(1, "Kecamatan domisili wajib dipilih."),
  domisiliDesa: z.string().min(1, "Desa domisili wajib dipilih."),
});

// Schemas for other steps (mostly optional for draft saving)
export const dataOrangTuaSchema = z.object({
  namaAyah: z.string().optional(),
  namaIbu: z.string().optional(),
  pendidikanAyah: z.string().optional(),
  pendidikanIbu: z.string().optional(),
  pekerjaanAyah: z.string().optional(),
  pekerjaanIbu: z.string().optional(),
  namaWali: z.string().optional(),
  hubunganWali: z.string().optional(),
  pendidikanWali: z.string().optional(),
  pekerjaanWali: z.string().optional(),
  alamatOrangTua: z.string().optional(),
  teleponOrangTua: z.string().optional(),
});

export const dataRincianSchema = z.object({
  tinggiBadan: z.coerce.number().optional(),
  beratBadan: z.coerce.number().optional(),
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
    akteKematianAyah: fileSchema.nullable(),
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
export const completeStudentFormSchema = dataSiswaSchema.merge(
    z.object({
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

    // Orang Tua - Wali remains optional, but if a wali is named, other details might be needed.
    namaAyah: z.string().min(1, "Nama Ayah wajib diisi."),
    namaIbu: z.string().min(1, "Nama Ibu wajib diisi."),
    pendidikanAyah: z.string().min(1, "Pendidikan Ayah wajib diisi."),
    pendidikanIbu: z.string().min(1, "Pendidikan Ibu wajib diisi."),
    pekerjaanAyah: z.string().min(1, "Pekerjaan Ayah wajib diisi."),
    pekerjaanIbu: z.string().min(1, "Pekerjaan Ibu wajib diisi."),
    alamatOrangTua: z.string().min(1, "Alamat Orang Tua wajib diisi."),
    teleponOrangTua: z.string().optional(),
    namaWali: z.string().optional(),
    hubunganWali: z.string().optional(),
    pendidikanWali: z.string().optional(),
    pekerjaanWali: z.string().optional(),

    // Rincian
    tinggiBadan: z.coerce.number().positive("Tinggi badan harus diisi."),
    beratBadan: z.coerce.number().positive("Berat badan harus diisi."),
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
})
);


export type StudentFormData = z.infer<typeof studentFormSchema>;
export type DocumentData = z.infer<typeof dataDokumenSchema>;
