const YANDEX_DISK_HOSTS = new Set(['disk.yandex.ru', 'yadi.sk']);

export interface YandexPhotoUrls {
    displayUrl: string;
    fullUrl: string;
}

const resolvedUrlCache = new Map<string, YandexPhotoUrls>();

interface YandexSize {
    url: string;
    name: string;
}

interface YandexResource {
    sizes?: YandexSize[];
}

function buildYandexApiUrl(path: string, params: Record<string, string>): string {
    const search = new URLSearchParams(params);

    return `https://cloud-api.yandex.net${path}?${search.toString()}`;
}

export function isYandexDiskUrl(url: string): boolean {
    try {
        const parsed = new URL(url.trim());
        const isKnownHost = YANDEX_DISK_HOSTS.has(parsed.hostname);
        const isPublicPath = /^\/(i|d)\//.test(parsed.pathname);

        return isKnownHost && isPublicPath;
    } catch {
        return false;
    }
}

function pickOriginalUrl(resource: YandexResource): string | null {
    const original = resource.sizes?.find((size) => size.name === 'ORIGINAL');

    return original?.url ?? null;
}

async function fetchYandexResource(publicUrl: string): Promise<YandexResource | null> {
    const response = await fetch(
        buildYandexApiUrl('/v1/disk/public/resources', {
            public_key: publicUrl,
        }),
    );

    if (!response.ok) {
        return null;
    }

    return (await response.json()) as YandexResource;
}

export async function resolveYandexDiskPhotos(publicUrl: string): Promise<YandexPhotoUrls> {
    const normalizedUrl = publicUrl.trim();

    if (resolvedUrlCache.has(normalizedUrl)) {
        return resolvedUrlCache.get(normalizedUrl)!;
    }

    const resource = await fetchYandexResource(normalizedUrl);
    const originalUrl = resource ? pickOriginalUrl(resource) : null;

    if (originalUrl) {
        const urls = {
            displayUrl: originalUrl,
            fullUrl: originalUrl,
        };

        resolvedUrlCache.set(normalizedUrl, urls);

        return urls;
    }

    const downloadResponse = await fetch(
        buildYandexApiUrl('/v1/disk/public/resources/download', {
            public_key: normalizedUrl,
        }),
    );

    if (!downloadResponse.ok) {
        throw new Error(`Yandex Disk API error: ${downloadResponse.status}`);
    }

    const downloadData = (await downloadResponse.json()) as { href?: string };

    if (!downloadData.href) {
        throw new Error('Yandex Disk API did not return ORIGINAL photo link');
    }

    const fallbackUrls = {
        displayUrl: downloadData.href,
        fullUrl: downloadData.href,
    };

    resolvedUrlCache.set(normalizedUrl, fallbackUrls);

    return fallbackUrls;
}
