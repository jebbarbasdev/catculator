export class StorageState<S extends Storage, T> {
    storage: S
    key: string
    value: T = $state() as T

    constructor(storage: S, key: string, initialValue: T) {
        this.storage = storage
        this.key = key
        this.value = initialValue

        $effect(() => {
            const storedValue = storage.getItem(this.key)
            if (storedValue) {
                this.value = this.deserialize(storedValue)
            }
        })

        $effect(() => {
            storage.setItem(this.key, this.serialize(this.value));
        });
    }

    serialize(value: T): string {
        return JSON.stringify(value);
    }
    
    deserialize(item: string): T {
        return JSON.parse(item);
    }
}

export function localStorageState<T>(key: string, initialValue: T) {
    return new StorageState(localStorage, key, initialValue)
}