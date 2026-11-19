import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  RotateCcw,
  BookOpen
} from "lucide-react"

import "video-react/dist/video-react.css"
import { BigPlayButton, Player } from "video-react"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import IconBtn from "../../Common/IconBtn"

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const playerRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState(null)
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (!courseSectionData.length) return
      if (!courseId && !sectionId && !subSectionId) {
        navigate(`/dashboard/enrolled-courses`)
      } else {
        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId
        )
        const filteredVideoData = filteredData?.[0]?.subSection.filter(
          (data) => data._id === subSectionId
        )
        setVideoData(filteredVideoData?.[0] || null)
        setPreviewSource(courseEntireData?.thumbnail || "")
        setVideoEnded(false)
      }
    })()
  }, [courseSectionData, courseEntireData, location.pathname, courseId, sectionId, subSectionId, navigate])

  // check if the lecture is the first video of the course
  const isFirstVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    if (currentSectionIndx === -1 || !courseSectionData[currentSectionIndx]?.subSection) return true

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    return currentSectionIndx === 0 && currentSubSectionIndx === 0
  }

  // go to the next video
  const goToNextVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    if (currentSectionIndx === -1) return

    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx + 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      )
    } else if (currentSectionIndx + 1 < courseSectionData.length) {
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id
      const nextSubSectionId =
        courseSectionData[currentSectionIndx + 1].subSection[0]._id
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      )
    }
  }

  // check if the lecture is the last video of the course
  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    if (currentSectionIndx === -1 || !courseSectionData[currentSectionIndx]?.subSection) return true

    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    return (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    )
  }

  // go to the previous video
  const goToPrevVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    if (currentSectionIndx === -1) return

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      )
    } else if (currentSectionIndx > 0) {
      const prevSectionId = courseSectionData[currentSectionIndx - 1]._id
      const prevSubSectionLength =
        courseSectionData[currentSectionIndx - 1].subSection.length
      const prevSubSectionId =
        courseSectionData[currentSectionIndx - 1].subSection[
          prevSubSectionLength - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      )
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    )
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }

  const isCompleted = completedLectures?.includes(subSectionId)

  return (
    <div className="flex flex-col gap-6 text-white pb-12">
      {/* Video Container */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
        {!videoData ? (
          <div className="aspect-video w-full flex items-center justify-center bg-slate-900">
            {previewSource ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-center text-slate-500">
                <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select a lecture to begin streaming</p>
              </div>
            )}
          </div>
        ) : (
          <Player
            ref={playerRef}
            aspectRatio="16:9"
            playsInline
            onEnded={() => setVideoEnded(true)}
            src={videoData?.videoUrl}
          >
            <BigPlayButton position="center" />
            {videoEnded && (
              <div
                style={{
                  backgroundImage:
                    "linear-gradient(to top, rgba(6, 9, 17, 0.95), rgba(6, 9, 17, 0.8), rgba(6, 9, 17, 0.5))",
                }}
                className="absolute inset-0 z-[100] flex flex-col items-center justify-center gap-4 font-inter backdrop-blur-sm"
              >
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1 border border-emerald-500/30">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-white">Lecture Completed!</h3>
                <div className="flex items-center gap-3 mt-2">
                  {!isCompleted && (
                    <IconBtn
                      disabled={loading}
                      onclick={() => handleLectureCompletion()}
                      text={!loading ? "Mark Completed" : "Saving..."}
                      customClasses="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl shadow-lg"
                    />
                  )}
                  <button
                    disabled={loading}
                    onClick={() => {
                      if (playerRef?.current) {
                        playerRef?.current?.seek(0)
                        setVideoEnded(false)
                      }
                    }}
                    className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Rewatch
                  </button>
                  {!isLastVideo() && (
                    <button
                      disabled={loading}
                      onClick={goToNextVideo}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition"
                    >
                      Next Lecture
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </Player>
        )}
      </div>

      {/* Primary Lecture Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            disabled={isFirstVideo() || loading}
            onClick={goToPrevVideo}
            className={`flex items-center gap-1.5 rounded-xl border border-slate-800 px-3.5 py-2 text-xs font-semibold transition ${
              isFirstVideo()
                ? "opacity-40 cursor-not-allowed bg-slate-900 text-slate-500"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <button
            disabled={isLastVideo() || loading}
            onClick={goToNextVideo}
            className={`flex items-center gap-1.5 rounded-xl border border-slate-800 px-3.5 py-2 text-xs font-semibold transition ${
              isLastVideo()
                ? "opacity-40 cursor-not-allowed bg-slate-900 text-slate-500"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={loading}
            onClick={handleLectureCompletion}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shadow-sm ${
              isCompleted
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/20 hover:opacity-95"
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isCompleted ? "Completed" : "Mark as Completed"}</span>
          </button>
        </div>
      </div>

      {/* Lecture Metadata & Overview */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-6 backdrop-blur-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              {courseEntireData?.courseName || "Course"}
            </span>
            <h1 className="mt-1 text-2xl font-bold text-white">
              {videoData?.title || "Active Lecture"}
            </h1>
          </div>
          {videoData?.timeDuration && (
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-3 py-1.5 text-xs text-slate-300">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>{videoData.timeDuration} min</span>
            </div>
          )}
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Module Description
          </h4>
          <p className="text-sm leading-relaxed text-slate-300">
            {videoData?.description || "In this module, examine the key principles, code structures, and practical application covered by the instructor."}
          </p>
        </div>
      </div>
    </div>
  )
}

export default VideoDetails

