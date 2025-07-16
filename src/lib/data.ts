
import { StudentFormData } from "./schema";

// This renames the internal fields to use the `siswa_` prefix.
// It keeps the external-facing props like 'namaLengkap' for easier component use.
export type Siswa = StudentFormData & {
  id: string;
  namaLengkap: string;
  nisn: string;
  jenisKelamin: string;
  status: 'Lengkap' | 'Belum Lengkap';
};


// To make this work on the server, we need a global variable to simulate a database.
// In a real app, this would be a database connection.
declare global {
  var students: Siswa[];
}

export const mockSiswaData: Siswa[] = global.students || [];

if (process.env.NODE_ENV !== 'production') {
  global.students = global.students || [];
}
