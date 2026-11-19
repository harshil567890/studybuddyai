import React from "react";
import { Link } from "react-router-dom";
import { BrainCircuit, Sparkles, Github, Twitter, Linkedin, Mail } from "lucide-react";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms of Service", "AI Safety"];
const Resources = [
  "AI Knowledge Studio",
  "Lecture Copilot",
  "Adaptive Flashcards",
  "Quiz Arena",
  "Cognitive Analytics",
  "Course Catalog",
];
const LearningTracks = [
  "Artificial Intelligence & LLMs",
  "Full-Stack Web Engineering",
  "Cloud Architecture & DevOps",
  "Data Science & Predictive Modeling",
];

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400">
      <div className="mx-auto w-11/12 max-w-maxContent py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1.5px]">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                  <BrainCircuit className="h-5 w-5 text-cyan-400" />
                </div>
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                StudyBuddy <span className="gradient-text font-extrabold">AI</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              The all-in-one cognitive learning ecosystem. Combining accredited video curriculums with instant AI lecture copilots and spaced repetition flashcards.
            </p>
            <div className="flex gap-3 text-slate-400 pt-2">
              <a href="#github" className="hover:text-cyan-400 transition"><Github className="h-4 w-4" /></a>
              <a href="#twitter" className="hover:text-cyan-400 transition"><Twitter className="h-4 w-4" /></a>
              <a href="#linkedin" className="hover:text-cyan-400 transition"><Linkedin className="h-4 w-4" /></a>
              <a href="#mail" className="hover:text-cyan-400 transition"><Mail className="h-4 w-4" /></a>
            </div>
          </div>

          {/* AI Suite */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              AI Learning Suite
            </h4>
            <ul className="space-y-2 text-xs">
              {Resources.map((item, i) => (
                <li key={i}>
                  <Link to="/studio" className="hover:text-indigo-400 transition">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tracks */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Featured Tracks
            </h4>
            <ul className="space-y-2 text-xs">
              {LearningTracks.map((item, i) => (
                <li key={i}>
                  <Link to="/catalog" className="hover:text-cyan-400 transition">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Platform & Access
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-white transition">About the Ecosystem</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Enterprise & Academic Inquiries</Link></li>
              <li><Link to="/dashboard/my-profile" className="hover:text-white transition">Student Command Center</Link></li>
              <li><Link to="/signup" className="hover:text-white transition">Instructor Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-500">
          <div className="flex flex-wrap gap-4">
            {BottomFooter.map((item, idx) => (
              <span key={idx} className="hover:text-slate-400 cursor-pointer transition">
                {item}
              </span>
            ))}
          </div>
          <p>© {new Date().getFullYear()} StudyBuddy AI Ecosystem. Crafted for accelerated human learning.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
