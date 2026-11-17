import { Heart } from "lucide-react";
import { won, type MenuItem } from "../data";

export default function MenuCard({
  item, budget, selected, fav, dist, onSelect, onFav,
}: {
  item: MenuItem; budget: number; selected: boolean; fav: boolean; dist?: number;
  onSelect: () => void; onFav: () => void;
}) {
  const left = budget - item.m.price;
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-2xl border bg-white p-5 transition ${
        selected ? "border-2 border-[#F26B2A] bg-[#FFFAF6]" : "border-[#e6e6e6] hover:border-[#F26B2A]/50"
      }`}
    >
      <div className="flex items-start justify-between">
        {item.r.goodPrice ? (
          <span className="rounded-md bg-[#E8F3E8] px-2 py-1 text-[11px] font-bold text-[#2f6b3a]">착한가격업소</span>
        ) : <span className="rounded-md bg-[#f1f1f1] px-2 py-1 text-[11px] font-bold text-[#777]">일반 식당</span>}
        <button
          aria-label={fav ? "즐겨찾기 해제" : "즐겨찾기 담기"}
          onClick={(e) => { e.stopPropagation(); onFav(); }}
          className={fav ? "text-[#F26B2A]" : "text-[#bbb]"}
        >
          <Heart size={20} fill={fav ? "currentColor" : "none"} />
        </button>
      </div>
      <h3 className="mt-3 text-lg font-extrabold">{item.r.name}</h3>
      <p className="text-xs text-[#888]">
        서울 {item.r.district.replace("구", "")}구 · {item.r.address.split(" ").slice(3, 5).join(" ")}
        {dist != null && ` · ${dist.toFixed(1)}km`}
      </p>
      <div className="mt-6 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold">{item.m.name}</p>
          <p className="mt-1 text-xs text-[#888]">
            {left === 0 ? "설정한 예산에 딱 맞아요" : `내 예산에서 ${won(left)} 남아요`}
          </p>
        </div>
        <p className="shrink-0 text-[28px] font-extrabold leading-none tracking-tight text-[#F26B2A]">
          {item.m.price.toLocaleString()}<span className="ml-1 text-xs font-medium text-[#999]">원</span>
        </p>
      </div>
    </div>
  );
}
