import React from "react";
import { Link } from "react-router-dom";

const Button = ({ children, active, linkto }) => {
  return (
    <Link to={linkto}>
      <div
        className={`text-center text-[13px] sm:text-[15px] px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
          active
            ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02]"
            : "bg-slate-900/80 border border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white"
        } active:scale-95`}
      >
        {children}
      </div>
    </Link>
  );
};

export default Button;
