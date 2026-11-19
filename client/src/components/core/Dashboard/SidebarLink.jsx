import * as Icons from "react-icons/vsc"
import { useDispatch } from "react-redux"
import { NavLink, matchPath, useLocation } from "react-router-dom"

import { resetCourseState } from "../../../slices/courseSlice"

export default function SidebarLink({ link, iconName }) {
  const Icon = Icons[iconName] || Icons["VscCircleFilled"]
  const location = useLocation()
  const dispatch = useDispatch()

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  const isActive = matchRoute(link.path)

  return (
    <NavLink
      to={link.path}
      onClick={() => dispatch(resetCourseState())}
      className={`relative px-6 py-2.5 text-xs font-semibold flex items-center gap-3 transition-all duration-200 ${
        isActive
          ? "bg-indigo-600/15 text-indigo-300 border-l-2 border-indigo-500 shadow-sm"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
      }`}
    >
      <div className="flex items-center gap-x-2.5">
        <Icon className={`text-base ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
        <span>{link.name}</span>
      </div>
    </NavLink>
  )
}

