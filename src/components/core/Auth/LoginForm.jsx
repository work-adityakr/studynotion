import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import { login } from "../../../services/operations/authAPI"

function LoginForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [account,setAccount] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

  const { email, password } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    dispatch(login(email, password, navigate))
  }

  return (
    <div>
      <form
      onSubmit={handleOnSubmit}
      className="mt-6 flex w-full flex-col gap-y-4"
    >
      <label className="w-full">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Email Address <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type="text"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          className="form-style w-full"
        />
      </label>
      <label className="relative">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Password <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handleOnChange}
          placeholder="Enter Password"
          className="form-style w-full !pr-10"
        />
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[38px] z-[10] cursor-pointer"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
          )}
        </span>
        <Link to="/forgot-password">
          <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
            Forgot Password
          </p>
        </Link>
      </label>
      <button
        type="submit"
        className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
      >
        Sign In
      </button>
    </form>
<div className="w-full mt-6">
  {!account ? (
    // State 1: Main Login Button
    <button
      onClick={() => setAccount(true)}
      className="flex w-full items-center justify-center gap-x-2 rounded-lg border border-richblack-100 bg-richblack-50 px-[12px] py-[10px] text-richblack-900 font-medium transition-all duration-200 hover:bg-richblack-100 hover:shadow-md active:scale-95"
    >
      <FcGoogle className="text-xl" />
      <span>Login with Google</span>
    </button>
  ) : (
    // State 2: Selection Options (Student vs Instructor)
    <div className="flex w-full animate-in fade-in zoom-in duration-200 gap-x-4">
      <button
        onClick={() => window.open("http://localhost:4000/auth/google?type=Student", "_self")}
        className="flex flex-1 items-center justify-center rounded-lg bg-richblack-900 px-[12px] py-[10px] font-medium text-white transition-all duration-200 hover:bg-richblack-500 hover:shadow-lg active:scale-95"
      >
        Student
      </button>

      <button
        onClick={() => window.open("http://localhost:4000/auth/google?type=Instructor", "_self")}
        className="flex flex-1 items-center justify-center rounded-lg bg-richblack-900 px-[12px] py-[10px] font-medium text-white transition-all duration-200 hover:bg-richblack-500 hover:shadow-lg active:scale-95"
      >
        Instructor
      </button>
      
      {/* Optional: Close button (X) if they want to cancel */}
      <button 
        onClick={() => setAccount(false)}
        className="flex items-center justify-center px-3 text-richblack-400 hover:text-richblack-900"
      >
        ✕
      </button>
    </div>
  )}
</div>
    </div>
    
  )
}


export default LoginForm
