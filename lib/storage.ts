const safeStorage = {
  getItem(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Ignore localStorage errors gracefully.
    }
  },
  removeItem(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore localStorage errors gracefully.
    }
  }
};

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  const value = safeStorage.getItem(key);

  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") {
    return;
  }

  safeStorage.setItem(key, JSON.stringify(value));
}

export function removeStorage(key: string): void {
  if (typeof window === "undefined") {
    return;
  }

  safeStorage.removeItem(key);
}
