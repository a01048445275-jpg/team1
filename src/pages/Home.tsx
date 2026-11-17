import { useMemo, useState } from "react";
import { ArrowRight, ChevronDown, LocateFixed, Shuffle, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { ALL_MENUS, BUDGETS, CATEGORIES, DISTRICTS, distanceKm, won, type Category, type MenuItem } from "../data";
import { useBudget, useFavItems } from "../store";
import MenuCard from "../components/MenuCard";
import DetailPanel from "../components/DetailPanel";
import { useApiData } from "../lib/useApiData";
import type { GoodPriceRestaurant } from "../lib/api";

type Sort = "price" | "priceDesc" | "near";

/** API GoodPriceRestaurant → MenuItem 변환 */
function toMenuItems(restaurants: GoodPriceRestaurant[]): MenuItem[] {
  return restaurants.flatMap((r) =>
    r.menus.map((m) => ({
      key: `${r.name}-${m.name}`,
      r: {
        id: 0,
        name: r.name,
        category: (["한식", "중식", "일식", "양식"].includes(r.category)
          ? r.category
          : "기타") as Category,
        district: r.district,
        address: r.address,
        lat: 0,
        lng: 0,
        goodPrice: true,
        menus: r.menus,
      },
      m,
    })),
  );
}

function Bowl() {
  return (
    <svg viewBox="0 0 240 200" className="h-44 w-auto md:h-60" aria-hidden>
      <ellipse cx="120" cy="178" rx="84" ry="10" fill="#00000012" />
      <path d="M30 100 Q120 90 210 100 Q205 170 120 172 Q35 170 30 100Z" fill="#fff" stroke="#eadfd3" strokeWidth="3" />
      <ellipse cx="120" cy="98" rx="90" ry="26" fill="#f6ead9" />
      <path d="M45 92 Q70 60 98 84 L90 100Z" fill="#F4883D" />
      <path d="M150 84 Q175 58 198 90 L170 102Z" fill="#5e8f3e" />
      <path d="M60 104 Q90 120 120 112 L100 96Z" fill="#8a5a3c" />
      <path d="M150 108 Q180 112 195 100 L170 94Z" fill="#e9d9a5" />
      <circle cx="120" cy="88" r="28" fill="#fff" />
      <circle cx="120" cy="88" r="12" fill="#F7B21F" />
      <rect x="196" y="20" width="7" height="150" rx="3" fill="#F26B2A" transform="rotate(18 200 90)" />
      <rect x="210" y="22" width="7" height="150" rx="3" fill="#F26B2A" transform="rotate(18 214 90)" />
      <circle cx="26" cy="160" r="14" fill="#e6b84d" /><circle cx="48" cy="170" r="12" fill="#d9a63a" />
    </svg>
  );
}

export default function Home() {
  const [budget, setBudget] = useBudget();
  const [, toggleFav, isFav] = useFavItems();
  const [district, setDistrict] = useState("전체");
  const [q, setQ] = useState("");
  const [applied, setApplied] = useState({ q: "" });
  const [cats, setCats] = useState<Category[]>([]);
  const [goodOnly, setGoodOnly] = useState(true);
  const [sort, setSort] = useState<Sort>("price");
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [geoMsg, setGeoMsg] = useState("");
  const [sel, setSel] = useState<string>("");
  const [limit, setLimit] = useState(8);
  const [useApi, setUseApi] = useState(true);

  // 공공데이터 API 호출
  const { items: apiItems, status, error, totalCount, reload } = useApiData({
    district,
    category: cats.length === 1 ? cats[0] : "",
    enabled: useApi,
  });

  const apiMenuItems = useMemo(() => toMenuItems(apiItems), [apiItems]);

  const list = useMemo(() => {
    const kw = applied.q.trim();
    const source = useApi && status === "success" ? apiMenuItems : (useApi && status === "loading" ? [] : ALL_MENUS);
    const rows = source.filter(
      (x) =>
        x.m.price <= budget &&
        (district === "전체" || x.r.district === district) &&
        (!cats.length || cats.includes(x.r.category)) &&
        (!goodOnly || x.r.goodPrice) &&
        (!kw || x.m.name.includes(kw) || x.r.name.includes(kw)),
    ).map((x) => ({ ...x, dist: pos ? distanceKm(pos.lat, pos.lng, x.r.lat, x.r.lng) : undefined }));

    rows.sort((a, b) =>
      sort === "near" && pos ? (a.dist ?? 0) - (b.dist ?? 0) : sort === "priceDesc" ? b.m.price - a.m.price : a.m.price - b.m.price,
    );
    return rows;
  }, [budget, district, cats, goodOnly, applied, sort, pos, apiMenuItems, useApi, status]);

  const selected = list.find((x) => x.key === sel) ?? list[0];

  const locate = () => {
    if (!navigator.geolocation) return setGeoMsg("이 브라우저는 위치를 지원하지 않아요.");
    setGeoMsg("위치를 확인하는 중이에요…");
    navigator.geolocation.getCurrentPosition(
      (p) => { setPos({ lat: p.coords.latitude, lng: p.coords.longitude }); setSort("near"); setGeoMsg("내 위치 기준으로 가까운 순이에요."); },
      () => {
        setPos({ lat: 37.5662, lng: 126.9779 }); setSort("near");
        setGeoMsg("위치를 못 받아 서울시청 기준으로 보여드려요.");
      },
      { timeout: 6000 },
    );
  };
  const reset = () => {
    setDistrict("전체"); setCats([]); setBudget(8000); setGoodOnly(true);
    setQ(""); setApplied({ q: "" }); setPos(null); setSort("price"); setGeoMsg(""); setSel("");
  };
  const random = () => { if (list.length) { setSel(list[Math.floor(Math.random() * list.length)].key); } };

  return (
    <main>
      <section className="bg-[#FDF1E6]">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 py-10 md:py-12">
          <div>
            <p className="text-xs font-bold tracking-wider text-[#F26B2A] md:text-sm">BUDGET FIRST, GOOD MEAL.</p>
            <h1 className="mt-4 text-[34px] font-extrabold leading-[1.25] tracking-tight [word-break:keep-all] md:text-[52px]">
              오늘 한 끼,<br /><span className="text-[#F26B2A]">{budget.toLocaleString()}원</span>이면 충분해.
            </h1>
            <p className="mt-4 text-sm text-[#666] md:text-base [word-break:keep-all]">내 예산에 맞는 착한가격 메뉴를 한눈에 비교해 보세요.</p>
          </div>
          <div className="relative hidden shrink-0 sm:block">
            <span className="absolute -left-10 top-0 -rotate-6 rounded-2xl border border-[#eee] bg-white px-4 py-2 text-sm font-bold shadow-sm">작은 예산, 든든한 한 끼</span>
            <div className="pt-8"><Bowl /></div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1240px] px-5">
        <form
          onSubmit={(e) => { e.preventDefault(); setApplied({ q }); setLimit(8); }}
          className="grid gap-4 rounded-2xl border border-[#e6e6e6] bg-white p-5 shadow-sm md:grid-cols-[1fr_1fr_1.6fr_auto] md:items-center md:p-6"
          style={{ marginTop: "-1px" }}
        >
          <label className="block md:border-r md:pr-4">
            <span className="text-xs text-[#777]">어디에서 먹을까요?</span>
            <span className="relative mt-1 flex items-center">
              <select value={district} onChange={(e) => { setDistrict(e.target.value); setLimit(8); }} className="w-full appearance-none rounded-none border-0 bg-transparent p-0 pr-6 text-lg font-bold shadow-none outline-none">
                {DISTRICTS.map((d) => <option key={d} value={d}>서울특별시 · {d}</option>)}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-0 text-[#888]" />
            </span>
          </label>
          <label className="block md:border-r md:pr-4">
            <span className="text-xs text-[#777]">한 끼 최대 예산</span>
            <span className="relative mt-1 flex items-center">
              <select value={budget} onChange={(e) => { setBudget(+e.target.value); setLimit(8); }} className="w-full appearance-none rounded-none border-0 bg-transparent p-0 pr-6 text-lg font-bold shadow-none outline-none">
                {Array.from(new Set([...BUDGETS, budget])).sort((a, b) => a - b).map((b) => <option key={b} value={b}>{b.toLocaleString()}원 이하</option>)}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-0 text-[#888]" />
            </span>
          </label>
          <label className="block">
            <span className="text-xs text-[#777]">먹고 싶은 메뉴</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="메뉴명 또는 업소명을 입력해 주세요" className="mt-1 block w-full rounded-none border-0 bg-transparent p-0 text-lg shadow-none outline-none placeholder:text-[#bbb]" />
          </label>
          <button className="flex items-center justify-center gap-2 rounded-xl bg-[#F26B2A] px-8 py-4 font-bold text-white hover:bg-[#e05d1d]">
            메뉴 찾기 <ArrowRight size={18} />
          </button>
        </form>

        {/* API 상태 배너 */}
        {useApi && (
          <div className={`mt-3 flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold ${
            status === "loading" ? "bg-[#FFF8F2] text-[#F26B2A]" :
            status === "error"   ? "bg-red-50 text-red-700" :
            status === "success" ? "bg-[#EEF4EC] text-[#2f8f4a]" : "hidden"
          }`}>
            {status === "loading" && <><span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-[#F26B2A] border-t-transparent" />행정안전부 착한가격업소 데이터 불러오는 중…</>}
            {status === "error"   && <><WifiOff size={13} />API 오류: {error}<button onClick={reload} className="ml-2 underline">재시도</button><button onClick={() => setUseApi(false)} className="ml-2 underline">샘플 데이터 사용</button></>}
            {status === "success" && <><Wifi size={13} />행정안전부 착한가격업소 {totalCount.toLocaleString()}곳 연동 완료 (서울 기준)</>}
          </div>
        )}
        {!useApi && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#f5f5f5] px-4 py-2.5 text-xs font-semibold text-[#777]">
            <WifiOff size={13} />샘플 데이터 사용 중
            <button onClick={() => setUseApi(true)} className="ml-auto text-[#F26B2A] underline">실제 데이터 불러오기</button>
          </div>
        )}

        <div className="mt-6 grid gap-5 lg:grid-cols-[215px_1fr_300px] xl:grid-cols-[240px_1fr_360px]">
          <aside className="h-fit rounded-2xl border border-[#e6e6e6] bg-white p-5">
            <div className="flex items-center justify-between"><h2 className="font-extrabold">내 식사 조건</h2><button onClick={reset} className="text-xs text-[#888]">초기화</button></div>
            <p className="mt-5 text-sm font-bold">음식 종류</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["전체", ...CATEGORIES].map((c) => {
                const on = c === "전체" ? cats.length === 0 : cats.includes(c as Category);
                return (
                  <button key={c} onClick={() => c === "전체" ? setCats([]) : setCats((p) => p.includes(c as Category) ? p.filter((x) => x !== c) : [...p, c as Category])}
                    className={`rounded-lg border px-3.5 py-2 text-xs font-semibold ${on ? "border-[#F26B2A] bg-[#FFF1E8] text-[#F26B2A]" : "border-[#e6e6e6] text-[#666]"}`}>{c}</button>
                );
              })}
            </div>
            <hr className="my-6 border-[#eee]" />
            <p className="text-sm font-bold">최대 예산</p>
            <p className="mt-3 text-[26px] font-extrabold text-[#F26B2A]">{won(budget)}</p>
            <input type="range" min={3000} max={30000} step={500} value={budget} onChange={(e) => setBudget(+e.target.value)} aria-label="최대 예산" className="mt-2 w-full accent-[#F26B2A]" />
            <div className="flex justify-between text-[10px] text-[#999]"><span>3,000원</span><span>30,000원</span></div>
            <hr className="my-6 border-[#eee]" />
            <p className="text-sm font-bold">표시 옵션</p>
            <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={goodOnly} onChange={(e) => setGoodOnly(e.target.checked)} className="h-4 w-4 accent-[#F26B2A]" /> 착한가격업소만 보기</label>
            <button onClick={locate} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-[#e6e6e6] py-2.5 text-xs font-semibold hover:border-[#F26B2A]"><LocateFixed size={14} /> 내 위치로 가까운 순</button>
            {geoMsg && <p className="mt-2 text-[11px] text-[#888]">{geoMsg}</p>}
            {useApi && status === "error" && (
              <button onClick={reload} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#e6e6e6] py-2.5 text-xs font-semibold text-[#F26B2A] hover:border-[#F26B2A]">
                <RefreshCw size={14} /> API 재시도
              </button>
            )}
          </aside>

          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold tracking-tight">예산 안에서 고르는 오늘의 메뉴</h2>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="bg-transparent text-xs text-[#666] outline-none">
                <option value="price">가격 낮은 순</option><option value="priceDesc">가격 높은 순</option><option value="near" disabled={!pos}>가까운 순</option>
              </select>
            </div>
            <p className="mt-2 text-xs text-[#888]">서울 {district === "전체" ? "전체" : district} · {budget.toLocaleString()}원 이하 · 메뉴 {list.length}개</p>

            {status === "loading" && list.length === 0 ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-44 animate-pulse rounded-2xl bg-[#f0f0f0]" />
                ))}
              </div>
            ) : list.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-[#ccc] bg-white p-10 text-center text-sm text-[#777]">
                {status === "loading" ? "데이터를 불러오는 중이에요…" : "조건에 맞는 메뉴가 없어요. 예산을 올리거나 지역을 넓혀 보세요."}
              </div>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {list.slice(0, limit).map((x) => (
                  <MenuCard
                    key={x.key}
                    item={x}
                    dist={x.dist}
                    budget={budget}
                    selected={selected?.key === x.key}
                    fav={isFav(x.key)}
                    onSelect={() => setSel(x.key)}
                    onFav={() => toggleFav(x)}
                  />
                ))}
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[#888]">가격은 공공데이터 기준이며, 방문 전 확인이 필요해요.</p>
              <div className="flex gap-2">
                {list.length > limit && <button onClick={() => setLimit(limit + 8)} className="rounded-xl border border-[#e6e6e6] bg-white px-4 py-3 text-xs font-bold">더 보기</button>}
                <button onClick={random} className="flex items-center gap-1.5 rounded-xl border border-[#d5e3d3] bg-[#EEF4EC] px-4 py-3 text-xs font-bold"><Shuffle size={13} /> 못 고르겠다면? 랜덤 추천</button>
              </div>
            </div>
          </section>

          <DetailPanel
            item={selected}
            budget={budget}
            fav={selected ? isFav(selected.key) : false}
            onFav={() => selected && toggleFav(selected)}
          />
        </div>

        <ol className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-xs text-[#555]">
          <li><b className="mr-2 text-[#F26B2A]">01</b>지역·예산으로 좁히고</li>
          <li><b className="mr-2 text-[#F26B2A]">02</b>메뉴별 가격을 비교하고</li>
          <li><b className="mr-2 text-[#F26B2A]">03</b>마음에 드는 한 끼를 저장해요</li>
        </ol>
      </div>
    </main>
  );
}
