
'use server'
import pool from './db';

export type Wilayah = {
    id: string;
    name: string;
}

export type Provinsi = Wilayah;
export type Kabupaten = Wilayah & { province_id: string };
export type Kecamatan = Wilayah & { regency_id: string };
export type Desa = Wilayah & { district_id: string };


// --- Getter functions from DB ---
export async function getProvinces(): Promise<Provinsi[]> {
    const [rows] = await pool.query('SELECT id, name FROM provinsi ORDER BY name');
    return rows as Provinsi[];
};

export async function getKabupatens(provinceId?: string): Promise<Kabupaten[]> {
    if (!provinceId) return [];
    const [rows] = await pool.query('SELECT id, name, province_id FROM kabupaten WHERE province_id = ? ORDER BY name', [provinceId]);
    return rows as Kabupaten[];
};

export async function getKecamatans(regencyId?: string): Promise<Kecamatan[]> {
    if (!regencyId) return [];
    const [rows] = await pool.query('SELECT id, name, regency_id FROM kecamatan WHERE regency_id = ? ORDER BY name', [regencyId]);
    return rows as Kecamatan[];
};

export async function getDesas(districtId?: string): Promise<Desa[]> {
    if (!districtId) return [];
    const [rows] = await pool.query('SELECT id, name, district_id FROM desa WHERE district_id = ? ORDER BY name', [districtId]);
    return rows as Desa[];
};


// --- Helper functions to get names by ID ---
export async function getProvinceName(id?: string): Promise<string> {
    if (!id) return '';
    const [rows]: any[] = await pool.query('SELECT name FROM provinsi WHERE id = ?', [id]);
    return rows[0]?.name || id;
}

export async function getKabupatenName(id?: string): Promise<string> {
    if (!id) return '';
    const [rows]: any[] = await pool.query('SELECT name FROM kabupaten WHERE id = ?', [id]);
    return rows[0]?.name || id;
}

export async function getKecamatanName(id?: string): Promise<string> {
    if (!id) return '';
    const [rows]: any[] = await pool.query('SELECT name FROM kecamatan WHERE id = ?', [id]);
    return rows[0]?.name || id;
}

export async function getDesaName(id?: string): Promise<string> {
    if (!id) return '';
    const [rows]: any[] = await pool.query('SELECT name FROM desa WHERE id = ?', [id]);
    return rows[0]?.name || id;
}
