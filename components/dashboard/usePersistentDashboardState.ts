"use client";

import { useEffect, useState } from "react";

export function usePersistentDashboardState<T>(storageKey: string, initialValue: T, validate: (value: unknown) => value is T) {
  const [value, setValue] = useState(initialValue);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (validate(parsed)) setValue(parsed);
      }
    } catch { setStorageError(true); }
    finally { setReady(true); }
  }, [storageKey, initialValue, validate]);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(storageKey, JSON.stringify(value)); }
    catch { setStorageError(true); }
  }, [storageKey, value, ready]);

  return { value, setValue, ready, storageError };
}
