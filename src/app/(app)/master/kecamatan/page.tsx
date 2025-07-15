
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
import type { Kecamatan, Kabupaten } from '@/lib/wilayah';
import { getKecamatans, saveKecamatans, getKabupatens, getKabupatenName } from '@/lib/wilayah';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type FormData = {
  id: string;
  name: string;
  regency_id: string;
}

export default function KecamatanPage() {
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);
  const [kabupatenList, setKabupatenList] = useState<Kabupaten[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedKecamatan, setSelectedKecamatan] = useState<Kecamatan | null>(null);
  const [formData, setFormData] = useState<FormData>({ id: '', name: '', regency_id: '' });
  const { toast } = useToast();

  useEffect(() => {
    setKecamatanList(getKecamatans());
    setKabupatenList(getKabupatens());
  }, []);

  const saveData = (data: Kecamatan[]) => {
    saveKecamatans(data);
    setKecamatanList(data);
  };

  const handleAdd = () => {
    setSelectedKecamatan(null);
    setFormData({ id: '', name: '', regency_id: '' });
    setIsFormOpen(true);
  };

  const handleEdit = (kecamatan: Kecamatan) => {
    setSelectedKecamatan(kecamatan);
    setFormData({ id: kecamatan.id, name: kecamatan.name, regency_id: kecamatan.regency_id });
    setIsFormOpen(true);
  };

  const handleDeleteClick = (kecamatan: Kecamatan) => {
    setSelectedKecamatan(kecamatan);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedKecamatan) return;
    const updatedList = kecamatanList.filter(p => p.id !== selectedKecamatan.id);
    saveData(updatedList);
    toast({ title: "Sukses!", description: "Data kecamatan berhasil dihapus." });
    setIsAlertOpen(false);
    setSelectedKecamatan(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.name || !formData.regency_id) {
      toast({ title: "Error!", description: "ID, Nama, dan Kabupaten wajib diisi.", variant: "destructive" });
      return;
    }

    if (selectedKecamatan) { // Editing
      const updatedList = kecamatanList.map(p => p.id === selectedKecamatan.id ? { ...p, ...formData } : p);
      saveData(updatedList);
      toast({ title: "Sukses!", description: "Data kecamatan berhasil diperbarui." });
    } else { // Adding
      if (kecamatanList.some(p => p.id === formData.id)) {
        toast({ title: "Error!", description: "ID Kecamatan sudah ada.", variant: "destructive" });
        return;
      }
      saveData([...kecamatanList, { id: formData.id, name: formData.name, regency_id: formData.regency_id }]);
      toast({ title: "Sukses!", description: "Data kecamatan berhasil ditambahkan." });
    }
    setIsFormOpen(false);
    setSelectedKecamatan(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Master Kecamatan</h1>
          <p className="text-muted-foreground">Kelola data kecamatan di sini.</p>
        </div>
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Kecamatan
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Kecamatan</CardTitle>
          <CardDescription>Total {kecamatanList.length} kecamatan ditemukan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nama Kecamatan</TableHead>
                <TableHead>Kabupaten</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kecamatanList.length > 0 ? (
                kecamatanList.map((kecamatan) => (
                  <TableRow key={kecamatan.id}>
                    <TableCell className="font-medium">{kecamatan.id}</TableCell>
                    <TableCell>{kecamatan.name}</TableCell>
                    <TableCell>{getKabupatenName(kecamatan.regency_id)}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEdit(kecamatan)}>
                            <FilePen className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClick(kecamatan)} className="text-destructive">
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
                  <TableCell colSpan={4} className="h-24 text-center">
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
              <DialogTitle>{selectedKecamatan ? 'Edit Kecamatan' : 'Tambah Kecamatan'}</DialogTitle>
              <DialogDescription>
                {selectedKecamatan ? 'Perbarui data kecamatan.' : 'Tambahkan kecamatan baru ke dalam sistem.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="regency_id" className="text-right">Kabupaten</Label>
                 <Select
                    value={formData.regency_id}
                    onValueChange={(value) => setFormData({ ...formData, regency_id: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih Kabupaten" />
                    </SelectTrigger>
                    <SelectContent>
                      {kabupatenList.map((kab) => (
                        <SelectItem key={kab.id} value={kab.id}>
                          {kab.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id" className="text-right">ID</Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="col-span-3"
                  disabled={!!selectedKecamatan}
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
              Tindakan ini tidak dapat diurungkan. Ini akan menghapus data kecamatan <strong>{selectedKecamatan?.name}</strong> secara permanen.
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
