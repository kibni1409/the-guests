import type { Guest } from '../../entities/guest/model/types';

export { getGuestInitials } from './guestInitials';

export function getGuestPhotoUrl(guest: Pick<Guest, 'photo'>): string | null {
    const photo = guest.photo?.trim();
    return photo || null;
}

export function canPreviewGuestPhoto(photoUrl: string | null): boolean {
    return Boolean(photoUrl);
}
