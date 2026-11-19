import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Layers,
  BarChart3,
  CheckCircle2,
  Zap,
  Play,
  HelpCircle,
  Code2,
  Upload,
  ChevronDown,
} from "lucide-react";

import learningArtwork from "../assets/Images/TimelineImage.png";
import Footer from "../components/Common/Footer";
import ReviewSlider from "../components/Common/ReviewSlider";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import ExploreMore from "../components/core/HomePage/ExploreMore";

export default function Home() {
  const [copilotDemoTab, setCopilotDemoTab] = useState("summary");
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: "How does the AI Lecture Copilot integrate with video playback?",
      a: "The AI Lecture Copilot runs natively side-by-side with every lecture. It reads the lecture context, transcripts, and curriculum objectives to provide instant structured summaries, code explanations, practice checks, and key concept cards without interrupting your video stream.",
    },
    {
      q: "What is the AI Knowledge Studio?",
      a: "The Study Studio is a self-contained cognitive learning workspace (/studio). You can upload PDFs, research papers, or syllabus documents, and our AI pipeline automatically extracts spaced-repetition flashcards, timed arena quizzes, and 7-day mastery roadmaps.",
    },
    {
      q: "Does StudyBuddy AI require expensive third-party AI keys to use?",
      a: "No. The entire platform is built with resilient deterministic fallbacks. While it natively connects with Gemini when configured, all practice quizzes, summaries, study plans, and course structures function completely free out of the box.",
    },
    {
      q: "Can instructors use AI to build course curriculums?",
      a: "Yes! Instructors have access to the AI Course Architect inside the course creation flow. Simply provide your target subject and audience level, and the engine generates the course title, description, learning outcomes, and multi-section lecture outline ready to review and edit.",
    },
    {
      q: "How does the spaced-repetition flashcard system work?",
      a: "Every card tracks your recall responses ('Needs Review' vs 'I Know This'). The spaced repetition scheduler adjusts your review frequencies and cognitive retention scores to help you retain complex concepts long-term.",
    },
  ];

  return (
    <div className="home-page min-h-screen overflow-hidden text-slate-100">
      <section className="home-intro mx-auto w-11/12 max-w-7xl">
        <div className="home-hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" /> A little focus. A lasting
              understanding.
            </div>
            <h1>
              Make room for
              <br />
              <span className="editorial-serif">your next idea.</span>
            </h1>
            <p>
              A quieter place to learn something deeply. Explore expert-led
              courses, work through ideas with your AI study companion, and
              build knowledge that stays with you.
            </p>
            <div className="hero-actions">
              <Link
                to="/catalog/artificial-intelligence"
                className="premium-button"
              >
                Explore the courses <ArrowRight size={17} />
              </Link>
              <Link to="/studio" className="text-link">
                Open your study studio <ArrowRight size={16} />
              </Link>
            </div>
            <div className="hero-footnote">
              <BookOpen size={15} />
              <span>Watch thoughtfully. Practise often. Keep growing.</span>
            </div>
          </div>
          <div className="hero-artwork">
            <img
              src={learningArtwork}
              alt="A learner finding focus in a sculptural library"
              fetchPriority="high"
            />
            <div className="artwork-caption">
              <span>THE PURSUIT OF UNDERSTANDING</span>
              <span>01 / STUDYBUDDY</span>
            </div>
            <div className="hero-art-note">
              <span className="status-dot" /> One idea at a time.
            </div>
          </div>
        </div>
        <div className="home-section-label">
          <span>YOUR LEARNING, CONNECTED</span>
          <span>Courses. Notes. Practice. In one place.</span>
        </div>
        {/* 2. INTERACTIVE AI LEARNING DEMONSTRATION */}
        <div className="relative mt-8 w-full max-w-5xl rounded-3xl bg-gradient-to-b from-indigo-500/30 via-slate-800/40 to-transparent p-1 shadow-2xl">
          <div className="rounded-[22px] border border-slate-800/80 bg-slate-950/95 p-4 backdrop-blur-2xl sm:p-6">
            {/* Top Mock Window Bar */}
            <div className="mb-4 flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-xs text-slate-400">
                  StudyBuddy Classroom • CS-401: Distributed Consensus & State
                  Machines
                </span>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-400">
                <Zap className="h-3 w-3" /> Live Copilot Synchronized
              </span>
            </div>

            {/* Split Screen Simulator */}
            <div className="grid grid-cols-1 gap-6 text-left lg:grid-cols-3">
              {/* Video Player Mockup */}
              <div className="group relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-6 lg:col-span-2">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/40 via-transparent to-cyan-950/20" />
                <div className="relative z-10 flex items-center justify-between text-xs text-slate-400">
                  <span className="rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1">
                    Module 4: Raft vs Paxos Protocols
                  </span>
                  <span>1080p 60fps</span>
                </div>

                <div className="relative z-10 my-auto flex flex-col items-center justify-center py-6">
                  <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-indigo-600/90 shadow-xl shadow-indigo-500/40 transition group-hover:scale-110">
                    <Play className="ml-1 h-7 w-7 fill-white text-white" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-200">
                    Understanding Randomized Heartbeats in Leader Election
                  </p>
                </div>

                <div className="relative z-10 flex items-center justify-between border-t border-slate-800/80 pt-2 text-xs text-slate-400">
                  <span>14:20 / 28:45</span>
                  <div className="flex gap-2">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px]">
                      1.25x
                    </span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px]">
                      CC
                    </span>
                  </div>
                </div>
              </div>

              {/* Embedded Copilot Simulator */}
              <div className="flex flex-col justify-between space-y-3 rounded-2xl border border-slate-800 bg-slate-900/95 p-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">
                      Lecture Copilot
                    </span>
                  </div>
                  <div className="flex gap-1 text-[10px]">
                    {["summary", "quiz"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setCopilotDemoTab(tab)}
                        className={`rounded px-2 py-0.5 capitalize transition ${
                          copilotDemoTab === tab
                            ? "bg-indigo-600 font-bold text-white"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {copilotDemoTab === "summary" ? (
                  <div className="space-y-2 text-xs text-slate-300">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                      Synthesized Takeaways:
                    </p>
                    <ul className="space-y-1.5 text-[11px] text-slate-300">
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                        <span>
                          Leader election uses randomized heartbeat timers to
                          prevent split votes.
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                        <span>
                          Log replication guarantees monotonic matching across
                          quorums.
                        </span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                        <span>
                          Safety invariant ensures committed state machine
                          transitions are immutable.
                        </span>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs text-slate-300">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                      Practice Check (Q1/3):
                    </p>
                    <p className="text-[11px] font-semibold text-white">
                      Why does Raft randomize election timeouts?
                    </p>
                    <div className="space-y-1.5 text-[10px]">
                      <div className="rounded-lg border border-indigo-500 bg-indigo-600/30 p-2 font-medium text-slate-100">
                        ✓ To break split votes among competing candidates
                      </div>
                      <div className="rounded-lg bg-slate-800/40 p-2 text-slate-400">
                        To decrease cluster network bandwidth
                      </div>
                    </div>
                  </div>
                )}

                <Link
                  to="/studio"
                  className="w-full rounded-xl bg-slate-800 py-2 text-center text-xs font-semibold text-cyan-300 transition hover:bg-slate-700"
                >
                  Explore in AI Knowledge Studio →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LEARNING WORKFLOW */}
      <section className="border-t border-slate-800/80 bg-slate-950/60 py-20">
        <div className="mx-auto w-11/12 max-w-7xl space-y-12 text-center">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              The Cognitive Learning Cycle
            </span>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              From Passive Video Watching to Active Retrieval
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-slate-400">
              Traditional courses lose 80% of retention within 48 hours.
              StudyBuddy AI enforces immediate active recall and spaced
              revision.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 text-left md:grid-cols-4">
            {[
              {
                step: "01",
                icon: BookOpen,
                title: "Stream Curriculum",
                desc: "High-definition modular lectures structured into sections and subsections by vetted educators.",
              },
              {
                step: "02",
                icon: Sparkles,
                title: "AI Co-Pilot In-Class",
                desc: "Ask contextual questions, extract code snippets, and review instant takeaways without pausing.",
              },
              {
                step: "03",
                icon: Layers,
                title: "Flashcard Spaced Review",
                desc: "Auto-generate flashcard decks and review them using our adaptive Leitner-style scheduler.",
              },
              {
                step: "04",
                icon: BarChart3,
                title: "Timed Arena & Analytics",
                desc: "Compete against the clock in topic arenas and measure your cognitive retention radar.",
              },
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className="space-y-3 rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-black text-indigo-400/40">
                      {st.step}
                    </span>
                    <Icon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h3 className="text-base font-bold text-white">{st.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-400">
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. AI TUTOR & COPILOT HIGHLIGHT */}
      <section className="mx-auto w-11/12 max-w-7xl py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
              AI Classroom Companion
            </span>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              An Intelligent Co-Pilot Inside Every Video Module
            </h2>
            <p className="text-sm leading-relaxed text-slate-400">
              Never get stuck on complex algorithmic proofs, obscure syntax, or
              distributed systems jargon. Our lecture copilot is context-aware:
              it understands the exact topic being taught and provides
              multimodal study assistance.
            </p>
            <div className="space-y-3">
              {[
                "Context-aware prompt pills for instant Socratic questioning",
                "Instant structured takeaways, detailed notes, and key definitions",
                "Difficulty-rated concept cards with runnable code examples",
                "Auto-generated 5-question multiple choice quizzes with instant scoring",
              ].map((text, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 text-xs text-slate-300"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2 text-xs font-bold text-white">
                <Code2 className="h-4 w-4 text-indigo-400" /> Key Concepts
                Extractor
              </span>
              <span className="font-mono text-[10px] text-emerald-400">
                Active
              </span>
            </div>
            <div className="space-y-3">
              <div className="space-y-1.5 rounded-2xl border border-slate-800/80 bg-slate-950 p-4">
                <span className="text-[10px] font-bold uppercase text-indigo-400">
                  Concept
                </span>
                <h4 className="text-xs font-bold text-white">
                  Split-Brain Scenario in Distributed Clusters
                </h4>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Occurs when network partitions isolate nodes, causing multiple
                  subsets to elect competing leaders and write divergent logs.
                </p>
              </div>
              <div className="space-y-1.5 rounded-2xl border border-slate-800/80 bg-slate-950 p-4">
                <span className="text-[10px] font-bold uppercase text-cyan-400">
                  Resolution
                </span>
                <h4 className="text-xs font-bold text-white">
                  Quorum Majority Rule (N/2 + 1)
                </h4>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  By enforcing that any leader must obtain votes from a strict
                  majority of nodes, overlapping quorums guarantee at most one
                  valid leader.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COURSE ECOSYSTEM */}
      <section className="border-t border-slate-800/80 bg-slate-950/40 py-20">
        <div className="mx-auto w-11/12 max-w-7xl space-y-12">
          <div className="space-y-3 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Curated Masterclasses
            </span>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Industry-Grade Curriculums
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-slate-400">
              Structured paths designed to take software engineers from
              foundational theory to production architecture.
            </p>
          </div>
          <ExploreMore />
        </div>
      </section>

      {/* 6. AI KNOWLEDGE STUDIO SHOWCASE */}
      <section className="mx-auto w-11/12 max-w-7xl py-20">
        <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 via-slate-900/60 to-purple-950/20 p-8 shadow-2xl backdrop-blur-xl sm:p-12">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-400">
                Studio Workspace (/studio)
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                Turn Textbooks, PDFs & Notes Into Cognitive Memory
              </h2>
              <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
                Upload your lecture slides or syllabi. Our multi-agent document
                processor parses chunks, synthesizes flashcards with spaced
                repetition metadata, builds timed quiz arenas, and outlines
                7-day mastery schedules.
              </p>
              <div className="pt-2">
                <Link to="/studio">
                  <button className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-6 py-3 text-xs font-bold text-white shadow-lg transition hover:opacity-95">
                    <span>Enter Knowledge Studio</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <Upload className="h-5 w-5 text-indigo-400" />
                <h4 className="text-xs font-bold text-white">
                  Document Pipeline
                </h4>
                <p className="text-[11px] text-slate-400">
                  Upload PDF & text notes with chunk synthesis.
                </p>
              </div>
              <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <Layers className="h-5 w-5 text-cyan-400" />
                <h4 className="text-xs font-bold text-white">Flashcard Lab</h4>
                <p className="text-[11px] text-slate-400">
                  3D flip animation with spaced recall grading.
                </p>
              </div>
              <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <HelpCircle className="h-5 w-5 text-purple-400" />
                <h4 className="text-xs font-bold text-white">
                  Timed Quiz Arena
                </h4>
                <p className="text-[11px] text-slate-400">
                  Difficulty levels, timers, and answer explanations.
                </p>
              </div>
              <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <BarChart3 className="h-5 w-5 text-emerald-400" />
                <h4 className="text-xs font-bold text-white">
                  Cognitive Radar
                </h4>
                <p className="text-[11px] text-slate-400">
                  Visual analytics tracking concept retention scores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INSTRUCTOR & ARCHITECT TOOLS */}
      <section className="mx-auto w-11/12 max-w-7xl py-12">
        <InstructorSection />
      </section>

      {/* 8. TESTIMONIALS & REVIEWS */}
      <section className="border-t border-slate-800/80 bg-slate-950/60 py-20">
        <div className="mx-auto w-11/12 max-w-7xl space-y-8 text-center">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Real Learner Endorsements
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Trusted by Engineers, Students & Educators
            </h2>
          </div>
          <ReviewSlider />
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section className="mx-auto w-11/12 max-w-4xl space-y-8 py-20">
        <div className="space-y-2 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 transition"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-xs font-bold text-white transition hover:bg-slate-900/80 sm:text-sm"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-cyan-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-slate-800/50 bg-slate-950/40 p-5 pt-0 text-xs leading-relaxed text-slate-400">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="border-t border-slate-800/80 bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950 py-24 text-center">
        <div className="mx-auto w-11/12 max-w-3xl space-y-6">
          <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-400">
            Start Learning Today
          </span>
          <h2 className="text-3xl font-extrabold text-white sm:text-5xl">
            Elevate Your Technical Learning Capacity
          </h2>
          <p className="text-sm leading-relaxed text-slate-400">
            Join the modern learning ecosystem that fuses certified curriculums
            with personalized AI copilots. Get started for free today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/signup">
              <button className="rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-500/25 transition hover:scale-105">
                Create Free Account
              </button>
            </Link>
            <Link to="/studio">
              <button className="rounded-2xl border border-slate-800 bg-slate-900 px-8 py-4 text-sm font-semibold text-slate-200 transition hover:bg-slate-800">
                Open AI Studio
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <Footer />
    </div>
  );
}
