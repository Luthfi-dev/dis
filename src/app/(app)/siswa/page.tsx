
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Upload, Download, FilePen, Eye, FileSearch, Trash2, Search } from 'lucide-react';
import { Siswa } from '@/lib/data';
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
import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { getSiswa, deleteSiswa } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

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
            Tindakan ini tidak dapat diurungkan. Ini akan menghapus data siswa <strong>{student.siswa_namaLengkap}</strong> secara permanen.
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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, startDeleteTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const data = await getSiswa();
      setStudents(data);
      setLoading(false);
    }
    fetchStudents();
  }, []);

  const handleDeleteStudent = (id: string) => {
    startDeleteTransition(async () => {
      const result = await deleteSiswa(id);
      if (result.success) {
        setStudents(prev => prev.filter(student => student.id !== id));
        toast({ title: 'Sukses!', description: result.message });
      } else {
        toast({ title: 'Gagal', description: result.message, variant: 'destructive' });
      }
    });
  };

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    return students.filter(student => 
      student.siswa_namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.siswa_nisn.includes(searchTerm)
    );
  }, [students, searchTerm]);


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
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle>Data Siswa</CardTitle>
              <CardDescription>Total {filteredStudents.length} siswa ditemukan.</CardDescription>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Cari nama atau NISN..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
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
                {loading ? (
                   Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5} className="py-4"><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                    </TableRow>
                  ))
                ) : filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id} className={isDeleting ? 'opacity-50' : ''}>
                      <TableCell className="font-medium whitespace-nowrap">{student.siswa_namaLengkap}</TableCell>
                      <TableCell className="whitespace-nowrap">{student.siswa_nisn}</TableCell>
                      <TableCell>
                        <Badge variant={student.siswa_jenisKelamin === 'Laki-laki' ? 'default' : 'secondary'} className={student.siswa_jenisKelamin === 'Perempuan' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300' : ''}>
                          {student.siswa_jenisKelamin}
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      Tidak ada data siswa yang cocok dengan pencarian.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
