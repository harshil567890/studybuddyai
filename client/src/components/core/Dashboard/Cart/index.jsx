import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { HiOutlineShoppingCart } from "react-icons/hi"
import { FiArrowRight } from "react-icons/fi"

import RenderCartCourses from "./RenderCartCourses"
import RenderTotalAmount from "./RenderTotalAmount"

export default function Cart() {
  const { total, totalItems } = useSelector((state) => state.cart)
  const { paymentLoading } = useSelector((state) => state.course)

  if (paymentLoading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    )

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 md:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <HiOutlineShoppingCart className="text-2xl" />
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Shopping Cart</h1>
          </div>
          <p className="mt-1 text-sm text-slate-400">Review your selected courses and proceed to enrollment</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {totalItems} {totalItems === 1 ? "Course" : "Courses"}
          </span>
        </div>
      </div>

      {total > 0 ? (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <RenderCartCourses />
          </div>
          <div className="lg:col-span-1">
            <RenderTotalAmount />
          </div>
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 shadow-inner">
            <HiOutlineShoppingCart className="text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Your Cart is Currently Empty</h2>
          <p className="text-slate-400 max-w-md mb-8">
            Looks like you haven't added any courses to your cart yet. Explore our top-rated AI-powered courses to advance your skills.
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <span>Explore Catalog</span>
            <FiArrowRight className="text-base" />
          </Link>
        </div>
      )}
    </div>
  )
}
