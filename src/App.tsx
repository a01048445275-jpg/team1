import { NavLink, Outlet, ScrollRestoration } from "react-router";
import { UtensilsCrossed } from "lucide-react";

const tabs = [
  { to: "/", label: "메뉴 찾기", end: true },
  { to: "/favorites", label: "즐겨찾기" },
  { to: "/ledger", label: "나의 식비 기록" },
];

export default function App() {
  return (
    <div className="min-h-screen bg-[#F4F7F2] text-[#222]">
      <header className="border-b border-[#eee] bg-white">
        <div className="mx-auto flex max-w-[1240px] items-center gap-4 px-5 md:gap-12">
          <NavLink to="/" className="flex shrink-0 items-center gap-2 py-4">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#F26B2A] text-white">
              <UtensilsCrossed size={20} />
            </span>
            <span className="text-2xl font-extrabold tracking-tight">한끼예산</span>
          </NavLink>
          <nav className="flex gap-5 overflow-x-auto md:gap-8">
            {tabs.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.end}
                className={({ isActive }) =>
                  `whitespace-nowrap border-b-[3px] py-5 text-[15px] font-semibold ${
                    isActive ? "border-[#F26B2A] text-[#F26B2A]" : "border-transparent text-[#333]"
                  }`
                }
              >
                {t.label}
              </NavLink>
            ))}
          </nav>
          <p className="ml-auto hidden text-sm text-[#777] lg:block">예산은 가볍게, 한 끼는 든든하게.</p>
        </div>
      </header>
      <Outlet />
      <footer className="mx-auto max-w-[1240px] px-5 pb-10 pt-6 text-xs leading-6 text-[#777]">
        <div className="border-t border-[#ddd] pt-5">
          <b className="text-[#333]">데이터 출처</b> 행정안전부 · 착한가격업소 현황 (예시 데이터)<br />
          공공데이터 일부를 배치한 화면 시안입니다. 실제 영업 정보와 다를 수 있어요. 식비 기록은 이 기기에만 저장돼요.
        </div>
      </footer>
      <ScrollRestoration />
    </div>
  );
}
