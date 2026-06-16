import type { Guest } from '../../entities/guest/model/types';
import { isYandexDiskUrl, resolveYandexDiskPhotos } from './yandexDisk';

export { getGuestInitials } from './guestInitials';

export interface ResolvedGuestPhoto {
    displayUrl: string | null;
    fullUrl: string | null;
    isRealPhoto: boolean;
}

function isLegacyExternalAvatar(photo: string): boolean {
    return /ui-avatars\.com\/api/i.test(photo);
}

export async function resolveGuestPhoto(
    guest: Pick<Guest, 'fullName' | 'photo' | 'color'>,
): Promise<ResolvedGuestPhoto> {
    const photo = guest.photo?.trim();

    if (!photo || isLegacyExternalAvatar(photo)) {
        return {
            displayUrl: null,
            fullUrl: null,
            isRealPhoto: false,
        };
    }

    if (isYandexDiskUrl(photo)) {
        try {
            const yandexPhotos = await resolveYandexDiskPhotos(photo);

            return {
                displayUrl: yandexPhotos.displayUrl,
                fullUrl: yandexPhotos.fullUrl,
                isRealPhoto: true,
            };
        } catch (error) {
            console.warn('Failed to resolve Yandex Disk photo:', photo, error);
            return {
                displayUrl: null,
                fullUrl: null,
                isRealPhoto: false,
            };
        }
    }

    return {
        displayUrl: photo,
        fullUrl: photo,
        isRealPhoto: true,
    };
}

export function canPreviewGuestPhoto(
    isRealPhoto: boolean,
    fullPhotoUrl: string | null,
): boolean {
    return isRealPhoto && !!fullPhotoUrl;
}
