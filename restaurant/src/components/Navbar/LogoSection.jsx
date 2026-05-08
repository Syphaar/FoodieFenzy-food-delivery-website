import { GiChefToque } from "react-icons/gi";
import { NavLink } from "react-router-dom";

const LogoSection = () => (
  <div className="shrink-0 flex items-center relative ml-0 md:ml-2">
    <div className="relative flex items-center space-x-2">

      {/* GLOW */}
      <div
        className="absolute -inset-4 bg-amber-500/10 rounded-full blur-xl opacity-0
        group-hover/nav:opacity-100 transition-opacity duration-300"
      />

      {/* ICON */}
      <GiChefToque
        className="relative text-3xl md:text-4xl lg:text-5xl text-amber-500
        transition-all duration-300
        group-hover/nav:rotate-12 group-hover/nav:text-amber-400
        hover:drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
      />
      <div className="flex flex-col relative ml-2 cursor-pointer max-w-35 md:max-w-40 lg:max-w-none">
        <NavLink to="/" className="text-xl md:text-2xl lg:text-4xl bg-linear-to-r from-amber-400 
          to-amber-600 bg-clip-text text-transparent tracking-wider drop-shadow-[0_2px_2px] 
          drop-shadow-black -translate-x-2 truncate md:truncate-none"
        >
          Foodie-Frenzy
          <div className="h-1 bg-linear-to-r from-amber-600/30 via-amber-400/50 to-amber-600/30 
            mt-2 shadow-[0_2px_5px] shadow-amber-500/20"
          ></div>
        </NavLink>
      </div>
    </div>
  </div>
);

export default LogoSection;