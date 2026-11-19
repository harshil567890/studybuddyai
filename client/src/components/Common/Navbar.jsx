import { useEffect, useState } from "react";
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { Sparkles, BrainCircuit } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";

import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropdown";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(res?.data?.data || []);
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
      setLoading(false);
    })();
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <header className="sticky top-0 z-50 flex flex-col border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl transition-all duration-200">
      <div className="flex h-16 w-full items-center justify-center">
        <div className="flex w-11/12 max-w-maxContent items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/30 transition-transform duration-300 group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <BrainCircuit className="h-5 w-5 text-cyan-400 transition-transform duration-300 group-hover:rotate-12" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="flex items-center gap-1 text-lg font-black tracking-tight text-white">
                StudyBuddy{" "}
                <span className="gradient-text font-extrabold">AI</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-x-7 text-sm font-medium text-slate-300">
              {NavbarLinks.map((link, index) => (
                <li key={index}>
                  {link.title === "Catalog" ? (
                    <div
                      tabIndex={0}
                      aria-label="Browse course categories"
                      className="group relative flex cursor-pointer items-center gap-1.5 transition hover:text-white"
                    >
                      <p
                        className={
                          matchRoute("/catalog/:catalogName")
                            ? "font-semibold text-indigo-400"
                            : ""
                        }
                      >
                        {link.title}
                      </p>
                      <BsChevronDown className="text-xs text-slate-400 transition-transform duration-200 group-hover:rotate-180" />

                      {/* Dropdown Menu */}
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[260px] translate-x-[-50%] translate-y-[2.5em] flex-col rounded-2xl border border-slate-800 bg-slate-900/95 p-3 text-slate-200 opacity-0 shadow-2xl backdrop-blur-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-[1.4em] group-hover:opacity-100">
                        {loading ? (
                          <p className="py-2 text-center text-xs text-slate-400">
                            Loading catalog...
                          </p>
                        ) : subLinks.length ? (
                          subLinks.map((subLink, i) => (
                            <Link
                              to={`/catalog/${subLink.name
                                .split(" ")
                                .join("-")
                                .toLowerCase()}`}
                              className="rounded-xl px-3.5 py-2.5 text-xs transition hover:bg-slate-800/80 hover:text-indigo-300"
                              key={i}
                            >
                              <p className="font-semibold">{subLink.name}</p>
                              <p className="line-clamp-1 text-[10px] text-slate-400">
                                {subLink.description}
                              </p>
                            </Link>
                          ))
                        ) : (
                          <p className="py-2 text-center text-xs text-slate-400">
                            Tracks loaded
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={link?.path}
                      className={`flex items-center gap-1.5 transition hover:text-white ${
                        matchRoute(link?.path)
                          ? "font-semibold text-indigo-400"
                          : "text-slate-300"
                      }`}
                    >
                      <span>{link.title}</span>
                      {link.badge && (
                        <span className="flex items-center gap-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                          <Sparkles className="h-2.5 w-2.5" />
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Actions: Cart & Auth */}
          <div className="hidden items-center gap-x-4 md:flex">
            {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
              <Link
                to="/dashboard/cart"
                className="relative p-2 text-slate-300 transition hover:text-white"
              >
                <AiOutlineShoppingCart className="text-xl" />
                {totalItems > 0 && (
                  <span className="absolute right-0 top-0 grid h-4 w-4 place-items-center rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-[10px] font-bold text-white shadow-md">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {token === null && (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <button className="rounded-xl border border-slate-700/80 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 hover:text-white">
                    Sign In
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition hover:scale-[1.02] active:scale-[0.98]">
                    Get Started
                  </button>
                </Link>
              </div>
            )}

            {token !== null && <ProfileDropdown />}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-slate-300 hover:text-white md:hidden"
          >
            {mobileMenuOpen ? (
              <AiOutlineClose fontSize={22} />
            ) : (
              <AiOutlineMenu fontSize={22} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="animate-fadeIn border-t border-slate-800 bg-slate-950/95 px-6 py-5 backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-4">
            {NavbarLinks.map((link, idx) => (
              <div key={idx} className="flex flex-col">
                {link.title === "Catalog" ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Catalog Tracks
                    </p>
                    <div className="flex flex-col gap-1.5 pl-2">
                      {subLinks.map((sub, i) => (
                        <Link
                          key={i}
                          to={`/catalog/${sub.name
                            .split(" ")
                            .join("-")
                            .toLowerCase()}`}
                          className="text-sm text-slate-300 transition hover:text-cyan-400"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className="flex items-center justify-between py-1 text-sm font-medium text-slate-200 transition hover:text-cyan-400"
                  >
                    <span>{link.title}</span>
                    {link.badge && (
                      <span className="flex items-center gap-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                        <Sparkles className="h-2.5 w-2.5" />
                        {link.badge}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}

            <hr className="border-slate-800" />

            {/* Mobile Auth Actions */}
            {token === null ? (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" className="w-full">
                  <button className="w-full rounded-xl border border-slate-700 bg-slate-900/80 py-2.5 text-xs font-semibold text-slate-200">
                    Sign In
                  </button>
                </Link>
                <Link to="/signup" className="w-full">
                  <button className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25">
                    Get Started Free
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/dashboard/my-profile"
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200"
                >
                  Go to Command Center
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
