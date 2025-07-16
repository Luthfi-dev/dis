
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Eye, FilePen, Trash2, Search } from 'lucide-react';
import { mockPegawaiData, Pegawai } from '@/lib/pegawai-data';
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
import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';

function ActionMenu({ pegawai, onDelete }: { pegawai: Pegawai, onDelete: (id: string) => void }) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  
  const handleDelete = () => {
    onDelete(pegawai.id);
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
            <Link href={`/pegawai/${pegawai.id}/lihat`}>
              <Eye className="mr-2 h-4 w-4" />
              <span>Lihat</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/pegawai/${pegawai.id}/edit`}>
              <FilePen className="mr-2 h-4 w-4" />
              <span>Edit</span>
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
            Tindakan ini tidak dapat diurungkan. Ini akan menghapus data pegawai <strong>{pegawai.nama}</strong> secara permanen.
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


export default function PegawaiPage() {
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('pegawaiData');
      if (storedData) {
        setPegawaiList(JSON.parse(storedData));
      } else {
        setPegawaiList(mockPegawaiData);
        localStorage.setItem('pegawaiData', JSON.stringify(mockPegawaiData));
      }
    } catch (error) {
      console.error("Failed to parse pegawai data from localStorage", error);
      setPegawaiList(mockPegawaiData);
    }
  }, []);

  const handleDeletePegawai = (id: string) => {
    const updatedPegawai = pegawaiList.filter(p => p.id !== id);
    setPegawaiList(updatedPegawai);
    localStorage.setItem('pegawaiData', JSON.stringify(updatedPegawai));
  };

  const filteredPegawai = useMemo(() => {
    if (!searchTerm) return pegawaiList;
    return pegawaiList.filter(p => 
      p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nip?.includes(searchTerm)
    );
  }, [pegawaiList, searchTerm]);


  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daftar Pegawai</h1>
          <p className="text-muted-foreground">Kelola data induk pegawai di sini.</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-start sm:justify-end">
          <Button asChild>
            <Link href="/pegawai/tambah">
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Pegawai
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle>Data Pegawai</CardTitle>
              <CardDescription>Total {filteredPegawai.length} pegawai ditemukan.</CardDescription>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Cari nama atau NIP..."
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
                  <TableHead>NIP</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPegawai.length > 0 ? (
                  filteredPegawai.map((pegawai) => (
                    <TableRow key={pegawai.id}>
                      <TableCell className="font-medium whitespace-nowrap">{pegawai.nama}</TableCell>
                      <TableCell className="whitespace-nowrap">{pegawai.nip || '-'}</TableCell>
                      <TableCell className="whitespace-nowrap">{pegawai.jabatan}</TableCell>
                      <TableCell>
                        <Badge variant={pegawai.status === 'Lengkap' ? 'default' : 'outline'} className={pegawai.status === 'Lengkap' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'text-amber-600 border-amber-500/50'}>
                          {pegawai.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <ActionMenu pegawai={pegawai} onDelete={handleDeletePegawai} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      Tidak ada data pegawai.
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
