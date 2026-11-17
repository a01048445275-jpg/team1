import { useCallback, useEffect, useState } from "react";
import { ALL_MENUS, type MenuItem } from "./data";

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
export const useEntries = () => useLocal<Entry[]>("hk-entries", []);

// 기본 즐겨찾기 샘플 아이템 (산까치 철판삼겹구이)
const DEFAULT_FAV_ITEMS: MenuItem[] = ALL_MENUS.length > 0 ? [ALL_MENUS[0]] : [];

/**
 * 즐겨찾기 훅: MenuItem 객체 전체를 저장하여
 * API로 불러온 메뉴든 로컬 메뉴든 상관없이 즐겨찾기 페이지에서 바로 렌더링 가능
 */
export function useFavItems(): [MenuItem[], (item: MenuItem) => void, (key: string) => boolean] {
  const [items, setItems] = useLocal<any[]>("hk-fav-items", DEFAULT_FAV_ITEMS);

  // 과거 버전(단순 key 문자열 배열) 데이터가 있을 경우 MenuItem으로 변환 및 복구
  const normalizedItems: MenuItem[] = (() => {
    if (!Array.isArray(items)) return DEFAULT_FAV_ITEMS;
    return items
      .map((item) => {
        if (typeof item === "string") {
          return ALL_MENUS.find((m) => m.key === item);
        }
        if (item && item.key && item.m && item.r) {
          return item as MenuItem;
        }
        return undefined;
      })
      .filter((x): x is MenuItem => Boolean(x));
  })();

  const isFav = useCallback(
    (key: string) => normalizedItems.some((item) => item.key === key),
    [normalizedItems],
  );

  const toggleFav = useCallback(
    (item: MenuItem) => {
      setItems((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        const exists = list.some((x) => (typeof x === "string" ? x === item.key : x?.key === item.key));
        if (exists) {
          return list.filter((x) => (typeof x === "string" ? x !== item.key : x?.key !== item.key));
        } else {
          return [...list, item];
        }
      });
    },
    [setItems],
  );

  return [normalizedItems, toggleFav, isFav];
}

// 하위 호환용 훅 (key 목록만 필요할 때)
export function useFavs(): [string[], (updater: (prev: string[]) => string[]) => void] {
  const [items] = useFavItems();
  const keys = items.map((i) => i.key);
  const setKeys = useCallback(
    (_updater: (prev: string[]) => string[]) => {
      // Updater 호환용 더미 구현
    },
    [],
  );
  return [keys, setKeys];
}

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
