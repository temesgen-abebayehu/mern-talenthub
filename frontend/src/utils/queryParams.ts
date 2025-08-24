// Utility to update query params in the URL
export function setQueryParams(params: Record<string, string | number | undefined>) {
    const url = new URL(window.location.href);
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
            url.searchParams.set(key, String(params[key]));
        } else {
            url.searchParams.delete(key);
        }
    });
    window.history.replaceState({}, '', url.toString());
}

export function getQueryParams(): Record<string, string> {
    const params: Record<string, string> = {};
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.forEach((value, key) => {
        params[key] = value;
    });
    return params;
}
