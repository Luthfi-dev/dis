
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, FilePen, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Provinsi } from '@/lib/wilayah';

const STORAGE_KEY = 'provinsiData';

export default function ProvinsiPage() {
  const [provinsiList, setProvinsiList] = useState<Provinsi[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedProvinsi, setSelectedProvinsi] = useState<Provinsi | null>(null);
  const [formData, setFormData] = useState({ id: '', name: '' });
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setProvinsiList(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
    }
  }, []);

  const saveData = (data: Provinsi[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setProvinsiList(data);
  };

  const handleAdd = () => {
    setSelectedProvinsi(null);
    setFormData({ id: '', name: '' });
    setIsFormOpen(true);
  };

  const handleEdit = (provinsi: Provinsi) => {
    setSelectedProvinsi(provinsi);
    setFormData({ id: provinsi.id, name: provinsi.name });
    setIsFormOpen(true);
  };

  const handleDeleteClick = (provinsi: Provinsi) => {
    setSelectedProvinsi(provinsi);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedProvinsi) return;
    const updatedList = provinsiList.filter(p => p.id !== selectedProvinsi.id);
    saveData(updatedList);
    toast({ title: "Sukses!", description: "Data provinsi berhasil dihapus." });
    setIsAlertOpen(false);
    setSelectedProvinsi(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.name) {
      toast({ title: "Error!", description: "ID dan Nama Provinsi wajib diisi.", variant: "destructive" });
      return;
    }

    if (selectedProvinsi) { // Editing
      const updatedList = provinsiList.map(p => p.id === selectedProvinsi.id ? { ...p, ...formData } : p);
      saveData(updatedList);
      toast({ title: "Sukses!", description: "Data provinsi berhasil diperbarui." });
    } else { // Adding
      if (provinsiList.some(p => p.id === formData.id)) {
        toast({ title: "Error!", description: "ID Provinsi sudah ada.", variant: "destructive" });
        return;
      }
      saveData([...provinsiList, { id: formData.id, name: formData.name }]);
      toast({ title: "Sukses!", description: "Data provinsi berhasil ditambahkan." });
    }
    setIsFormOpen(false);
    setSelectedProvinsi(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Master Provinsi</h1>
          <p className="text-muted-foreground">Kelola data provinsi di sini.</p>
        </div>
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Provinsi
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Provinsi</CardTitle>
          <CardDescription>Total {provinsiList.length} provinsi ditemukan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nama Provinsi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {provinsiList.length > 0 ? (
                provinsiList.map((provinsi) => (
                  <TableRow key={provinsi.id}>
                    <TableCell className="font-medium">{provinsi.id}</TableCell>
                    <TableCell>{provinsi.name}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(provinsi)}>
                            <FilePen className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClick(provinsi)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Hapus</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Tidak ada data.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleFormSubmit}>
            <DialogHeader>
              <DialogTitle>{selectedProvinsi ? 'Edit Provinsi' : 'Tambah Provinsi'}</DialogTitle>
              <DialogDescription>
                {selectedProvinsi ? 'Perbarui data provinsi.' : 'Tambahkan provinsi baru ke dalam sistem.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id" className="text-right">ID</Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="col-span-3"
                  disabled={!!selectedProvinsi}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nama</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Batal</Button>
              </DialogClose>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat diurungkan. Ini akan menghapus data provinsi <strong>{selectedProvinsi?.name}</strong> secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
