
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
import type { Kabupaten, Provinsi } from '@/lib/wilayah';
import { getKabupatens, saveKabupatens, getProvinces, getProvinceName } from '@/lib/wilayah';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const STORAGE_KEY = 'kabupatenData';

type FormData = {
  id: string;
  name: string;
  province_id: string;
}

export default function KabupatenPage() {
  const [kabupatenList, setKabupatenList] = useState<Kabupaten[]>([]);
  const [provinsiList, setProvinsiList] = useState<Provinsi[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedKabupaten, setSelectedKabupaten] = useState<Kabupaten | null>(null);
  const [formData, setFormData] = useState<FormData>({ id: '', name: '', province_id: '' });
  const { toast } = useToast();

  useEffect(() => {
    setKabupatenList(getKabupatens());
    setProvinsiList(getProvinces());
  }, []);

  const saveData = (data: Kabupaten[]) => {
    saveKabupatens(data);
    setKabupatenList(data);
  };

  const handleAdd = () => {
    setSelectedKabupaten(null);
    setFormData({ id: '', name: '', province_id: '' });
    setIsFormOpen(true);
  };

  const handleEdit = (kabupaten: Kabupaten) => {
    setSelectedKabupaten(kabupaten);
    setFormData({ id: kabupaten.id, name: kabupaten.name, province_id: kabupaten.province_id });
    setIsFormOpen(true);
  };

  const handleDeleteClick = (kabupaten: Kabupaten) => {
    setSelectedKabupaten(kabupaten);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedKabupaten) return;
    const updatedList = kabupatenList.filter(p => p.id !== selectedKabupaten.id);
    saveData(updatedList);
    toast({ title: "Sukses!", description: "Data kabupaten berhasil dihapus." });
    setIsAlertOpen(false);
    setSelectedKabupaten(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.name || !formData.province_id) {
      toast({ title: "Error!", description: "ID, Nama, dan Provinsi wajib diisi.", variant: "destructive" });
      return;
    }

    if (selectedKabupaten) { // Editing
      const updatedList = kabupatenList.map(p => p.id === selectedKabupaten.id ? { ...p, ...formData } : p);
      saveData(updatedList);
      toast({ title: "Sukses!", description: "Data kabupaten berhasil diperbarui." });
    } else { // Adding
      if (kabupatenList.some(p => p.id === formData.id)) {
        toast({ title: "Error!", description: "ID Kabupaten sudah ada.", variant: "destructive" });
        return;
      }
      saveData([...kabupatenList, { id: formData.id, name: formData.name, province_id: formData.province_id }]);
      toast({ title: "Sukses!", description: "Data kabupaten berhasil ditambahkan." });
    }
    setIsFormOpen(false);
    setSelectedKabupaten(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Master Kabupaten</h1>
          <p className="text-muted-foreground">Kelola data kabupaten di sini.</p>
        </div>
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Kabupaten
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Kabupaten</CardTitle>
          <CardDescription>Total {kabupatenList.length} kabupaten ditemukan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nama Kabupaten</TableHead>
                <TableHead>Provinsi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kabupatenList.length > 0 ? (
                kabupatenList.map((kabupaten) => (
                  <TableRow key={kabupaten.id}>
                    <TableCell className="font-medium">{kabupaten.id}</TableCell>
                    <TableCell>{kabupaten.name}</TableCell>
                    <TableCell>{getProvinceName(kabupaten.province_id)}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEdit(kabupaten)}>
                            <FilePen className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClick(kabupaten)} className="text-destructive">
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
              <DialogTitle>{selectedKabupaten ? 'Edit Kabupaten' : 'Tambah Kabupaten'}</DialogTitle>
              <DialogDescription>
                {selectedKabupaten ? 'Perbarui data kabupaten.' : 'Tambahkan kabupaten baru ke dalam sistem.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="province_id" className="text-right">Provinsi</Label>
                 <Select
                    value={formData.province_id}
                    onValueChange={(value) => setFormData({ ...formData, province_id: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih Provinsi" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinsiList.map((prov) => (
                        <SelectItem key={prov.id} value={prov.id}>
                          {prov.name}
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
                  disabled={!!selectedKabupaten}
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
              Tindakan ini tidak dapat diurungkan. Ini akan menghapus data kabupaten <strong>{selectedKabupaten?.name}</strong> secara permanen.
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
