
'use server';

import type { Siswa } from './data';
import type { Pegawai } from './pegawai-data';
import { mergeDeep, sanitizeData } from './utils';
import type { PegawaiFormData } from '@/lib/pegawai-data';
import type { StudentFormData } from '@/lib/student-data-t';


// --- Server-side Storage Simulation ---
if (typeof global.students === 'undefined') {
    (global as any).students = [];
}
if (typeof global.pegawai === 'undefined') {
    (global as any).pegawai = [];
}
const allStudents: Siswa[] = (global as any).students;
const allPegawai: Pegawai[] = (global as any).pegawai;


// --- Public-facing Server Actions ---

// SISWA ACTIONS
export async function getSiswa(): Promise<Siswa[]> {
    return allStudents;
}

export async function getSiswaById(id: string): Promise<Siswa | null> {
    const student = allStudents.find(s => s.id === id) || null;
    return student;
}

export async function deleteSiswa(id: string): Promise<{ success: boolean; message: string }> {
    const studentIndex = allStudents.findIndex(s => s.id === id);
    if (studentIndex > -1) {
        const studentName = allStudents[studentIndex].siswa_namaLengkap;
        allStudents.splice(studentIndex, 1);
        return { success: true, message: `Data siswa ${studentName} berhasil dihapus.` };
    }
    return { success: false, message: 'Gagal menghapus data siswa.' };
}

export async function submitStudentData(data: StudentFormData, studentId?: string) {
    try {
        const sanitizedData = sanitizeData(data);
        const id = studentId || crypto.randomUUID();
        
        // Simple completeness check
        const isComplete = sanitizedData.siswa_namaLengkap && sanitizedData.siswa_nis && sanitizedData.siswa_nisn;
        const status = isComplete ? 'Lengkap' : 'Belum Lengkap';
        
        const finalData: Siswa = { ...sanitizedData, id, status };
        
        const existingStudentIndex = allStudents.findIndex(s => s.id === id);

        if (existingStudentIndex !== -1) {
            allStudents[existingStudentIndex] = finalData;
        } else {
            allStudents.push(finalData);
        }

        const message = studentId ? `Data siswa ${finalData.siswa_namaLengkap} berhasil diperbarui!` : `Data siswa ${finalData.siswa_namaLengkap} berhasil disimpan!`;
        
        return { success: true, message, student: finalData };
    } catch (error: any) {
        console.error("Student submission server error:", error);
        return { success: false, message: `Gagal menyimpan data siswa karena kesalahan server: ${error.message}` };
    }
}


// PEGAWAI ACTIONS
export async function getPegawai(): Promise<Pegawai[]> {
    return allPegawai;
}

export async function getPegawaiById(id: string): Promise<Pegawai | null> {
    const p = allPegawai.find(p => p.id === id) || null;
    return p;
}

export async function deletePegawai(id: string): Promise<{ success: boolean; message: string }> {
    const pegawaiIndex = allPegawai.findIndex(p => p.id === id);
    if (pegawaiIndex > -1) {
        const pegawaiName = allPegawai[pegawaiIndex].pegawai_nama;
        allPegawai.splice(pegawaiIndex, 1);
        return { success: true, message: `Data pegawai ${pegawaiName} berhasil dihapus.` };
    }
    return { success: false, message: 'Gagal menghapus data pegawai.' };
}

export async function submitPegawaiData(data: PegawaiFormData, pegawaiId?: string) {
    try {
        const sanitizedData = sanitizeData(data);
        const id = pegawaiId || crypto.randomUUID();
        
        // A very simple check for completeness. We can make this more robust later.
        const status = sanitizedData.pegawai_nama && sanitizedData.pegawai_nip ? 'Lengkap' : 'Belum Lengkap';
        
        const finalData: Pegawai = { ...sanitizedData, id, status };
        
        const existingPegawaiIndex = allPegawai.findIndex(p => p.id === id);

        if (existingPegawaiIndex !== -1) {
            allPegawai[existingPegawaiIndex] = finalData;
        } else {
            allPegawai.push(finalData);
        }

        const message = pegawaiId ? `Data pegawai ${finalData.pegawai_nama} berhasil diperbarui!` : `Data pegawai ${finalData.pegawai_nama} berhasil disimpan!`;

        return { success: true, message, pegawai: finalData };
    } catch (error: any) {
        console.error("Pegawai submission server error:", error);
        return { success: false, message: `Gagal menyimpan data pegawai karena kesalahan server: ${error.message}` };
    }
}
