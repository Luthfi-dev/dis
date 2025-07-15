
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
import type { Desa, Kecamatan } from '@/lib/wilayah';
import { getDesas, saveDesas, getKecamatans, getKecamatanName } from '@/lib/wilayah';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type FormData = {
  id: string;
  name: string;
  district_id: string;
}

export default function DesaPage() {
  const [desaList, setDesaList] = useState<Desa[]>([]);
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedDesa, setSelectedDesa] = useState<Desa | null>(null);
  const [formData, setFormData] = useState<FormData>({ id: '', name: '', district_id: '' });
  const { toast } = useToast();

  useEffect(() => {
    setDesaList(getDesas());
    setKecamatanList(getKecamatans());
  }, []);

  const saveData = (data: Desa[]) => {
    saveDesas(data);
    setDesaList(data);
  };

  const handleAdd = () => {
    setSelectedDesa(null);
    setFormData({ id: '', name: '', district_id: '' });
    setIsFormOpen(true);
  };

  const handleEdit = (desa: Desa) => {
    setSelectedDesa(desa);
    setFormData({ id: desa.id, name: desa.name, district_id: desa.district_id });
    setIsFormOpen(true);
  };

  const handleDeleteClick = (desa: Desa) => {
    setSelectedDesa(desa);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedDesa) return;
    const updatedList = desaList.filter(p => p.id !== selectedDesa.id);
    saveData(updatedList);
    toast({ title: "Sukses!", description: "Data desa berhasil dihapus." });
    setIsAlertOpen(false);
    setSelectedDesa(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.name || !formData.district_id) {
      toast({ title: "Error!", description: "ID, Nama, dan Kecamatan wajib diisi.", variant: "destructive" });
      return;
    }

    if (selectedDesa) { // Editing
      const updatedList = desaList.map(p => p.id === selectedDesa.id ? { ...p, ...formData } : p);
      saveData(updatedList);
      toast({ title: "Sukses!", description: "Data desa berhasil diperbarui." });
    } else { // Adding
      if (desaList.some(p => p.id === formData.id)) {
        toast({ title: "Error!", description: "ID Desa sudah ada.", variant: "destructive" });
        return;
      }
      saveData([...desaList, { id: formData.id, name: formData.name, district_id: formData.district_id }]);
      toast({ title: "Sukses!", description: "Data desa berhasil ditambahkan." });
    }
    setIsFormOpen(false);
    setSelectedDesa(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Master Desa</h1>
          <p className="text-muted-foreground">Kelola data desa di sini.</p>
        </div>
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Desa
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Desa</CardTitle>
          <CardDescription>Total {desaList.length} desa ditemukan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nama Desa</TableHead>
                <TableHead>Kecamatan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {desaList.length > 0 ? (
                desaList.map((desa) => (
                  <TableRow key={desa.id}>
                    <TableCell className="font-medium">{desa.id}</TableCell>
                    <TableCell>{desa.name}</TableCell>
                    <TableCell>{getKecamatanName(desa.district_id)}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEdit(desa)}>
                            <FilePen className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClick(desa)} className="text-destructive">
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
              <DialogTitle>{selectedDesa ? 'Edit Desa' : 'Tambah Desa'}</DialogTitle>
              <DialogDescription>
                {selectedDesa ? 'Perbarui data desa.' : 'Tambahkan desa baru ke dalam sistem.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="district_id" className="text-right">Kecamatan</Label>
                 <Select
                    value={formData.district_id}
                    onValueChange={(value) => setFormData({ ...formData, district_id: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih Kecamatan" />
                    </SelectTrigger>
                    <SelectContent>
                      {kecamatanList.map((kec) => (
                        <SelectItem key={kec.id} value={kec.id}>
                          {kec.name}
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
                  disabled={!!selectedDesa}
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
              Tindakan ini tidak dapat diurungkan. Ini akan menghapus data desa <strong>{selectedDesa?.name}</strong> secara permanen.
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
