// This is a mock data file to simulate a database of Indonesian regions.
// In a real application, this would be fetched from an API or a database.

export type Wilayah = {
    id: string;
    name: string;
}

export type Provinsi = Wilayah;
export type Kabupaten = Wilayah & { province_id: string };
export type Kecamatan = Wilayah & { regency_id: string };
export type Desa = Wilayah & { district_id: string };

const defaultProvinces: Provinsi[] = [
    { id: '32', name: 'JAWA BARAT' },
    { id: '33', name: 'JAWA TENGAH' },
    { id: '35', name: 'JAWA TIMUR' },
];

const defaultKabupatens: Kabupaten[] = [
    { id: '3273', name: 'KOTA BANDUNG', province_id: '32' },
    { id: '3201', name: 'KABUPATEN BOGOR', province_id: '32' },
    { id: '3374', name: 'KOTA SEMARANG', province_id: '33' },
    { id: '3578', name: 'KOTA SURABAYA', province_id: '35' },
];

const defaultKecamatans: Kecamatan[] = [
    { id: '327301', name: 'SUKASARI', regency_id: '3273' },
    { id: '327302', name: 'COBLONG', regency_id: '3273' },
    { id: '320113', name: 'CILEUNGSI', regency_id: '3201' },
];

const defaultDesas: Desa[] = [
    { id: '3273011001', name: 'GEGERKALONG', district_id: '327301' },
    { id: '3273011002', name: 'SARIJADI', district_id: '327301' },
    { id: '3273021003', name: 'DAGO', district_id: '327302' },
    { id: '3201132001', name: 'CILEUNGSI KIDUL', district_id: '320113' },
];


// --- Helper functions to interact with localStorage ---

const getFromStorage = <T>(key: string, defaultValue: T[]): T[] => {
    if (typeof window === 'undefined') {
        return defaultValue;
    }
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

// Initialize with default data if localStorage is empty
if (typeof window !== 'undefined' && !localStorage.getItem('provinsiData')) {
    localStorage.setItem('provinsiData', JSON.stringify(defaultProvinces));
}
if (typeof window !== 'undefined' && !localStorage.getItem('kabupatenData')) {
    localStorage.setItem('kabupatenData', JSON.stringify(defaultKabupatens));
}
if (typeof window !== 'undefined' && !localStorage.getItem('kecamatanData')) {
    localStorage.setItem('kecamatanData', JSON.stringify(defaultKecamatans));
}
if (typeof window !== 'undefined' && !localStorage.getItem('desaData')) {
    localStorage.setItem('desaData', JSON.stringify(defaultDesas));
}

export const getProvinces = (): Provinsi[] => getFromStorage<Provinsi>('provinsiData', defaultProvinces);
export const getKabupatens = (provinceId: string): Kabupaten[] => getFromStorage<Kabupaten>('kabupatenData', defaultKabupatens).filter(k => k.province_id === provinceId);
export const getKecamatans = (regencyId: string): Kecamatan[] => getFromStorage<Kecamatan>('kecamatanData', defaultKecamatans).filter(k => k.regency_id === regencyId);
export const getDesas = (districtId: string): Desa[] => getFromStorage<Desa>('desaData', defaultDesas).filter(d => d.district_id === districtId);

// Helper functions to get names by ID
export const getProvinceName = (id?: string) => getProvinces().find(p => p.id === id)?.name || id || '';
export const getKabupatenName = (id?: string) => getFromStorage<Kabupaten>('kabupatenData', []).find(k => k.id === id)?.name || id || '';
export const getKecamatanName = (id?: string) => getFromStorage<Kecamatan>('kecamatanData', []).find(k => k.id === id)?.name || id || '';
export const getDesaName = (id?: string) => getFromStorage<Desa>('desaData', []).find(d => d.id === id)?.name || id || '';
