import { useCallback, useEffect, useRef, useState } from "react";
import { fetchGoodPriceRestaurants, type GoodPriceRestaurant } from "./api";
import { type Category } from "../data";

export type ApiStatus = "idle" | "loading" | "success" | "error";

export interface UseApiDataOptions {
  district?: string;         // "전체" or "마포구" etc.
  category?: Category | ""; // "" = 전체
  budget?: number;
  enabled?: boolean;
}

export function useApiData(opts: UseApiDataOptions) {
  const [items, setItems] = useState<GoodPriceRestaurant[]>([]);
  const [status, setStatus] = useState<ApiStatus>("idle");
  const [error, setError] = useState<string>("");
  const [totalCount, setTotalCount] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    if (opts.enabled === false) return;
    if (!import.meta.env.VITE_GOOD_PRICE_API_KEY) {
      setStatus("error");
      setError("API 키가 설정되지 않았습니다.");
      return;
    }

    // 이전 요청 취소
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setStatus("loading");
    setError("");

    try {
      // 전체 데이터를 여러 페이지로 로드 (최대 300건)
      const perPage = 100;
      const pages = [1, 2, 3];
      const results = await Promise.all(
        pages.map((page) =>
          fetchGoodPriceRestaurants({
            page,
            perPage,
            sido: "서울특별시",
            district: opts.district && opts.district !== "전체" ? opts.district : undefined,
            category: opts.category || undefined,
          }),
        ),
      );

      if (abortRef.current.signal.aborted) return;

      const all = results.flatMap((r) => r.items);
      // 중복 제거 (이름+주소 기준)
      const seen = new Set<string>();
      const unique = all.filter((r) => {
        const key = `${r.name}|${r.address}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      setItems(unique);
      setTotalCount(results[0]?.totalCount ?? 0);
      setStatus("success");
    } catch (e) {
      if (abortRef.current?.signal.aborted) return;
      setStatus("error");
      setError(e instanceof Error ? e.message : "API 호출 실패");
    }
  }, [opts.district, opts.category, opts.enabled]);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  return { items, status, error, totalCount, reload: load };
}
