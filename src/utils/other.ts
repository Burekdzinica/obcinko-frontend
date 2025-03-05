// Remove whitespaces, cases and šumniks
export function normalizeText(text: string) {
    // Remove whitespaces
    text = text.trim();

    // Remove whitespace between "-"
    text = text.replace(/\s+-\s+/g, '-');

    // Case & šumnik insensitive
    text = text.toLowerCase().replace(/[čšž]/g, match => ({ č: 'c', š: 's', ž: 'z' })[match] ?? match);

    return text;
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : defaultValue;
}