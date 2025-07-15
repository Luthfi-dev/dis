'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Upload, Download, FilePen, Eye, FileSearch, Trash2 } from 'lucide-react';
import { mockSiswaData, Siswa } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import React, { useState, useEffect } from 'react';

function ActionMenu({ student, onDelete }: { student: Siswa, onDelete: (id: string) => void }) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  
  const handleDelete = () => {
    onDelete(student.id);
    setIsAlertOpen(false);
  }

  return (
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Buka menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/siswa/${student.id}/lihat`}>
              <Eye className="mr-2 h-4 w-4" />
              <span>Lihat</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/siswa/${student.id}/edit`}>
              <FilePen className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/siswa/${student.id}/preview`}>
              <FileSearch className="mr-2 h-4 w-4" />
              <span>Preview</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
             <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onSelect={(e) => e.preventDefault()}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Hapus</span>
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat diurungkan. Ini akan menghapus data siswa <strong>{student.namaLengkap}</strong> secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>Hapus</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


export default function SiswaPage() {
  const [students, setStudents] = useState<Siswa[]>([]);

  useEffect(() => {
    // This effect runs only on the client side
    try {
      const storedData = localStorage.getItem('siswaData');
      if (storedData) {
        setStudents(JSON.parse(storedData));
      } else {
        // If no data in localStorage, initialize with mock data
        setStudents(mockSiswaData);
        localStorage.setItem('siswaData', JSON.stringify(mockSiswaData));
      }
    } catch (error) {
      console.error("Failed to parse student data from localStorage", error);
      setStudents(mockSiswaData);
    }
  }, []);

  const handleDeleteStudent = (id: string) => {
    const updatedStudents = students.filter(student => student.id !== id);
    setStudents(updatedStudents);
    localStorage.setItem('siswaData', JSON.stringify(updatedStudents));
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daftar Siswa</h1>
          <p className="text-muted-foreground">Kelola data induk siswa di sini.</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-start sm:justify-end">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Template
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button asChild>
            <Link href="/siswa/tambah">
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Siswa
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Data Siswa</CardTitle>
          <CardDescription>Total {students.length} siswa terdaftar di sistem.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>NISN</TableHead>
                  <TableHead>Jenis Kelamin</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium whitespace-nowrap">{student.namaLengkap}</TableCell>
                    <TableCell className="whitespace-nowrap">{student.nisn}</TableCell>
                    <TableCell>
                      <Badge variant={student.jenisKelamin === 'Laki-laki' ? 'default' : 'secondary'} className={student.jenisKelamin === 'Perempuan' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300' : ''}>
                        {student.jenisKelamin}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={student.status === 'Lengkap' ? 'default' : 'outline'} className={student.status === 'Lengkap' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'text-amber-600 border-amber-500/50'}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionMenu student={student} onDelete={handleDeleteStudent} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
