export type Category = "한식" | "중식" | "일식" | "양식" | "기타";
export const CATEGORIES: Category[] = ["한식", "중식", "일식", "양식", "기타"];

export type Menu = { name: string; price: number };
export type Restaurant = {
  id: number;
  name: string;
  category: Category;
  district: string;
  address: string;
  lat: number;
  lng: number;
  goodPrice: boolean;
  menus: Menu[];
};

export const DISTRICTS = [
  "전체",
  "강남구", "강동구", "강북구", "강서구", "관악구",
  "광진구", "구로구", "금천구", "노원구", "도봉구",
  "동대문구", "동작구", "마포구", "서대문구", "서초구",
  "성동구", "성북구", "송파구", "양천구", "영등포구",
  "용산구", "은평구", "종로구", "중구", "중랑구",
];
export const BUDGETS = [5000, 6000, 7000, 8000, 9000, 10000, 12000, 15000];

// 예시 데이터: 실제 착한가격업소 현황이 아니라 화면 확인용 샘플입니다.
export const RESTAURANTS: Restaurant[] = [
  { id: 1, name: "산까치", category: "한식", district: "마포구", address: "서울특별시 마포구 도화길 35 (도화동) 1층", lat: 37.5409, lng: 126.9455, goodPrice: true, menus: [{ name: "철판삼겹구이", price: 5500 }, { name: "제육덮밥", price: 6000 }, { name: "순두부찌개", price: 6500 }] },
  { id: 2, name: "올메가덮밥", category: "한식", district: "강남구", address: "서울특별시 강남구 역삼로 130", lat: 37.5001, lng: 127.0364, goodPrice: true, menus: [{ name: "김치볶음밥", price: 6500 }, { name: "참치마요덮밥", price: 7000 }] },
  { id: 3, name: "왕짜장 마천점", category: "중식", district: "송파구", address: "서울특별시 송파구 성내천로 254", lat: 37.4952, lng: 127.1493, goodPrice: true, menus: [{ name: "짜장면", price: 7000 }, { name: "짬뽕", price: 8500 }, { name: "탕수육(소)", price: 14000 }] },
  { id: 4, name: "홍금식당", category: "한식", district: "종로구", address: "서울특별시 종로구 지봉로 77-3", lat: 37.5779, lng: 127.0021, goodPrice: true, menus: [{ name: "된장찌개", price: 8000 }, { name: "김치찌개", price: 8000 }] },
  { id: 5, name: "청춘분식", category: "기타", district: "관악구", address: "서울특별시 관악구 관악로 14길 8", lat: 37.4784, lng: 126.9516, goodPrice: true, menus: [{ name: "떡볶이", price: 4000 }, { name: "김밥", price: 3000 }, { name: "라면", price: 4000 }] },
  { id: 6, name: "하루우동", category: "일식", district: "마포구", address: "서울특별시 마포구 와우산로 29길 12", lat: 37.5547, lng: 126.9236, goodPrice: true, menus: [{ name: "가께우동", price: 5500 }, { name: "돈카츠", price: 9000 }] },
  { id: 7, name: "동네국수", category: "한식", district: "성동구", address: "서울특별시 성동구 왕십리로 21", lat: 37.5614, lng: 127.0376, goodPrice: true, menus: [{ name: "잔치국수", price: 4500 }, { name: "비빔국수", price: 5000 }, { name: "수육", price: 12000 }] },
  { id: 8, name: "맘스키친", category: "양식", district: "강남구", address: "서울특별시 강남구 테헤란로 8길 22", lat: 37.4979, lng: 127.0276, goodPrice: false, menus: [{ name: "오므라이스", price: 8500 }, { name: "함박스테이크", price: 11000 }] },
  { id: 9, name: "중화반점 대박", category: "중식", district: "관악구", address: "서울특별시 관악구 남부순환로 1850", lat: 37.4766, lng: 126.9818, goodPrice: true, menus: [{ name: "짜장면", price: 5500 }, { name: "볶음밥", price: 7000 }] },
  { id: 10, name: "백반의 정석", category: "한식", district: "종로구", address: "서울특별시 종로구 돈화문로 5길 14", lat: 37.5714, lng: 126.9917, goodPrice: true, menus: [{ name: "백반정식", price: 7000 }, { name: "생선구이 백반", price: 9000 }] },
  { id: 11, name: "카츠하우스", category: "일식", district: "송파구", address: "서울특별시 송파구 백제고분로 45길 7", lat: 37.5107, lng: 127.0987, goodPrice: false, menus: [{ name: "치킨카츠덮밥", price: 8500 }, { name: "모둠카츠", price: 13000 }] },
  { id: 12, name: "뚝배기 할매집", category: "한식", district: "성동구", address: "서울특별시 성동구 마조로 15", lat: 37.5636, lng: 127.0287, goodPrice: true, menus: [{ name: "뚝배기불고기", price: 8000 }, { name: "콩나물국밥", price: 6000 }] },
  { id: 13, name: "파스타공방", category: "양식", district: "마포구", address: "서울특별시 마포구 독막로 3길 9", lat: 37.5483, lng: 126.9226, goodPrice: false, menus: [{ name: "토마토파스타", price: 9500 }, { name: "크림파스타", price: 10500 }] },
  { id: 14, name: "행복도시락", category: "기타", district: "강남구", address: "서울특별시 강남구 논현로 85길 3", lat: 37.5115, lng: 127.0211, goodPrice: true, menus: [{ name: "불고기도시락", price: 6000 }, { name: "치킨마요", price: 5000 }] },
  { id: 15, name: "미소초밥", category: "일식", district: "종로구", address: "서울특별시 종로구 대학로 12길 4", lat: 37.5826, lng: 127.0019, goodPrice: false, menus: [{ name: "모둠초밥 10p", price: 12000 }, { name: "연어덮밥", price: 11000 }] },
  { id: 16, name: "국밥한그릇", category: "한식", district: "송파구", address: "서울특별시 송파구 오금로 12", lat: 37.5013, lng: 127.1121, goodPrice: true, menus: [{ name: "돼지국밥", price: 7500 }, { name: "순대국밥", price: 8000 }] },
];

export type MenuItem = { key: string; r: Restaurant; m: Menu };
export const ALL_MENUS: MenuItem[] = RESTAURANTS.flatMap((r) =>
  r.menus.map((m) => ({ key: `${r.id}-${m.name}`, r, m })),
);

export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371, d = Math.PI / 180;
  const dLat = (bLat - aLat) * d, dLng = (bLng - aLng) * d;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * d) * Math.cos(bLat * d) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

export const won = (n: number) => n.toLocaleString("ko-KR") + "원";
