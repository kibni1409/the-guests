import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const sourceArg = process.argv[2];
const sourcePath = sourceArg
    ? path.resolve(sourceArg)
    : path.join(projectRoot, 'public', 'sample-guests.xlsx');

const outputPath = path.join(projectRoot, 'public', 'sample-guests.xlsx');

if (!fs.existsSync(sourcePath)) {
    console.error(`File not found: ${sourcePath}`);
    process.exit(1);
}

const workbook = XLSX.read(fs.readFileSync(sourcePath), { type: 'buffer' });
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

for (const row of rows) {
    if (typeof row['Фото'] === 'string' && /ui-avatars\.com\/api/i.test(row['Фото'])) {
        row['Фото'] = '';
    }
}

workbook.Sheets[sheetName] = XLSX.utils.json_to_sheet(rows, {
    header: [
        'ID',
        'ФИО',
        'Фото',
        'Категория 1 (основная)',
        'Категория 2 (доп.)',
        'Цвета',
        'Описание короткое',
        'Описание полное',
    ],
});

XLSX.writeFile(workbook, outputPath);

if (path.resolve(sourcePath) !== path.resolve(outputPath)) {
    XLSX.writeFile(workbook, sourcePath);
}

console.log(`Cleaned legacy avatar URLs in ${rows.length} rows.`);
