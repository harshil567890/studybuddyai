import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Sparkles,
  X,
  CheckCircle2,
  BookOpen,
  Layers,
  RotateCw,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { generateCourseCurriculumAI } from "../../../../services/operations/aiCopilotAPI";

export default function AICourseArchitectModal({ isOpen, onClose, onApply }) {
  const { token } = useSelector((state) => state.auth);
  const [topic, setTopic] = useState("");
  const [targetAudience, setTargetAudience] = useState("Intermediate");
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error("Please enter a course topic");
      return;
    }
    setLoading(true);
    const data = await generateCourseCurriculumAI(
      { topic: topic.trim(), targetAudience },
      token
    );
    if (data) {
      setGeneratedData(data);
    }
    setLoading(false);
  };

  const handleApply = () => {
    if (!generatedData) return;
    onApply(generatedData);
    toast.success("Applied AI curriculum to course form!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                AI Course Architect
                <span className="rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-400">
                  Curriculum Engine
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Design titles, learning outcomes, and multi-section syllabus in seconds.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Input Controls */}
        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Course Subject or Core Concept
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Next.js 14 Microfrontends & Edge Computing"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Target Level
            </label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Beginner">Beginner (Foundational)</option>
              <option value="Intermediate">Intermediate (Professional)</option>
              <option value="Advanced">Advanced (Enterprise)</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 py-2.5 text-xs font-bold text-white shadow-lg hover:opacity-95 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RotateCw className="h-4 w-4 animate-spin" />
                  <span>Synthesizing Architecture...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Complete Architecture</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Preview Results */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {generatedData ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  Recommended Course Title
                </span>
                <h4 className="text-base font-bold text-white">
                  {generatedData.courseTitle}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {generatedData.courseDescription}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Learning Objectives / What You'll Learn
                </span>
                <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                  {generatedData.learningObjectives}
                </p>
              </div>

              {/* Curriculum Outline */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                  Syllabus Outline ({generatedData.curriculum?.length || 0} Sections)
                </span>
                <div className="space-y-2">
                  {generatedData.curriculum?.map((sec, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-3 space-y-1.5"
                    >
                      <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Section {idx + 1}: {sec.sectionName}</span>
                      </h5>
                      <div className="pl-5 space-y-1">
                        {sec.lectures?.map((lec, lIdx) => (
                          <div
                            key={lIdx}
                            className="text-[11px] text-slate-400 flex items-start gap-1.5"
                          >
                            <BookOpen className="h-3 w-3 text-slate-500 shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-slate-300">{lec.title}</strong>:{" "}
                              {lec.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-500 space-y-2">
              <Sparkles className="h-8 w-8 mx-auto text-slate-600" />
              <p className="text-xs">
                Enter your subject above to generate an industry-ready course framework.
              </p>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!generatedData}
            onClick={handleApply}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-xs font-bold text-white shadow-lg hover:opacity-95 transition disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Apply to Course Details</span>
          </button>
        </div>
      </div>
    </div>
  );
}
