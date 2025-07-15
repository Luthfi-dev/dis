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
        // If the item doesn't exist, set it with the default value
        if (item === null) {
            window.localStorage.setItem(key, JSON.stringify(defaultValue));
            return defaultValue;
        }
        return JSON.parse(item);
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

const saveToStorage = <T>(key: string, data: T[]): void => {
     if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
}

// Ensure default data is set if not present
getFromStorage<Provinsi>('provinsiData', defaultProvinces);
getFromStorage<Kabupaten>('kabupatenData', defaultKabupatens);
getFromStorage<Kecamatan>('kecamatanData', defaultKecamatans);
getFromStorage<Desa>('desaData', defaultDesas);


// --- Getter functions ---
export const getProvinces = (): Provinsi[] => getFromStorage<Provinsi>('provinsiData', []);
export const getKabupatens = (provinceId?: string): Kabupaten[] => {
    const all = getFromStorage<Kabupaten>('kabupatenData', []);
    if (!provinceId) return all;
    return all.filter(k => k.province_id === provinceId);
};
export const getKecamatans = (regencyId?: string): Kecamatan[] => {
    const all = getFromStorage<Kecamatan>('kecamatanData', []);
    if (!regencyId) return all;
    return all.filter(k => k.regency_id === regencyId);
};
export const getDesas = (districtId?: string): Desa[] => {
    const all = getFromStorage<Desa>('desaData', []);
    if (!districtId) return all;
    return all.filter(d => d.district_id === districtId);
};

// --- Setter functions ---
export const saveProvinces = (data: Provinsi[]) => saveToStorage('provinsiData', data);
export const saveKabupatens = (data: Kabupaten[]) => saveToStorage('kabupatenData', data);
export const saveKecamatans = (data: Kecamatan[]) => saveToStorage('kecamatanData', data);
export const saveDesas = (data: Desa[]) => saveToStorage('desaData', data);


// --- Helper functions to get names by ID ---
export const getProvinceName = (id?: string) => getProvinces().find(p => p.id === id)?.name || id || '';
export const getKabupatenName = (id?: string) => getKabupatens().find(k => k.id === id)?.name || id || '';
export const getKecamatanName = (id?: string) => getKecamatans().find(k => k.id === id)?.name || id || '';
export const getDesaName = (id?: string) => getDesas().find(d => d.id === id)?.name || id || '';
