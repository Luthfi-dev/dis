import { StudentFormData } from "./schema";

export type Siswa = StudentFormData & {
  id: string;
  status: 'Lengkap' | 'Belum Lengkap';
};

export const mockSiswaData: Siswa[] = [
  { id: '1', namaLengkap: 'Budi Santoso', nisn: '0012345678', jenisKelamin: 'Laki-laki', tanggalLahir: '2008-05-15', status: 'Lengkap', agama: 'Islam', alamat: 'Jl. Merdeka No. 1', kewarganegaraan: 'Indonesia' },
  { id: '2', namaLengkap: 'Citra Lestari', nisn: '0023456789', jenisKelamin: 'Perempuan', tanggalLahir: '2008-08-20', status: 'Lengkap', agama: 'Islam', alamat: 'Jl. Pahlawan No. 2', kewarganegaraan: 'Indonesia' },
  { id: '3', namaLengkap: 'Dewi Anggraini', nisn: '0034567890', jenisKelamin: 'Perempuan', tanggalLahir: '2007-11-30', status: 'Belum Lengkap', agama: 'Kristen', alamat: 'Jl. Mawar No. 3', kewarganegaraan: 'Indonesia' },
  { id: '4', namaLengkap: 'Eko Prasetyo', nisn: '0045678901', jenisKelamin: 'Laki-laki', tanggalLahir: '2008-02-10', status: 'Lengkap', agama: 'Islam', alamat: 'Jl. Melati No. 4', kewarganegaraan: 'Indonesia' },
  { id: '5', namaLengkap: 'Fitriani', nisn: '0056789012', jenisKelamin: 'Perempuan', tanggalLahir: '2009-01-25', status: 'Belum Lengkap', agama: 'Buddha', alamat: 'Jl. Kenanga No. 5', kewarganegaraan: 'Indonesia' },
  { id: '6', namaLengkap: 'Gilang Ramadhan', nisn: '0067890123', jenisKelamin: 'Laki-laki', tanggalLahir: '2008-09-01', status: 'Lengkap', agama: 'Islam', alamat: 'Jl. Anggrek No. 6', kewarganegaraan: 'Indonesia' },
];
