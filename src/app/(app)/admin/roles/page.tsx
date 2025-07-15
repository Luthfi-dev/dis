
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function RolesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kelola Peran & Hak Akses</h1>
          <p className="text-muted-foreground">Atur peran dan izin akses untuk setiap pengguna.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Peran
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Peran</CardTitle>
          <CardDescription>
            Fitur manajemen peran dinamis sedang dalam pengembangan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            <p>Halaman ini akan menampilkan tabel peran dan hak akses.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
