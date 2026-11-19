import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { HiOutlineShieldCheck, HiOutlineSparkles, HiOutlineExclamationCircle } from "react-icons/hi"
import { FiCheckCircle } from "react-icons/fi"
import { toast } from "react-hot-toast"

import { BuyCourse } from "../../../../services/operations/studentFeaturesAPI"

export default function RenderTotalAmount() {
  const { total, cart } = useSelector((state) => state.cart)
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const isStudent = user?.accountType === "Student"

  const handleBuyCourse = () => {
    if (!isStudent) {
      toast.error("Only Student accounts can purchase and enroll in courses. Please log in as a Student.")
      return
    }
    const courses = cart.map((course) => course._id)
    BuyCourse(token, courses, user, navigate, dispatch)
  }

  return (
    <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl space-y-5 sticky top-24">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <HiOutlineSparkles className="text-amber-400" />
          Order Summary
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Instant access to AI course materials</p>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-slate-400">
          <span>Subtotal ({cart.length} item{cart.length > 1 ? "s" : ""})</span>
          <span className="font-semibold text-slate-200">₹{total}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>AI Copilot & Studio Access</span>
          <span className="text-emerald-400 font-medium">Included Free</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Certificate of Completion</span>
          <span className="text-emerald-400 font-medium">Included Free</span>
        </div>
        <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline">
          <span className="text-base font-bold text-white">Total Amount</span>
          <span className="text-3xl font-black text-amber-400">₹{total}</span>
        </div>
      </div>

      {!isStudent && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
          <HiOutlineExclamationCircle className="text-base flex-shrink-0 mt-0.5" />
          <span>Logged in as <strong>{user?.accountType || "Guest"}</strong>. Please log in with a Student account to complete course enrollment.</span>
        </div>
      )}

      <button
        onClick={handleBuyCourse}
        className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
      >
        <span>Enroll & Buy Now</span>
      </button>

      <div className="pt-2 space-y-2 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-2 text-slate-400">
          <HiOutlineShieldCheck className="text-base text-emerald-400 flex-shrink-0" />
          <span>Instant LMS enrollment & lifetime access</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <FiCheckCircle className="text-sm text-indigo-400 flex-shrink-0" />
          <span>Full AI Studio & Quiz Copilot included</span>
        </div>
      </div>
    </div>
  )
}
