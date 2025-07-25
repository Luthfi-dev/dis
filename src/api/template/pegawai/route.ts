import { NextRequest, NextResponse } from 'next/server';
import Excel from 'exceljs';

const pegawaiHeaders = [
    { header: 'Nama Lengkap (Wajib)', key: 'pegawai_nama', width: 30 },
    { header: 'NIP (Wajib)', key: 'pegawai_nip', width: 25 },
    { header: 'Jenis Kelamin', key: 'pegawai_jenisKelamin', width: 15 },
    { header: 'Tempat Lahir', key: 'pegawai_tempatLahir', width: 20 },
    { header: 'Tanggal Lahir (YYYY-MM-DD)', key: 'pegawai_tanggalLahir', width: 20 },
    { header: 'Jabatan', key: 'pegawai_jabatan', width: 25 },
    { header: 'Status Perkawinan', key: 'pegawai_statusPerkawinan', width: 20 },
    { header: 'NUPTK', key: 'pegawai_nuptk', width: 20 },
    { header: 'NRG', key: 'pegawai_nrg', width: 20 },
    { header: 'Bidang Studi', key: 'pegawai_bidangStudi', width: 20 },
];

const pegawaiDummy = {
    pegawai_nama: 'Dr. Anisa Rahmawati, S.Pd. (Contoh)',
    pegawai_nip: '198501012010122001',
    pegawai_jenisKelamin: 'Perempuan',
    pegawai_tempatLahir: 'Bandung',
    pegawai_tanggalLahir: '1985-01-01',
    pegawai_jabatan: 'Guru Mata Pelajaran',
    pegawai_statusPerkawinan: 'Kawin',
    pegawai_nuptk: '1234567890123456',
    pegawai_nrg: '0987654321',
    pegawai_bidangStudi: 'Bahasa Indonesia',
};


export async function GET(request: NextRequest) {
    try {
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Data Pegawai');

        worksheet.columns = pegawaiHeaders;
        
        // Style header
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF3F51B5' }, // Blue color from theme
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        worksheet.addRow(pegawaiDummy);

        // Write to buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Create response
        const response = new NextResponse(buffer);
        response.headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.headers.set('Content-Disposition', `attachment; filename=template_pegawai.xlsx`);

        return response;

    } catch (error) {
        console.error('Failed to generate Excel template:', error);
        return NextResponse.json({ error: 'Failed to generate template' }, { status: 500 });
    }
}
