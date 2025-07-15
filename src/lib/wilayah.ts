// This is a mock data file to simulate a database of Indonesian regions.
// In a real application, this would be fetched from an API.

type Wilayah = {
    id: string;
    name: string;
}

type Provinsi = Wilayah;
type Kabupaten = Wilayah & { province_id: string };
type Kecamatan = Wilayah & { regency_id: string };
type Desa = Wilayah & { district_id: string };

const provinces: Provinsi[] = [
    { id: '32', name: 'JAWA BARAT' },
];

const kabupatens: Kabupaten[] = [
    { id: '3201', name: 'KABUPATEN BOGOR', province_id: '32' },
    { id: '3202', name: 'KABUPATEN SUKABUMI', province_id: '32' },
    { id: '3273', name: 'KOTA BANDUNG', province_id: '32' },
];

const kecamatans: Kecamatan[] = [
    { id: '327301', name: 'SUKASARI', regency_id: '3273' },
    { id: '327302', name: 'COBLONG', regency_id: '3273' },
    { id: '320113', name: 'CILEUNGSI', regency_id: '3201' },
];

const desas: Desa[] = [
    { id: '3273011001', name: 'GEGERKALONG', district_id: '327301' },
    { id: '3273011002', name: 'SARIJADI', district_id: '327301' },
    { id: '3273021003', name: 'DAGO', district_id: '327302' },
    { id: '3201132001', name: 'CILEUNGSI KIDUL', district_id: '320113' },
];

export const getProvinces = () => provinces;
export const getKabupatens = (provinceId: string) => kabupatens.filter(k => k.province_id === provinceId);
export const getKecamatans = (regencyId: string) => kecamatans.filter(k => k.regency_id === regencyId);
export const getDesas = (districtId: string) => desas.filter(d => d.district_id === districtId);

// Helper functions to get names by ID
export const getProvinceName = (id?: string) => provinces.find(p => p.id === id)?.name || id || '';
export const getKabupatenName = (id?: string) => kabupatens.find(k => k.id === id)?.name || id || '';
export const getKecamatanName = (id?: string) => kecamatans.find(k => k.id === id)?.name || id || '';
export const getDesaName = (id?: string) => desas.find(d => d.id === id)?.name || id || '';
