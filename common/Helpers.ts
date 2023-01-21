/**
 * Takes a defaults object and a partial object and returns an object that has
 * the properties missing in the partial filled with values coming from the defaults.
 */
export function createFromDefaults<T>(defaults: T, partial: Partial<T>): T {
    return Object.assign({}, defaults, partial);
}

/**
 * Creates a function that takes a partial object of type T and fills in missing
 * properties with the ones provided in the `defaults` parameter.
 */
export function createFactory<T>(defaults: T): (partial: Partial<T>) => T {
    return partial => createFromDefaults<T>(defaults, partial);
}

export function getUserInfoPageLink(userId: string): string {
    return `/users/${userId}`;
}

export function getUsersPageLink(): string {
    return `/users`;
}