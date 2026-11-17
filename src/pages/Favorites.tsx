import { Link } from "react-router";
import { useBudget, useFavItems } from "../store";
import MenuCard from "../components/MenuCard";

export default function Favorites() {
  const [favItems, toggleFav] = useFavItems();
  const [budget] = useBudget();

  return (
    <main className="mx-auto max-w-[1240px] px-5 py-10">
      <h1 className="text-2xl font-extrabold tracking-tight">즐겨찾기</h1>
      <p className="mt-2 text-sm text-[#777]">담아 둔 메뉴 {favItems.length}개</p>
      {favItems.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-[#ccc] bg-white p-10 text-center text-sm text-[#777]">
          아직 담은 메뉴가 없어요. <Link to="/" className="font-bold text-[#F26B2A]">메뉴 찾으러 가기</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favItems.map((x) => (
            <MenuCard
              key={x.key}
              item={x}
              budget={budget}
              selected={false}
              fav={true}
              onSelect={() => {}}
              onFav={() => toggleFav(x)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
