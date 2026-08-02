import { useEffect, useState } from 'react';
import type { Guest } from '../../entities/guest/model/types';
import { canPreviewGuestPhoto, getGuestPhotoUrl } from './guestPhoto';

export function useGuestPhoto(guest: Guest) {
    const [failed, setFailed] = useState(false);
    const resolvedUrl = getGuestPhotoUrl(guest);

    useEffect(() => {
        setFailed(false);
    }, [guest.id, guest.photo]);

    const photoUrl = failed ? null : resolvedUrl;

    return {
        photoUrl,
        fullPhotoUrl: photoUrl,
        canPreviewPhoto: canPreviewGuestPhoto(photoUrl),
        handleImageError: () => setFailed(true),
    };
}
