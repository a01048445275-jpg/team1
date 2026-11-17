/**
 * 서울특별시 25개 자치구 중심 위경도 좌표
 */
export const DISTRICT_COORDS: Record<string, { lat: number; lng: number }> = {
  강남구: { lat: 37.5172, lng: 127.0473 },
  강동구: { lat: 37.5301, lng: 127.1238 },
  강북구: { lat: 37.6396, lng: 127.0255 },
  강서구: { lat: 37.5509, lng: 126.8495 },
  관악구: { lat: 37.4784, lng: 126.9516 },
  광진구: { lat: 37.5385, lng: 127.0823 },
  구로구: { lat: 37.4954, lng: 126.8874 },
  금천구: { lat: 37.4568, lng: 126.8954 },
  노원구: { lat: 37.6542, lng: 127.0568 },
  도봉구: { lat: 37.6688, lng: 127.0471 },
  동대문구: { lat: 37.5744, lng: 127.0396 },
  동작구: { lat: 37.5124, lng: 126.9393 },
  마포구: { lat: 37.5663, lng: 126.9016 },
  서대문구: { lat: 37.5791, lng: 126.9368 },
  서초구: { lat: 37.4837, lng: 127.0324 },
  성동구: { lat: 37.5635, lng: 127.0369 },
  성북구: { lat: 37.5891, lng: 127.0182 },
  송파구: { lat: 37.5145, lng: 127.1058 },
  양천구: { lat: 37.5170, lng: 126.8665 },
  영등포구: { lat: 37.5264, lng: 126.8962 },
  용산구: { lat: 37.5326, lng: 126.9900 },
  은평구: { lat: 37.6027, lng: 126.9291 },
  종로구: { lat: 37.5730, lng: 126.9794 },
  중구: { lat: 37.5638, lng: 126.9975 },
  중랑구: { lat: 37.6066, lng: 127.0927 },
};

/** 기본 서울시 중심 좌표 (서울시청) */
export const DEFAULT_SEOUL_COORD = { lat: 37.5665, lng: 126.9780 };

/**
 * 식당의 구(시군)와 주소를 기반으로 위도/경도 반환
 * 동일 구 내에서도 주소 해시값을 기반으로 약 100~500m 미세 분산 부여
 */
export function getCoordinates(district: string, address: string): { lat: number; lng: number } {
  let target = district.trim();

  // 구 정보가 없거나 매핑이 안될 경우 주소에서 자치구명 탐색
  if (!DISTRICT_COORDS[target]) {
    for (const d of Object.keys(DISTRICT_COORDS)) {
      if (address.includes(d)) {
        target = d;
        break;
      }
    }
  }

  const base = DISTRICT_COORDS[target] ?? DEFAULT_SEOUL_COORD;

  // 같은 구 내 식당들이 전부 동일한 좌표에 겹치지 않도록 주소 기반 미세 오프셋 (약 ±400m)
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = (hash << 5) - hash + address.charCodeAt(i);
    hash |= 0;
  }
  const latOffset = ((Math.abs(hash) % 80) - 40) * 0.0001;
  const lngOffset = ((Math.abs(hash >> 3) % 80) - 40) * 0.0001;

  return {
    lat: +(base.lat + latOffset).toFixed(6),
    lng: +(base.lng + lngOffset).toFixed(6),
  };
}
