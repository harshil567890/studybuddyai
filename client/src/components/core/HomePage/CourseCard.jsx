import React from "react";

// Importing React Icons
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";

const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
  const isSelected = currentCard === cardData?.heading;

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden ${
        isSelected
          ? "border-cyan-500/60 bg-gradient-to-b from-indigo-950/40 via-slate-900/90 to-slate-950 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/30 -translate-y-1"
          : "border-slate-800/80 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70"
      }`}
      onClick={() => setCurrentCard(cardData?.heading)}
    >
      <div className="p-6 flex flex-col gap-3">
        <div
          className={`font-bold text-base sm:text-lg transition ${
            isSelected ? "text-cyan-300" : "text-white"
          }`}
        >
          {cardData?.heading}
        </div>

        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
          {cardData?.description}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-slate-800/80 px-6 py-3.5 bg-slate-950/40 text-xs text-slate-400 font-medium">
        {/* Level */}
        <div className="flex items-center gap-2">
          <HiUsers className={isSelected ? "text-cyan-400" : "text-slate-500"} />
          <span>{cardData?.level}</span>
        </div>

        {/* Lessons */}
        <div className="flex items-center gap-2">
          <ImTree className={isSelected ? "text-indigo-400" : "text-slate-500"} />
          <span>{cardData?.lessionNumber} Lessons</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
