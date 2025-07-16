
import type { StudentFormData } from "./student-data-t";

export type Siswa = StudentFormData & {
  id: string;
  status: 'Lengkap' | 'Belum Lengkap';
};


// To make this work on the server, we need a global variable to simulate a database.
// In a real app, this would be a database connection.
declare global {
  var students: Siswa[];
}

// Initialize the global variable only if it's not already defined.
if (!(global as any).students) {
  (global as any).students = [];
}
