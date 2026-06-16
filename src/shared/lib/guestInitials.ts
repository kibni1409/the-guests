export function getGuestInitials(fullName: string): string {
    const parts = fullName
        .trim()
        .split(/\s+/)
        .map((part) => part.replace(/[^\p{L}]/gu, ''))
        .filter(Boolean);

    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    const singleName = parts[0] || '?';
    const initials = singleName.slice(0, 2).toUpperCase();

    return initials.length === 2 ? initials : `${initials[0]}${initials[0]}`.toUpperCase();
}
