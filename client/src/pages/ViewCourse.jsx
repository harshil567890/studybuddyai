import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { Sparkles, PanelRightClose, PanelRightOpen } from "lucide-react";

import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal";
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar";
import AILectureCopilot from "../components/core/ViewCourse/AILectureCopilot";
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice";

export default function ViewCourse() {
  const { courseId, sectionId, subSectionId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const { courseEntireData, courseSectionData } = useSelector((state) => state.viewCourse);
  const dispatch = useDispatch();
  const [reviewModal, setReviewModal] = useState(false);
  const [showCopilot, setShowCopilot] = useState(true);

  useEffect(() => {
    (async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token);
      if (courseData?.courseDetails) {
        dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
        dispatch(setEntireCourseData(courseData.courseDetails));
        dispatch(setCompletedLectures(courseData.completedVideos));
        let lectures = 0;
        courseData?.courseDetails?.courseContent?.forEach((sec) => {
          lectures += sec.subSection.length;
        });
        dispatch(setTotalNoOfLectures(lectures));
      }
    })();
  }, [courseId, token, dispatch]);

  // Find active subsection and section
  const currentSection = courseSectionData?.find((s) => s._id === sectionId);
  const currentSubSection = currentSection?.subSection?.find((sub) => sub._id === subSectionId);

  return (
    <>
      <div className="relative flex h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-[#060911]">
        {/* Navigation Sidebar */}
        <VideoDetailsSidebar setReviewModal={setReviewModal} />

        {/* Video Player & Lecture Center Area */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-950/40">
          {/* Top Classroom Bar */}
          <div className="flex items-center justify-between border-b border-slate-800/70 bg-slate-900/30 px-6 py-2.5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-300 truncate max-w-md">
                {courseEntireData?.courseName} &gt; {currentSubSection?.title || "Classroom Player"}
              </span>
            </div>

            <button
              onClick={() => setShowCopilot(!showCopilot)}
              className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-sm ${
                showCopilot
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/25 hover:opacity-95"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{showCopilot ? "Hide Copilot" : "AI Copilot"}</span>
              {showCopilot ? (
                <PanelRightClose className="h-3.5 w-3.5 ml-1 opacity-70" />
              ) : (
                <PanelRightOpen className="h-3.5 w-3.5 ml-1 opacity-70" />
              )}
            </button>
          </div>

          <div className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full">
            <Outlet />
          </div>
        </div>

        {/* Embedded AI Lecture Copilot Dock */}
        {showCopilot && (
          <div className="w-full md:w-[460px] lg:w-[500px] xl:w-[540px] h-full shrink-0 border-l border-slate-800/80 p-3 bg-slate-950/90 flex flex-col z-10 transition-all duration-300">
            <AILectureCopilot
              currentSection={currentSection}
              currentSubSection={currentSubSection}
              courseName={courseEntireData?.courseName || "Course Lecture"}
            />
          </div>
        )}
      </div>
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  );
}

