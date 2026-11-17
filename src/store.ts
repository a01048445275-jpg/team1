import { useCallback, useEffect, useState } from "react";

export function useLocal<T>(key: string, init: T): [T, (v: T | ((p: T) => T)) => void] {
  const read = () => {
    try {
      const s = localStorage.getItem(key);
      return s ? (JSON.parse(s) as T) : init;
    } catch {
      return init;
    }
  };
  const [val, setVal] = useState<T>(read);
  useEffect(() => {
    const on = () => setVal(read());
    window.addEventListener("hk-store:" + key, on);
    return () => window.removeEventListener("hk-store:" + key, on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const set = useCallback(
    (v: T | ((p: T) => T)) => {
      const cur = (() => {
        try {
          const s = localStorage.getItem(key);
          return s ? (JSON.parse(s) as T) : init;
        } catch {
          return init;
        }
      })();
      const next = typeof v === "function" ? (v as (p: T) => T)(cur) : v;
      localStorage.setItem(key, JSON.stringify(next));
      window.dispatchEvent(new Event("hk-store:" + key));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );
  return [val, set];
}

export type Entry = { id: string; date: string; place: string; menu: string; amount: number };

export const useBudget = () => useLocal<number>("hk-budget", 8000);
export const useFavs = () => useLocal<string[]>("hk-favs", ["1-철판삼겹구이"]);
export const useEntries = () => useLocal<Entry[]>("hk-entries", []);

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
