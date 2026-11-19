import { FaStar } from "react-icons/fa"
import { RiDeleteBin6Line } from "react-icons/ri"
import { HiOutlineSparkles } from "react-icons/hi"
import ReactStars from "react-rating-stars-component"
import { useDispatch, useSelector } from "react-redux"

import { removeFromCart } from "../../../../slices/cartSlice"
import generatedCourseArtwork from "../../../../assets/Images/boxoffice.png"

export default function RenderCartCourses() {
  const { cart } = useSelector((state) => state.cart)
  const dispatch = useDispatch()

  return (
    <div className="flex flex-col gap-4">
      {cart.map((course) => (
        <div
          key={course._id}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md hover:border-slate-700 transition-all group"
        >
          <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
            <div className="relative overflow-hidden rounded-xl w-full sm:w-44 aspect-video sm:aspect-auto sm:h-28 flex-shrink-0 bg-slate-800">
              <img
                src={course?.thumbnail || generatedCourseArtwork}
                alt={course?.courseName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-[11px] font-medium text-indigo-300 border border-indigo-500/20 flex items-center gap-1">
                <HiOutlineSparkles className="text-xs" />
                {course?.category?.name || "AI Course"}
              </span>
            </div>

            <div className="flex flex-col justify-between py-0.5 flex-1 min-w-0">
              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                {course?.courseName}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {course?.courseDescription || "Master state-of-the-art concepts with guided practice and intelligent feedback."}
              </p>

              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs font-bold text-amber-400">4.8</span>
                <ReactStars
                  count={5}
                  value={4.8}
                  size={16}
                  edit={false}
                  activeColor="#f59e0b"
                  emptyIcon={<FaStar />}
                  fullIcon={<FaStar />}
                />
                <span className="text-xs text-slate-500">
                  ({course?.studentsEnrolled?.length || 1} learners)
                </span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 block">Price</span>
              <span className="text-2xl font-black text-amber-400 tracking-tight">
                ₹{course?.price || 0}
              </span>
            </div>

            <button
              onClick={() => dispatch(removeFromCart(course._id))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 text-xs font-semibold transition-colors"
              title="Remove from cart"
            >
              <RiDeleteBin6Line className="text-sm" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
