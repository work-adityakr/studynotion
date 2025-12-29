import { useEffect, useState } from "react"
import { AiOutlineMenu, AiOutlineShoppingCart, AiOutlineClose, AiOutlineHome, AiOutlineLogin } from "react-icons/ai"
import { BsChevronDown, BsChevronUp } from "react-icons/bs"
import { VscDashboard, VscSignOut, VscAccount } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom"

import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiConnector"
import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropdown"

// Usually located in: services/operations/authAPI
import { logout } from "../../services/operations/authAPI"

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)

  // Mobile Menu States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false)

  useEffect(() => {
    ; (async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        setSubLinks(res.data.data)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)
  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    setMobileCatalogOpen(false)
  }

  const handleLogout = () => {
    dispatch(logout(navigate))
    closeMobileMenu()
  }

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${location.pathname !== "/" ? "bg-richblack-800" : ""
        } transition-all duration-200 sticky top-0 z-50`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">

        {/* --- Logo --- */}
        <Link to="/" onClick={closeMobileMenu}>
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>

        {/* --- DESKTOP NAV --- */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                        }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center spinner">Loading...</p>
                        ) : subLinks.length ? (
                          <>
                            {subLinks
                              ?.filter((subLink) => subLink?.courses?.length > 0)
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                        }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* --- DESKTOP ACTIONS --- */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 hover:bg-richblack-700 transition-all duration-200">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 hover:bg-richblack-700 transition-all duration-200">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>

        {/* --- MOBILE MENU BUTTON --- */}
        <button className="mr-4 md:hidden" onClick={toggleMobileMenu}>
          {mobileMenuOpen ?
            <AiOutlineClose fontSize={24} fill="#AFB2BF" /> :
            <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
          }
        </button>
      </div>

      {/* =========================================================
                          MOBILE MENU OVERLAY
         ========================================================= */}
      {mobileMenuOpen && (
        <div className="fixed top-14 left-0 w-full h-[calc(100vh-3.5rem)] z-[1000] bg-richblack-900/95 backdrop-blur-sm overflow-y-auto border-t border-richblack-700 md:hidden pb-10">
          <div className="flex flex-col p-4">

            <div className="flex flex-col border-b border-richblack-700 pb-4">
              {NavbarLinks.map((link, index) => (
                <div key={index}>
                  {link.title === "Catalog" ? (
                    // Mobile Catalog Accordion
                    <div className="flex flex-col">
                      <div
                        className="flex items-center justify-between py-4 cursor-pointer text-richblack-25 hover:text-white"
                        onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)}
                      >
                        <div className="flex items-center gap-3">
                          <VscDashboard /> 
                          <p className="font-medium text-lg">Catalog</p>
                        </div>
                        {mobileCatalogOpen ? <BsChevronUp /> : <BsChevronDown />}
                      </div>
                      {/* Dropdown Content */}
                      {mobileCatalogOpen && (
                        <div className="flex flex-col bg-richblack-800 rounded-lg p-2 ml-4 animate-in slide-in-from-top-2">
                          {loading ? <p className="text-richblack-200 p-2">Loading...</p> :
                            subLinks?.length ? (
                              subLinks.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                  key={i}
                                  onClick={closeMobileMenu}
                                  className="py-3 px-3 text-richblack-300 hover:text-yellow-50 hover:bg-richblack-700 rounded-md transition-all"
                                >
                                  {subLink.name}
                                </Link>
                              ))
                            ) : <p className="text-richblack-200 p-2">No Courses</p>
                          }
                        </div>
                      )}
                    </div>
                  ) : (
                    // Standard Links (Home, About, Contact)
                    <Link
                      to={link?.path}
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-3 py-4 text-lg font-medium border-b border-richblack-800 ${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}
                    >
                      {link.title === "Home" && <AiOutlineHome />}
                      {/* You can map other icons here based on title if you want */}
                      {link.title}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* User Specific Actions */}
            <div className="flex flex-col mt-4 gap-4">
              {token === null ? (
                // Logged OUT View
                <>
                  <Link to="/login" onClick={closeMobileMenu}>
                    <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-richblack-800 border border-richblack-700 px-6 py-3 text-richblack-50 font-medium hover:bg-richblack-700 transition-all">
                      <AiOutlineLogin /> Log In
                    </button>
                  </Link>
                  <Link to="/signup" onClick={closeMobileMenu}>
                    <button className="w-full rounded-lg bg-yellow-50 px-6 py-3 text-richblack-900 font-bold hover:bg-yellow-100 transition-all shadow-md">
                      Sign Up
                    </button>
                  </Link>
                </>
              ) : (
                // Logged IN View
                <>
                  <Link to="/dashboard/my-profile" onClick={closeMobileMenu} className="flex items-center gap-3 py-3 text-richblack-50 text-lg hover:text-yellow-50">
                    <VscAccount className="text-xl" /> My Profile
                  </Link>

                  {user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                    <Link to="/dashboard/cart" onClick={closeMobileMenu} className="flex items-center gap-3 py-3 text-richblack-50 text-lg hover:text-yellow-50">
                      <AiOutlineShoppingCart className="text-xl" />
                      Cart <span className="text-sm bg-richblack-700 px-2 rounded-full text-yellow-50">{totalItems}</span>
                    </Link>
                  )}

                  {/* Logout Button */}
                  <div
                    onClick={handleLogout}
                    className="flex items-center gap-3 py-3 text-pink-200 text-lg cursor-pointer hover:text-pink-50 border-t border-richblack-700 mt-2"
                  >
                    <VscSignOut className="text-xl" /> Logout
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar