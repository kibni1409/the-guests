import { useEffect, useState } from 'react';
import type { Guest } from '../../entities/guest/model/types';
import { canPreviewGuestPhoto, resolveGuestPhoto } from './guestPhoto';

export function useGuestPhoto(guest: Guest) {
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [fullPhotoUrl, setFullPhotoUrl] = useState<string | null>(null);
    const [isRealPhoto, setIsRealPhoto] = useState(false);

    useEffect(() => {
        let cancelled = false;

        setPhotoUrl(null);
        setFullPhotoUrl(null);
        setIsRealPhoto(false);

        resolveGuestPhoto(guest)
            .then((resolved) => {
                if (!cancelled) {
                    setPhotoUrl(resolved.displayUrl);
                    setFullPhotoUrl(resolved.fullUrl);
                    setIsRealPhoto(resolved.isRealPhoto);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setPhotoUrl(null);
                    setFullPhotoUrl(null);
                    setIsRealPhoto(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [guest.id, guest.photo, guest.fullName, guest.color]);

    const handleImageError = () => {
        setPhotoUrl(null);
        setFullPhotoUrl(null);
        setIsRealPhoto(false);
    };

    return {
        photoUrl,
        fullPhotoUrl,
        canPreviewPhoto: canPreviewGuestPhoto(isRealPhoto, fullPhotoUrl),
        handleImageError,
    };
}
