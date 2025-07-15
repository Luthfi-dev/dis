import { StudentFormData } from "./schema";

export type Siswa = StudentFormData & {
  id: string;
  status: 'Lengkap' | 'Belum Lengkap';
};

export const mockSiswaData: Siswa[] = [];
