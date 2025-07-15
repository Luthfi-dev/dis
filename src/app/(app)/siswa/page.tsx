import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Upload, Download, FilePen, Eye, FileSearch } from 'lucide-react';
import { mockSiswaData } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

export default function SiswaPage() {
  const students = mockSiswaData;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daftar Siswa</h1>
          <p className="text-muted-foreground">Kelola data induk siswa di sini.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Template
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Excel
          </Button>
          <Button asChild className="bg-accent hover:bg-accent/90">
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>NISN</TableHead>
                <TableHead>Jenis Kelamin</TableHead>
                <TableHead>Tanggal Lahir</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.namaLengkap}</TableCell>
                  <TableCell>{student.nisn}</TableCell>
                  <TableCell>
                    <Badge variant={student.jenisKelamin === 'Laki-laki' ? 'default' : 'secondary'} className={student.jenisKelamin === 'Perempuan' ? 'bg-pink-100 text-pink-800' : ''}>
                      {student.jenisKelamin}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(student.tanggalLahir).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</TableCell>
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <FilePen className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Lihat</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileSearch className="mr-2 h-4 w-4" />
                          <span>Preview</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
