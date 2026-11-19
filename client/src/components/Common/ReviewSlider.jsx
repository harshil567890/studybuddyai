import React, { useEffect, useState } from "react"
import "../../App.css"
import { FaStar } from "react-icons/fa"
import { apiConnector } from "../../services/apiConnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    ;(async () => {
      const { data } = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      )
      if (data?.success) {
        setReviews(data?.data)
      }
    })()
  }, [])

  // console.log(reviews)

  const defaultReviews = [
    {
      user: {
        firstName: "Aarav",
        lastName: "Sharma",
        image: "https://api.dicebear.com/7.x/initials/svg?seed=Aarav%20Sharma",
      },
      course: { courseName: "Distributed Consensus & Raft" },
      review: "The in-lecture AI copilot made grasping Raft leader election and log replication remarkably intuitive. Being able to practice quizzes immediately after each section changed my retention completely.",
      rating: 5,
    },
    {
      user: {
        firstName: "Sophia",
        lastName: "Chen",
        image: "https://api.dicebear.com/7.x/initials/svg?seed=Sophia%20Chen",
      },
      course: { courseName: "Full Stack Next.js & AI" },
      review: "The AI Knowledge Studio document-to-flashcards feature saved me dozens of hours studying systems design. Truly an enterprise-grade learning platform.",
      rating: 5,
    },
    {
      user: {
        firstName: "Marcus",
        lastName: "Vance",
        image: "https://api.dicebear.com/7.x/initials/svg?seed=Marcus%20Vance",
      },
      course: { courseName: "Advanced Cloud Architecture" },
      review: "The split-screen classroom player is smooth and fast. The AI concept extraction cards gave me exact summaries with zero friction.",
      rating: 4.8,
    },
    {
      user: {
        firstName: "Priya",
        lastName: "Patel",
        image: "https://api.dicebear.com/7.x/initials/svg?seed=Priya%20Patel",
      },
      course: { courseName: "Data Structures & Algorithms" },
      review: "As an educator, the AI Course Architect cut down curriculum structuring time by 80%. My students love the interactive practice checks.",
      rating: 5,
    },
  ];

  const displayReviews = reviews && reviews.length > 0 ? reviews : defaultReviews;

  return (
    <div className="w-full">
      <div className="my-8 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayReviews.map((review, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-xl transition hover:border-slate-700 hover:bg-slate-900/70"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      review?.user?.image ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${review?.user?.firstName || 'Learner'}`
                    }
                    alt={review?.user?.firstName}
                    className="h-10 w-10 rounded-full border border-indigo-500/30 object-cover"
                  />
                  <div className="flex flex-col min-w-0">
                    <h3 className="font-bold text-sm text-white truncate">
                      {`${review?.user?.firstName || 'Learner'} ${review?.user?.lastName || ''}`}
                    </h3>
                    <p className="text-xs text-indigo-400 truncate">
                      {review?.course?.courseName || "Cognitive Learner"}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "{review?.review}"
                </p>
              </div>

              <div className="flex items-center gap-2 pt-4 mt-2 border-t border-slate-800/80">
                <span className="font-bold text-xs text-amber-400">
                  {(Number(review.rating) || 5).toFixed(1)}
                </span>
                <div className="flex text-amber-400 text-xs">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <FaStar
                      key={idx}
                      className={
                        idx < Math.round(Number(review.rating) || 5)
                          ? "text-amber-400"
                          : "text-slate-600"
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReviewSlider
