import { useState } from "react"
import { VscSignOut, VscChevronRight, VscChevronLeft } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { sidebarLinks } from "../../../data/dashboard-links"
import { logout } from "../../../services/operations/authAPI"
import ConfirmationModal from "../../Common/ConfirmationModal"
import SidebarLink from "./SidebarLink"

export default function Sidebar() {
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  )
  const { loading: authLoading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // State for Confirmation Modal
  const [confirmationModal, setConfirmationModal] = useState(null)
  
  // State for Mobile Sidebar toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
      {/* ========================================
        MOBILE TOGGLE BUTTON 
        ======================================== 
      */}
      <div 
        className="md:hidden fixed right-4 top-20 z-[60] rounded-full bg-richblack-700 p-2 text-richblack-25 shadow-lg shadow-richblack-900 border border-richblack-600 cursor-pointer hover:scale-110 transition-all"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
         {isMobileMenuOpen ? <VscChevronRight className="text-xl"/> : <VscChevronLeft className="text-xl"/>}
      </div>


      {/* ========================================
        MOBILE BACKDROP 
        ======================================== 
      */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[40] bg-richblack-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}


      {/* ========================================
        MAIN SIDEBAR CONTAINER
        ======================================== 
      */}
      <div className={`
        flex h-[calc(100vh-3.5rem)] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10
        transition-all duration-300 ease-in-out
        
        /* Desktop Styles (Default) */
        min-w-[220px] 
        
        /* Mobile Styles (Fixed overlay) */
        md:static md:translate-x-0 
        fixed left-0 top-[3.5rem] z-[50] w-[220px]
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        
        <div className="flex flex-col">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null
            return (
              <div key={link.id} onClick={() => setIsMobileMenuOpen(false)}>
                <SidebarLink link={link} iconName={link.icon} />
              </div>
            )
          })}
        </div>

        <div className="mx-auto  mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />

        <div className="flex flex-col">
          <div onClick={() => setIsMobileMenuOpen(false)}>
            <SidebarLink
              link={{ name: "Settings", path: "/dashboard/settings" }}
              iconName="VscSettingsGear"
            />
          </div>

          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="py-2 text-sm font-medium text-richblack-300 transition-all duration-200 hover:text-richblack-25"
          >
            <div className="flex items-center gap-x-2">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>
      
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}