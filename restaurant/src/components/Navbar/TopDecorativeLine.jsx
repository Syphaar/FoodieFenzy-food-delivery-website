import { GiForkKnifeSpoon } from "react-icons/gi";

const TopDecorativeLine = () => (
  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4">
    <div className="h-6 bg-linear-to-r from-transparent via-amber-600/50 to-transparent
      shadow-[0_0_20px] shadow-amber-500/30"
    >
      <div className="flex justify-between px-6">
        <GiForkKnifeSpoon className="text-amber-500/40 -mt-4 -ml-2 rotate-45" size={32}/>
        <GiForkKnifeSpoon
          className="text-amber-500/40 -mt-4 -mr-2 rotate-45"
          size={32}
        />
      </div>
    </div>
  </div>
);

export default TopDecorativeLine;