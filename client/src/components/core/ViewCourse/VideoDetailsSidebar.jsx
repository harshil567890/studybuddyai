import { useEffect, useState } from "react"
import { ChevronDown, ChevronLeft, CheckCircle2, PlayCircle, Star } from "lucide-react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"

export default function VideoDetailsSidebar({ setReviewModal }) {
  const [activeStatus, setActiveStatus] = useState("")
  const [videoBarActive, setVideoBarActive] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const { sectionId, subSectionId } = useParams()
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse)

  useEffect(() => {
    ;(() => {
      if (!courseSectionData.length) return
      const currentSectionIndx = courseSectionData.findIndex(
        (data) => data._id === sectionId
      )
      if (currentSectionIndx === -1) return
      const currentSubSectionIndx = courseSectionData?.[
        currentSectionIndx
      ]?.subSection?.findIndex((data) => data._id === subSectionId)
      const activeSubSectionId =
        courseSectionData[currentSectionIndx]?.subSection?.[
          currentSubSectionIndx
        ]?._id
      setActiveStatus(courseSectionData?.[currentSectionIndx]?._id)
      setVideoBarActive(activeSubSectionId)
    })()
  }, [courseSectionData, courseEntireData, location.pathname, sectionId, subSectionId])

  const completionPercent = totalNoOfLectures > 0
    ? Math.round(((completedLectures?.length || 0) / totalNoOfLectures) * 100)
    : 0

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-[300px] lg:w-[330px] shrink-0 flex-col border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">
      {/* Header bar */}
      <div className="flex flex-col gap-3 border-b border-slate-800/80 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/dashboard/enrolled-courses`)}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Back to Courses"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setReviewModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition"
          >
            <Star className="h-3.5 w-3.5 text-amber-400" />
            <span>Rate Course</span>
          </button>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white line-clamp-1">
            {courseEntireData?.courseName || "Course Curriculum"}
          </h2>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Progress: {completionPercent}%</span>
            <span>
              {completedLectures?.length || 0} / {totalNoOfLectures || 0} lectures
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Curriculum Sections List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
        {courseSectionData?.map((section, index) => {
          const isSectionOpen = activeStatus === section._id
          return (
            <div key={section._id || index} className="text-xs">
              {/* Section Header */}
              <button
                type="button"
                onClick={() =>
                  setActiveStatus(isSectionOpen ? "" : section._id)
                }
                className="flex w-full items-center justify-between bg-slate-900/50 px-4 py-3 text-left font-semibold text-slate-200 hover:bg-slate-900/80 transition"
              >
                <span className="truncate pr-2">{section?.sectionName}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                    isSectionOpen ? "rotate-180 text-cyan-400" : ""
                  }`}
                />
              </button>

              {/* Sub-sections / Lectures */}
              {isSectionOpen && (
                <div className="bg-slate-950/60 py-1">
                  {section?.subSection?.map((topic) => {
                    const isCompleted = completedLectures?.includes(topic._id)
                    const isActive = videoBarActive === topic._id

                    return (
                      <div
                        key={topic._id}
                        onClick={() => {
                          navigate(
                            `/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`
                          )
                          setVideoBarActive(topic._id)
                        }}
                        className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition ${
                          isActive
                            ? "bg-indigo-600/20 text-white font-medium border-l-2 border-indigo-500"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                        ) : (
                          <PlayCircle
                            className={`h-4 w-4 shrink-0 ${
                              isActive ? "text-indigo-400" : "text-slate-600"
                            }`}
                          />
                        )}
                        <span className="truncate flex-1">{topic.title}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

