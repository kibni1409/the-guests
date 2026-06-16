import * as XLSX from 'xlsx';
import type { Guest } from '../../entities/guest/model/types';

type ExcelRow = Record<string, unknown>;

const COLUMN_ALIASES: Record<keyof Omit<Guest, 'id'>, string[]> = {
    fullName: ['ФИО', 'Имя', 'Name', 'Гость'],
    photo: ['Фото', 'Photo', 'URL фото', 'Ссылка на фото', 'Аватар'],
    category1: ['Категория 1 (основная)', 'Категория 1', 'Категория', 'Category'],
    category2: ['Категория 2 (доп.)', 'Категория 2', 'Подкатегория', 'Category 2'],
    color: ['Цвета', 'Цвет', 'Color'],
    shortDescription: ['Описание короткое', 'Краткое описание', 'Short description'],
    fullDescription: ['Описание полное', 'Полное описание', 'Full description'],
    specialNotes: ['Особые отметки', 'Заметки', 'Notes'],
};

function pickValue(row: ExcelRow, aliases: string[]): string {
    for (const alias of aliases) {
        const value = row[alias];
        if (value !== undefined && value !== null && String(value).trim() !== '') {
            return String(value).trim();
        }
    }

    return '';
}

function normalizeColor(color: string): string {
    const trimmed = color.trim();
    if (!trimmed) {
        return '#667eea';
    }

    return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
}

function parseId(row: ExcelRow, index: number): number {
    const rawId = row.ID ?? row.id ?? row.Id;
    const parsed = Number(rawId);

    return Number.isFinite(parsed) && parsed > 0 ? parsed : index + 1;
}

function getPhotoValue(worksheet: XLSX.WorkSheet, rowNumber: number, row: ExcelRow): string {
    const cell = worksheet[`C${rowNumber}`] as { l?: { Target?: string } } | undefined;
    const hyperlinkTarget = cell?.l?.Target;

    if (typeof hyperlinkTarget === 'string' && hyperlinkTarget.trim()) {
        return hyperlinkTarget.trim();
    }

    return pickValue(row, COLUMN_ALIASES.photo);
}

function assignColorsByCategory1(guests: Guest[]): Guest[] {
    const categoryColorMap = new Map<string, string>();

    for (const guest of guests) {
        if (guest.category1 && !categoryColorMap.has(guest.category1)) {
            categoryColorMap.set(guest.category1, guest.color);
        }
    }

    return guests.map((guest) => ({
        ...guest,
        color: categoryColorMap.get(guest.category1) ?? guest.color,
    }));
}

export const parseExcelToGuests = (file: File): Promise<Guest[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json<ExcelRow>(worksheet, { defval: '' });

                const guests: Guest[] = assignColorsByCategory1(
                    json
                        .map((row, index) => ({
                            id: parseId(row, index),
                            fullName: pickValue(row, COLUMN_ALIASES.fullName),
                            photo: getPhotoValue(worksheet, index + 2, row),
                            category1: pickValue(row, COLUMN_ALIASES.category1),
                            category2: pickValue(row, COLUMN_ALIASES.category2),
                            color: normalizeColor(pickValue(row, COLUMN_ALIASES.color)),
                            shortDescription: pickValue(row, COLUMN_ALIASES.shortDescription),
                            fullDescription: pickValue(row, COLUMN_ALIASES.fullDescription),
                            specialNotes: pickValue(row, COLUMN_ALIASES.specialNotes) || undefined,
                        }))
                        .filter((guest) => guest.fullName),
                );

                resolve(guests);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error('Ошибка чтения файла'));
        reader.readAsBinaryString(file);
    });
};
