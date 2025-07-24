
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useTransition, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { getAppSettings, saveAppSettings } from '@/lib/actions';
import type { AppSettings } from '@/lib/actions';

const settingsSchema = z.object({
    app_title: z.string().min(1, 'Judul aplikasi wajib diisi.'),
    app_description: z.string().min(1, 'Deskripsi aplikasi wajib diisi.'),
    app_logo_url: z.string().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

async function uploadFile(file: File, directory: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('directory', directory);
    const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        throw new Error('Upload failed');
    }
    const { url } = await response.json();
    return url;
}

export default function AdminSettingsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const [isUploading, setIsUploading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<SettingsFormData>({
        resolver: zodResolver(settingsSchema),
    });
    
    const logoUrl = watch('app_logo_url');

    useEffect(() => {
        if (!authLoading) {
            if (user?.role !== 'superadmin') {
                router.replace('/dashboard');
            } else {
                 const fetchSettings = async () => {
                    const settings = await getAppSettings();
                    reset(settings);
                    setInitialLoading(false);
                 }
                 fetchSettings();
            }
        }
    }, [user, authLoading, router, reset]);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await uploadFile(file, 'app');
            setValue('app_logo_url', url, { shouldDirty: true });
            toast({ title: 'Sukses!', description: 'Logo aplikasi berhasil diunggah.' });
        } catch (error) {
            toast({ title: 'Gagal', description: 'Gagal mengunggah logo.', variant: 'destructive' });
        } finally {
            setIsUploading(false);
        }
    }

    const onSubmit = (data: SettingsFormData) => {
        startTransition(async () => {
            const result = await saveAppSettings(data);
            if (result.success) {
                toast({
                    title: 'Sukses!',
                    description: 'Pengaturan aplikasi berhasil diperbarui.',
                });
            } else {
                toast({
                    title: 'Gagal',
                    description: result.message || 'Terjadi kesalahan saat menyimpan.',
                    variant: 'destructive',
                });
            }
        });
    };
    
    if (authLoading || initialLoading) {
        return (
             <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (user?.role !== 'superadmin') {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>Anda tidak memiliki akses ke halaman ini.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Pengaturan Aplikasi</h1>
                <p className="text-muted-foreground">Kelola pengaturan umum aplikasi Anda di sini.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Umum</CardTitle>
                        <CardDescription>Ubah detail dasar aplikasi Anda.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label>Logo Aplikasi</Label>
                             <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center border relative">
                                    {logoUrl ? (
                                        <Image src={logoUrl} alt="Logo Aplikasi" layout="fill" objectFit="contain" />
                                    ) : (
                                        <ImageIcon className="w-10 h-10 text-muted-foreground" />
                                    )}
                                </div>
                                <Button asChild size="sm" variant="outline">
                                    <label htmlFor="logo-upload" className="cursor-pointer">
                                        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                                        Unggah Logo
                                        <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={isUploading} />
                                    </label>
                                </Button>
                            </div>
                         </div>
                        <div className="space-y-2">
                            <Label htmlFor="app_title">Judul Aplikasi</Label>
                            <Input id="app_title" {...register('app_title')} />
                            {errors.app_title && <p className="text-sm text-destructive">{errors.app_title.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="app_description">Deskripsi Aplikasi</Label>
                            <Textarea id="app_description" {...register('app_description')} />
                            {errors.app_description && <p className="text-sm text-destructive">{errors.app_description.message}</p>}
                        </div>
                         <input type="hidden" {...register('app_logo_url')} />
                    </CardContent>
                    <CardFooter className='border-t px-6 py-4'>
                        <Button type="submit" disabled={isPending || isUploading}>
                            {(isPending || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan Pengaturan
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
