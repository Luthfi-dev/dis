export type Siswa = {
  id: string;
  namaLengkap: string;
  nisn: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  tanggalLahir: string; // YYYY-MM-DD
  status: 'Lengkap' | 'Draft';
};

export const mockSiswaData: Siswa[] = [
  { id: '1', namaLengkap: 'Budi Santoso', nisn: '0012345678', jenisKelamin: 'Laki-laki', tanggalLahir: '2008-05-15', status: 'Lengkap' },
  { id: '2', namaLengkap: 'Citra Lestari', nisn: '0023456789', jenisKelamin: 'Perempuan', tanggalLahir: '2008-08-20', status: 'Lengkap' },
  { id: '3', namaLengkap: 'Dewi Anggraini', nisn: '0034567890', jenisKelamin: 'Perempuan', tanggalLahir: '2007-11-30', status: 'Draft' },
  { id: '4', namaLengkap: 'Eko Prasetyo', nisn: '0045678901', jenisKelamin: 'Laki-laki', tanggalLahir: '2008-02-10', status: 'Lengkap' },
  { id: '5', namaLengkap: 'Fitriani', nisn: '0056789012', jenisKelamin: 'Perempuan', tanggalLahir: '2009-01-25', status: 'Draft' },
  { id: '6', namaLengkap: 'Gilang Ramadhan', nisn: '0067890123', jenisKelamin: 'Laki-laki', tanggalLahir: '2008-09-01', status: 'Lengkap' },
];
