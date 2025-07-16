
import { z } from 'zod';

const fileSchema = z.object({
  fileName: z.string(),
  fileURL: z.string().url(),
}).nullable().optional();

const requiredFileSchema = z.object({
  fileName: z.string().min(1, 'File harus diunggah.'),
  fileURL: z.string().url('URL tidak valid'),
});

// Base schema object without transformation
const baseStudentSchema = z.object({
  siswa_fotoProfil: fileSchema,
  siswa_namaLengkap: z.string().min(1, "Nama lengkap wajib diisi."),
  siswa_nis: z.string().min(1, "Nomor Induk Sekolah wajib diisi."),
  siswa_nisn: z.string().length(10, "NISN harus 10 digit."),
  siswa_jenisKelamin: z.enum(['Laki-laki', 'Perempuan'], { required_error: "Jenis kelamin wajib dipilih." }),
  siswa_tempatLahir: z.string().min(1, "Tempat lahir wajib diisi."),
  siswa_tanggalLahir: z.date({ required_error: "Tanggal lahir wajib diisi." }),
  siswa_agama: z.enum(['Islam', 'Kristen', 'Hindu', 'Budha'], { required_error: "Agama wajib dipilih." }),
  siswa_kewarganegaraan: z.enum(['WNI', 'WNA'], { required_error: "Kewarganegaraan wajib dipilih." }),
  siswa_jumlahSaudara: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.coerce.number().int().nonnegative("Jumlah saudara tidak boleh negatif.").optional()
  ),
  siswa_bahasa: z.string().min(1, "Bahasa sehari-hari wajib diisi."),
  siswa_golonganDarah: z.enum(['A', 'B', 'AB', 'O'], { required_error: "Golongan darah wajib dipilih." }),
  
  // Dibuat opsional
  siswa_alamatKkProvinsi: z.string().optional(),
  siswa_alamatKkKabupaten: z.string().optional(),
  siswa_alamatKkKecamatan: z.string().optional(),
  siswa_alamatKkDesa: z.string().optional(),
  siswa_telepon: z.string().optional(),
  siswa_domisiliProvinsi: z.string().optional(),
  siswa_domisiliKabupaten: z.string().optional(),
  siswa_domisiliKecamatan: z.string().optional(),
  siswa_domisiliDesa: z.string().optional(),

  // Orang Tua (opsional)
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

  // Rincian (opsional)
  siswa_tinggiBadan: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.coerce.number().optional()
  ),
  siswa_beratBadan: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.coerce.number().optional()
  ),
  siswa_penyakit: z.string().optional(),
  siswa_kelainanJasmani: z.string().optional(),

  // Perkembangan (opsional)
  siswa_asalSekolah: z.string().optional(),
  siswa_nomorSttb: z.string().optional(),
  siswa_tanggalSttb: z.date().optional().nullable(),
  siswa_pindahanAsalSekolah: z.string().optional(),
  siswa_pindahanDariTingkat: z.string().optional(),
  siswa_pindahanDiterimaTanggal: z.date().optional().nullable(),

  // Meninggalkan Sekolah (opsional)
  siswa_lulusTahun: z.string().optional(),
  siswa_lulusNomorIjazah: z.string().optional(),
  siswa_lulusMelanjutkanKe: z.string().optional(),
  siswa_pindahKeSekolah: z.string().optional(),
  siswa_pindahTingkatKelas: z.string().optional(),
  siswa_pindahKeTingkat: z.string().optional(),
  siswa_keluarAlasan: z.string().optional(),
  siswa_keluarTanggal: z.date().optional().nullable(),

  // Dokumen (opsional)
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

// Skema utama yang digunakan oleh form resolver.
export const studentFormSchema = baseStudentSchema;

// Skema ketat ini HANYA digunakan di server untuk menentukan status 'Lengkap'
export const completeStudentFormSchema = baseStudentSchema.extend({
    // Semua yang wajib untuk status lengkap
    siswa_alamatKkProvinsi: z.string().min(1, "Provinsi (KK) wajib dipilih."),
    siswa_alamatKkKabupaten: z.string().min(1, "Kabupaten (KK) wajib dipilih."),
    siswa_alamatKkKecamatan: z.string().min(1, "Kecamatan (KK) wajib dipilih."),
    siswa_alamatKkDesa: z.string().min(1, "Desa (KK) wajib diisi."),
    siswa_telepon: z.string().min(1, "Nomor HP/WA wajib diisi."),

    documents: z.object({
        kartuKeluarga: requiredFileSchema,
        ktpAyah: requiredFileSchema,
        ktpIbu: requiredFileSchema,
        kartuIndonesiaPintar: requiredFileSchema,
        ijazah: requiredFileSchema,
        aktaKelahiran: requiredFileSchema,
        akteKematianAyah: fileSchema, // Tetap opsional
        akteKematianIbu: fileSchema, // Tetap opsional
        raporSmt1: requiredFileSchema,
        raporSmt2: requiredFileSchema,
        raporSmt3: requiredFileSchema,
        raporSmt4: requiredFileSchema,
        raporSmt5: requiredFileSchema,
        raporSmt6: requiredFileSchema,
        ijazahSmp: requiredFileSchema,
        transkripSmp: requiredFileSchema,
    }),

    siswa_namaAyah: z.string().min(1, "Nama Ayah wajib diisi."),
    siswa_namaIbu: z.string().min(1, "Nama Ibu wajib diisi."),
    siswa_pendidikanAyah: z.string().min(1, "Pendidikan Ayah wajib diisi."),
    siswa_pendidikanIbu: z.string().min(1, "Pendidikan Ibu wajib diisi."),
    siswa_pekerjaanAyah: z.string().min(1, "Pekerjaan Ayah wajib diisi."),
    siswa_pekerjaanIbu: z.string().min(1, "Pekerjaan Ibu wajib diisi."),
    siswa_alamatOrangTua: z.string().min(1, "Alamat Orang Tua wajib diisi."),
    
    siswa_tinggiBadan: z.coerce.number().positive("Tinggi badan harus diisi."),
    siswa_beratBadan: z.coerce.number().positive("Berat badan harus diisi."),
    
    siswa_asalSekolah: z.string().min(1, "Asal sekolah wajib diisi."),
});

export type StudentFormData = z.infer<typeof studentFormSchema>;
