const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];
const ROW_OFFSET = ["ml-0", "ml-4", "ml-8"];

export default function Keys({ activeKey, onKey }) {
  return (
    <div className="flex flex-col items-center gap-1.5 pb-4">
      {ROWS.map((row, i) => (
        <div key={i} className={`flex gap-1.5 ${ROW_OFFSET[i]}`}>
          {row.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => onKey(label)}
              className={`tw-keycap flex h-8 w-8 items-center justify-center rounded-full bg-[#1c1b19] text-xs font-medium text-[#e8e2d0] cursor-pointer select-none ${
                activeKey === label ? "is-active" : ""
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      ))}
      <div className="mt-1 flex gap-1.5">
        <button
          type="button"
          onClick={() => onKey("BKSP")}
          className={`tw-keycap flex h-8 items-center justify-center rounded-full bg-[#1c1b19] px-3 text-[10px] font-medium text-[#e8e2d0] cursor-pointer select-none ${
            activeKey === "BKSP" ? "is-active" : ""
          }`}
        >
          ⌫
        </button>
        <button
          type="button"
          onClick={() => onKey("SPACE")}
          className={`tw-keycap h-8 w-40 rounded-full bg-[#1c1b19] cursor-pointer select-none ${
            activeKey === "SPACE" ? "is-active" : ""
          }`}
        />
        <button
          type="button"
          onClick={() => onKey("RETURN")}
          className={`tw-keycap flex h-8 items-center justify-center rounded-full bg-[#c9a227] px-3 text-[10px] font-medium text-[#1c1b19] cursor-pointer select-none ${
            activeKey === "RETURN" ? "is-active" : ""
          }`}
        >
          RETURN
        </button>
      </div>
    </div>
  );
}
