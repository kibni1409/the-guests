import type { Guest } from '../../entities/guest/model/types';

const STORAGE_KEY = 'the-guests:data';

function isGuest(value: unknown): value is Guest {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const guest = value as Guest;

    return (
        typeof guest.id === 'number' &&
        typeof guest.fullName === 'string' &&
        typeof guest.photo === 'string' &&
        typeof guest.category1 === 'string' &&
        typeof guest.category2 === 'string' &&
        typeof guest.color === 'string' &&
        typeof guest.shortDescription === 'string' &&
        typeof guest.fullDescription === 'string'
    );
}

export function loadGuestsFromStorage(): Guest[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return [];
        }

        const parsed: unknown = JSON.parse(raw);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter(isGuest);
    } catch {
        return [];
    }
}

export function saveGuestsToStorage(guests: Guest[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
    } catch (error) {
        console.warn('Failed to save guests to localStorage:', error);
    }
}

export function clearGuestsStorage(): void {
    localStorage.removeItem(STORAGE_KEY);
}
