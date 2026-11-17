/**
 * 행정안전부 착한가격업소 현황 API (공공데이터포털 / odcloud.kr)
 * endpoint: https://api.odcloud.kr/api/3045247/v1/uddi:0d236000-b33f-41ad-9227-ee0efa3ec6c8
 */

const API_KEY = import.meta.env.VITE_GOOD_PRICE_API_KEY as string;
const BASE_URL =
  "https://api.odcloud.kr/api/3045247/v1/uddi:0d236000-b33f-41ad-9227-ee0efa3ec6c8";

/** 공공데이터 API 원본 레코드 */
export interface RawRecord {
  업소명: string;
  업종: string;
  시도: string;
  시군: string;
  주소: string;
  메뉴1: string | null;
  가격1: number | null;
  메뉴2: string | null;
  가격2: number | null;
  메뉴3: string | null;
  가격3: number | null;
  메뉴4: string | null;
  가격4: number | null;
}

export interface ApiResponse {
  currentCount: number;
  matchCount: number;
  page: number;
  perPage: number;
  totalCount: number;
  data: RawRecord[];
}

/** 앱 내부에서 쓰는 착한가격업소 타입 */
export interface GoodPriceRestaurant {
  id: string; // `${시도}-${시군}-${업소명}` 해시
  name: string;
  category: string;
  district: string; // 시군
  sido: string;
  address: string;
  goodPrice: true;
  menus: { name: string; price: number }[];
}

/** 음식 관련 업종만 추출 */
const FOOD_CATEGORIES = new Set([
  "한식",
  "중식",
  "일식",
  "양식",
  "분식",
  "패스트푸드",
  "치킨",
  "피자",
  "도시락",
  "면류",
  "기타음식점",
  "뷔페",
]);

/** API 카테고리 → 앱 카테고리 매핑 */
function mapCategory(업종: string): string {
  if (업종 === "한식") return "한식";
  if (업종 === "중식") return "중식";
  if (업종 === "일식") return "일식";
  if (업종 === "양식") return "양식";
  if (업종 === "분식") return "기타";
  return "기타";
}

function rawToRestaurant(r: RawRecord, idx: number): GoodPriceRestaurant {
  const menus: { name: string; price: number }[] = [];
  for (let i = 1; i <= 4; i++) {
    const name = r[`메뉴${i}` as keyof RawRecord] as string | null;
    const price = r[`가격${i}` as keyof RawRecord] as number | null;
    if (name && price && price > 0) menus.push({ name: name.trim(), price });
  }
  return {
    id: `api-${idx}`,
    name: r.업소명,
    category: mapCategory(r.업종),
    district: r.시군,
    sido: r.시도,
    address: r.주소,
    goodPrice: true,
    menus,
  };
}

export interface FetchOptions {
  /** 조회 페이지 (1부터) */
  page?: number;
  /** 페이지당 건수 (최대 1000) */
  perPage?: number;
  /** 시도 필터 (예: "서울특별시") */
  sido?: string;
  /** 시군 필터 (예: "마포구") */
  district?: string;
  /** 업종 필터 (예: "한식") — 단일값 */
  category?: string;
}

/** 착한가격업소 목록 조회 */
export async function fetchGoodPriceRestaurants(
  opts: FetchOptions = {},
): Promise<{ items: GoodPriceRestaurant[]; totalCount: number }> {
  const params = new URLSearchParams({
    page: String(opts.page ?? 1),
    perPage: String(opts.perPage ?? 100),
    serviceKey: API_KEY,
  });

  if (opts.sido) params.append("cond[시도::EQ]", opts.sido);
  if (opts.district) params.append("cond[시군::EQ]", opts.district);
  if (opts.category) {
    // 앱 카테고리 → API 업종 역변환
    const apiCategory = reverseMapCategory(opts.category);
    if (apiCategory) params.append("cond[업종::EQ]", apiCategory);
  }

  const url = `${BASE_URL}?${params.toString()}`;
  const res = await fetch(url, {
    headers: { Authorization: `Infuser ${API_KEY}` },
  });

  if (!res.ok) {
    throw new Error(`API 오류: ${res.status} ${res.statusText}`);
  }

  const json: ApiResponse = await res.json();

  // 음식 관련 업종만 필터링 (이미용·세탁 등 제외)
  const foodRecords = json.data.filter((r) =>
    r.업종 === "한식" ||
    r.업종 === "중식" ||
    r.업종 === "일식" ||
    r.업종 === "양식" ||
    r.업종 === "분식" ||
    r.업종 === "기타음식점" ||
    r.업종 === "면류" ||
    FOOD_CATEGORIES.has(r.업종)
  );

  const baseIdx = ((opts.page ?? 1) - 1) * (opts.perPage ?? 100);
  const items = foodRecords
    .filter((r) => r.메뉴1 && r.가격1) // 메뉴 없는 항목 제외
    .map((r, i) => rawToRestaurant(r, baseIdx + i));

  return { items, totalCount: json.totalCount };
}

function reverseMapCategory(cat: string): string | null {
  const map: Record<string, string> = {
    한식: "한식",
    중식: "중식",
    일식: "일식",
    양식: "양식",
    기타: "기타음식점",
  };
  return map[cat] ?? null;
}
