import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { won } from "../data";
import { today, useBudget, useEntries } from "../store";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Ledger() {
  const [budget, setBudget] = useBudget();
  const [entries, setEntries] = useEntries();
  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() + 1 });
  const [f, setF] = useState({ date: today(), place: "", menu: "", amount: "" });
  const [err, setErr] = useState("");

  const prefix = `${ym.y}-${pad(ym.m)}`;
  const month = useMemo(() => entries.filter((e) => e.date.startsWith(prefix)).sort((a, b) => b.date.localeCompare(a.date)), [entries, prefix]);
  const total = month.reduce((s, e) => s + e.amount, 0);
  const saved = month.reduce((s, e) => s + Math.max(0, budget - e.amount), 0);
  const days = new Date(ym.y, ym.m, 0).getDate();
  const perDay = Array.from({ length: days }, (_, i) => month.filter((e) => +e.date.slice(8) === i + 1).reduce((s, e) => s + e.amount, 0));
  const max = Math.max(budget, ...perDay);
  const shift = (d: number) => setYm((p) => { const t = new Date(p.y, p.m - 1 + d, 1); return { y: t.getFullYear(), m: t.getMonth() + 1 }; });

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(f.amount.replace(/,/g, ""));
    if (!f.place.trim() || !amount || amount < 0) return setErr("식당명과 금액을 입력해 주세요.");
    setErr("");
    setEntries((p) => [...p, { id: crypto.randomUUID(), date: f.date, place: f.place.trim(), menu: f.menu.trim(), amount }]);
    setF({ ...f, place: "", menu: "", amount: "" });
  };

  const input = "mt-1 w-full rounded-lg border border-[#e0e0e0] px-3 py-2.5 text-sm outline-none focus:border-[#F26B2A]";
  const byDate = month.reduce<Record<string, typeof month>>((a, e) => ((a[e.date] ||= []).push(e), a), {});

  return (
    <main className="mx-auto max-w-[1240px] px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight">나의 식비 기록</h1>
        <div className="flex items-center gap-2">
          <button aria-label="이전 달" onClick={() => shift(-1)} className="rounded-lg border bg-white p-2"><ChevronLeft size={16} /></button>
          <span className="w-28 text-center font-bold">{ym.y}년 {ym.m}월</span>
          <button aria-label="다음 달" onClick={() => shift(1)} className="rounded-lg border bg-white p-2"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[["이번 달 식비", won(total), "text-[#222]"], ["예산 대비 절감", won(saved), "text-[#2f8f4a]"], ["기록한 끼니", `${month.length}끼`, "text-[#F26B2A]"]].map(([l, v, c]) => (
          <div key={l} className="rounded-2xl border border-[#e6e6e6] bg-white p-5"><p className="text-xs text-[#888]">{l}</p><p className={`mt-2 text-2xl font-extrabold ${c}`}>{v}</p></div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[340px_1fr]">
        <form onSubmit={add} className="h-fit rounded-2xl border border-[#e6e6e6] bg-white p-5">
          <h2 className="font-extrabold">한 끼 기록하기</h2>
          <label className="mt-4 block text-xs text-[#777]">날짜<input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} className={input} /></label>
          <label className="mt-3 block text-xs text-[#777]">식당명 *<input value={f.place} onChange={(e) => setF({ ...f, place: e.target.value })} placeholder="예: 산까치" className={input} /></label>
          <label className="mt-3 block text-xs text-[#777]">메뉴<input value={f.menu} onChange={(e) => setF({ ...f, menu: e.target.value })} placeholder="예: 철판삼겹구이" className={input} /></label>
          <label className="mt-3 block text-xs text-[#777]">지출 금액 (원) *<input inputMode="numeric" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value.replace(/[^\d]/g, "") })} placeholder="예: 5500" className={input} /></label>
          <label className="mt-3 block text-xs text-[#777]">한 끼 예산 (원)<input type="number" step={500} min={1000} value={budget} onChange={(e) => setBudget(+e.target.value || 8000)} className={input} /></label>
          {err && <p className="mt-3 text-xs text-red-600">{err}</p>}
          <button className="mt-5 w-full rounded-xl bg-[#F26B2A] py-3 text-sm font-bold text-white hover:bg-[#e05d1d]">기록 저장</button>
        </form>

        <div className="space-y-5">
          <section className="rounded-2xl border border-[#e6e6e6] bg-white p-5">
            <div className="flex items-center justify-between"><h2 className="font-extrabold">일별 식비</h2><span className="text-xs text-[#888]">점선은 한 끼 예산 {won(budget)}</span></div>
            <svg viewBox={`0 0 ${days * 20} 140`} className="mt-4 h-40 w-full" role="img" aria-label="일별 식비 막대 차트">
              <line x1="0" x2={days * 20} y1={120 - (budget / max) * 110} y2={120 - (budget / max) * 110} stroke="#F26B2A" strokeDasharray="4 4" />
              {perDay.map((v, i) => (
                <g key={i}>
                  <rect x={i * 20 + 4} width="12" rx="3" y={120 - (v / max) * 110} height={(v / max) * 110} fill={v > budget ? "#d64545" : "#F26B2A"} opacity={v ? 1 : 0}>
                    <title>{`${i + 1}일 ${won(v)}`}</title>
                  </rect>
                  {(i + 1) % 5 === 0 || i === 0 ? <text x={i * 20 + 10} y="135" fontSize="9" textAnchor="middle" fill="#999">{i + 1}</text> : null}
                </g>
              ))}
            </svg>
            {total === 0 && <p className="text-center text-xs text-[#999]">아직 기록이 없어요. 왼쪽에서 한 끼를 기록해 보세요.</p>}
          </section>

          <section className="rounded-2xl border border-[#e6e6e6] bg-white p-5">
            <h2 className="font-extrabold">기록 목록</h2>
            {month.length === 0 ? <p className="mt-3 text-sm text-[#888]">이 달에는 기록이 없어요.</p> : (
              <div className="mt-3 space-y-4">
                {Object.entries(byDate).map(([d, es]) => (
                  <div key={d}>
                    <p className="text-xs font-bold text-[#888]">{+d.slice(5, 7)}월 {+d.slice(8)}일 · {won(es.reduce((s, e) => s + e.amount, 0))}</p>
                    <ul className="mt-1 divide-y divide-[#f0f0f0]">
                      {es.map((e) => (
                        <li key={e.id} className="flex items-center justify-between py-2.5 text-sm">
                          <span><b>{e.place}</b>{e.menu && <span className="text-[#888]"> · {e.menu}</span>}</span>
                          <span className="flex items-center gap-3">
                            <span className="font-bold">{won(e.amount)}</span>
                            <span className={`text-xs ${e.amount <= budget ? "text-[#2f8f4a]" : "text-red-600"}`}>{e.amount <= budget ? `${won(budget - e.amount)} 절감` : `${won(e.amount - budget)} 초과`}</span>
                            <button aria-label="기록 삭제" onClick={() => setEntries((p) => p.filter((x) => x.id !== e.id))} className="text-[#bbb] hover:text-red-500"><Trash2 size={14} /></button>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
