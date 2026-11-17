import { useState } from "react";
import { Heart, Check, PencilLine } from "lucide-react";
import { won, type MenuItem } from "../data";
import { today, useEntries } from "../store";

export default function DetailPanel({
  item, budget, fav, onFav,
}: { item?: MenuItem; budget: number; fav: boolean; onFav: () => void }) {
  const [, setEntries] = useEntries();
  const [done, setDone] = useState(false);
  if (!item)
    return (
      <aside className="rounded-2xl border border-[#e6e6e6] bg-white p-6 text-sm text-[#888]">
        메뉴를 고르면 자세한 정보를 볼 수 있어요.
      </aside>
    );
  const left = budget - item.m.price;
  const record = () => {
    setEntries((p) => [...p, { id: crypto.randomUUID(), date: today(), place: item.r.name, menu: item.m.name, amount: item.m.price }]);
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };
  return (
    <aside className="rounded-2xl border border-[#e6e6e6] bg-white p-6 lg:sticky lg:top-4">
      <p className="text-xs font-bold text-[#F26B2A]">선택한 메뉴 자세히 보기</p>
      <h2 className="mt-3 text-[28px] font-extrabold tracking-tight">{item.r.name}</h2>
      <p className="mt-2 text-sm leading-6 text-[#666]">{item.r.address}</p>
      <hr className="my-6 border-[#eee]" />
      <p className="text-xs text-[#888]">{item.r.goodPrice ? "착한가격 메뉴" : "대표 메뉴"}</p>
      <div className="mt-1 flex items-end justify-between">
        <p className="text-lg font-extrabold">{item.m.name}</p>
        <p className="text-2xl font-extrabold text-[#F26B2A]">{won(item.m.price)}</p>
      </div>
      {item.r.menus.length > 1 && (
        <ul className="mt-3 space-y-1 text-xs text-[#777]">
          {item.r.menus.filter((m) => m.name !== item.m.name).map((m) => (
            <li key={m.name} className="flex justify-between"><span>{m.name}</span><span>{won(m.price)}</span></li>
          ))}
        </ul>
      )}
      <div className="mt-6 rounded-xl bg-[#FDF1E6] p-5">
        <div className="flex justify-between text-sm text-[#777]"><span>설정한 한 끼 예산</span><span>{won(budget)}</span></div>
        <div className="my-3 border-t border-dashed border-[#e3cdb8]" />
        <div className="flex justify-between text-base font-extrabold">
          <span>이 메뉴를 고르면</span><span>{left >= 0 ? `${won(left)} 남음` : `${won(-left)} 초과`}</span>
        </div>
      </div>
      <button onClick={onFav} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F26B2A] py-3.5 text-sm font-bold text-white hover:bg-[#e05d1d]">
        <Heart size={15} fill={fav ? "currentColor" : "none"} /> {fav ? "즐겨찾기에서 빼기" : "즐겨찾기에 담기"}
      </button>
      <button onClick={record} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[#F26B2A] py-3 text-sm font-bold text-[#F26B2A] hover:bg-[#FFF4EC]">
        {done ? <><Check size={15} /> 오늘 식비에 기록했어요</> : <><PencilLine size={15} /> 오늘 먹었어요 · 식비 기록</>}
      </button>
      <p className="mt-4 text-[11px] leading-5 text-[#999]">
        실시간 영업 여부와 가격은 제공하지 않아요.<br />식사 후 실제 지출은 '나의 식비 기록'에 직접 입력해요.
      </p>
    </aside>
  );
}
