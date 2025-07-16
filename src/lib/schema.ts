
import { z } from 'zod';

const fileSchema = z.object({
  fileName: z.string(),
  fileURL: z.string().url(),
}).nullable().optional();

const requiredFileSchema = z.object({
  fileName: z.string().min(1, 'File harus diunggah.'),
  fileURL: z.string().url('URL tidak valid'),
});

// Base schema with minimum requirements for Step 1
export const dataSiswaSchema = z.object({
  siswa_fotoProfil: fileSchema,
  siswa_namaLengkap: z.string().min(3, "Nama lengkap minimal 3 karakter."),
  siswa_nis: z.string().min(1, "Nomor Induk Sekolah wajib diisi."),
  siswa_nisn: z.string().length(10, "NISN harus 10 digit."),
  siswa_jenisKelamin: z.enum(['Laki-laki', 'Perempuan'], { required_error: "Jenis kelamin wajib dipilih." }),
  siswa_tempatLahir: z.string().min(1, "Tempat lahir wajib diisi."),
  siswa_tanggalLahir: z.date({ required_error: "Tanggal lahir wajib diisi." }),
  siswa_agama: z.enum(['Islam', 'Kristen', 'Hindu', 'Budha'], { required_error: "Agama wajib dipilih." }),
  siswa_kewarganegaraan: z.enum(['WNI', 'WNA'], { required_error: "Kewarganegaraan wajib dipilih." }),
  siswa_jumlahSaudara: z.coerce.number().nonnegative("Jumlah saudara tidak boleh negatif."),
  siswa_bahasa: z.string().min(1, "Bahasa sehari-hari wajib diisi."),
  siswa_golonganDarah: z.enum(['A', 'B', 'AB', 'O'], { required_error: "Golongan darah wajib dipilih." }),
  siswa_alamatKkProvinsi: z.string().min(1, "Provinsi (KK) wajib dipilih."),
  siswa_alamatKkKabupaten: z.string().min(1, "Kabupaten (KK) wajib dipilih."),
  siswa_alamatKkKecamatan: z.string().min(1, "Kecamatan (KK) wajib dipilih."),
  siswa_alamatKkDesa: z.string().min(1, "Desa (KK) wajib diisi."),
  siswa_telepon: z.string().min(1, "Nomor HP/WA wajib diisi."),
  siswa_domisiliProvinsi: z.string().min(1, "Provinsi domisili wajib dipilih."),
  siswa_domisiliKabupaten: z.string().min(1, "Kabupaten domisili wajib dipilih."),
  siswa_domisiliKecamatan: z.string().min(1, "Kecamatan domisili wajib dipilih."),
  siswa_domisiliDesa: z.string().min(1, "Desa domisili wajib dipilih."),
});

// Schemas for other steps (mostly optional for draft saving)
export const dataOrangTuaSchema = z.object({
  siswa_namaAyah: z.string().optional(),
  siswa_namaIbu: z.string().optional(),
  siswa_pendidikanAyah: z.string().optional(),
  siswa_pendidikanIbu: z.string().optional(),
  siswa_pekerjaanAyah: z.string().optional(),
  siswa_pekerjaanIbu: z.string().optional(),
  siswa_namaWali: z.string().optional(),
  siswa_hubunganWali: z.string().optional(),
  siswa_pendidikanWali: z.string().optional(),
  siswa_pekerjaanWali: z.string().optional(),
  siswa_alamatOrangTua: z.string().optional(),
  siswa_teleponOrangTua: z.string().optional(),
});

export const dataRincianSchema = z.object({
  siswa_tinggiBadan: z.coerce.number().optional(),
  siswa_beratBadan: z.coerce.number().optional(),
  siswa_penyakit: z.string().optional(),
  siswa_kelainanJasmani: z.string().optional(),
});

export const dataPerkembanganSchema = z.object({
  // Siswa Baru
  siswa_asalSekolah: z.string().optional(),
  siswa_nomorSttb: z.string().optional(),
  siswa_tanggalSttb: z.date().optional(),
  // Pindahan
  siswa_pindahanAsalSekolah: z.string().optional(),
  siswa_pindahanDariTingkat: z.string().optional(),
  siswa_pindahanDiterimaTanggal: z.date().optional(),
});

export const dataMeninggalkanSekolahSchema = z.object({
    // Lulus
    siswa_lulusTahun: z.string().optional(),
    siswa_lulusNomorIjazah: z.string().optional(),
    siswa_lulusMelanjutkanKe: z.string().optional(),
    // Pindah
    siswa_pindahKeSekolah: z.string().optional(),
    siswa_pindahTingkatKelas: z.string().optional(),
    siswa_pindahKeTingkat: z.string().optional(),
    // Keluar
    siswa_keluarAlasan: z.string().optional(),
    siswa_keluarTanggal: z.date().optional(),
});


export const dataDokumenSchema = z.object({
  documents: z.object({
    kartuKeluarga: fileSchema,
    ktpAyah: fileSchema,
    ktpIbu: fileSchema,
    kartuIndonesiaPintar: fileSchema,
    ijazah: fileSchema,
    aktaKelahiran: fileSchema,
    akteKematianAyah: fileSchema,
    akteKematianIbu: fileSchema,
    raporSmt1: fileSchema,
    raporSmt2: fileSchema,
    raporSmt3: fileSchema,
    raporSmt4: fileSchema,
    raporSmt5: fileSchema,
    raporSmt6: fileSchema,
    ijazahSmp: fileSchema,
    transkripSmp: fileSchema,
  }).optional(),
});

// Merged schema for the entire form, mostly optional for draft saving
export const studentFormSchema = dataSiswaSchema
  .merge(dataOrangTuaSchema)
  .merge(dataRincianSchema)
  .merge(dataPerkembanganSchema)
  .merge(dataMeninggalkanSekolahSchema)
  .merge(dataDokumenSchema)
  // This transformation ensures that if a field that is supposed to be a number (like jumlahSaudara)
  // is submitted as an empty string, it gets converted to a number (0) or handled gracefully.
  .transform((data) => ({
      ...data,
      siswa_jumlahSaudara: Number(data.siswa_jumlahSaudara) || 0,
      siswa_tinggiBadan: Number(data.siswa_tinggiBadan) || undefined,
      siswa_beratBadan: Number(data.siswa_beratBadan) || undefined,
  }));

const optionalFile = fileSchema.nullable();

// A stricter schema to check for completion status
// All fields that are optional in the main form are made required here.
export const completeStudentFormSchema = dataSiswaSchema.merge(
    z.object({
    // Dokumen - All documents are required for status 'Lengkap'
    documents: z.object({
        kartuKeluarga: requiredFileSchema,
        ktpAyah: requiredFileSchema,
        ktpIbu: requiredFileSchema,
        kartuIndonesiaPintar: requiredFileSchema,
        ijazah: requiredFileSchema,
        aktaKelahiran: requiredFileSchema,
        akteKematianAyah: optionalFile,
        akteKematianIbu: optionalFile,
        raporSmt1: requiredFileSchema,
        raporSmt2: requiredFileSchema,
        raporSmt3: requiredFileSchema,
        raporSmt4: requiredFileSchema,
        raporSmt5: requiredFileSchema,
        raporSmt6: requiredFileSchema,
        ijazahSmp: requiredFileSchema,
        transkripSmp: requiredFileSchema,
    }),

    // Orang Tua - Wali remains optional, but if a wali is named, other details might be needed.
    siswa_namaAyah: z.string().min(1, "Nama Ayah wajib diisi."),
    siswa_namaIbu: z.string().min(1, "Nama Ibu wajib diisi."),
    siswa_pendidikanAyah: z.string().min(1, "Pendidikan Ayah wajib diisi."),
    siswa_pendidikanIbu: z.string().min(1, "Pendidikan Ibu wajib diisi."),
    siswa_pekerjaanAyah: z.string().min(1, "Pekerjaan Ayah wajib diisi."),
    siswa_pekerjaanIbu: z.string().min(1, "Pekerjaan Ibu wajib diisi."),
    siswa_alamatOrangTua: z.string().min(1, "Alamat Orang Tua wajib diisi."),
    
    // Rincian
    siswa_tinggiBadan: z.coerce.number().positive("Tinggi badan harus diisi."),
    siswa_beratBadan: z.coerce.number().positive("Berat badan harus diisi."),
    
    // Perkembangan
    siswa_asalSekolah: z.string().min(1, "Asal sekolah wajib diisi."),
})
);


export type StudentFormData = z.infer<typeof studentFormSchema>;
export type DocumentData = z.infer<typeof dataDokumenSchema>;
