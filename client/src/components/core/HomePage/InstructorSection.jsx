import React from 'react'
import CTAButton from "../../../components/core/HomePage/Button";
import { FaArrowRight } from "react-icons/fa";
import Instructor from "../../../assets/Images/Instructor.png";

const InstructorSection = () => {
  return (
    <div>
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-[48%] relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-indigo-500/30 to-cyan-500/20 blur-xl"></div>
            <img
              src={Instructor}
              alt="Instructor"
              className="relative rounded-2xl border border-slate-800 shadow-2xl object-cover w-full max-h-[480px]"
            />
          </div>
          <div className="lg:w-[52%] flex gap-6 flex-col">
            <div className="space-y-2">
              <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400">
                Educator Portal
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Become an{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  Instructor
                </span>
              </h2>
            </div>

            <p className="font-medium text-[16px] text-justify w-[90%] text-richblack-300">
              Instructors from around the world teach aspiring engineers on
              StudyBuddy AI. We provide AI curriculum generation tools and video
              infrastructure to share what you love.
            </p>

            <div className="w-fit">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-3">
                  Start Teaching Today
                  <FaArrowRight />
                </div>
              </CTAButton>
            </div>
          </div>
        </div>
    </div>
  )
}

export default InstructorSection