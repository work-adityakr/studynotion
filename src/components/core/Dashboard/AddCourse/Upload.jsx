import { useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"
import { useSelector } from "react-redux"

import "video-react/dist/video-react.css"
import { Player } from "video-react"

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const { course } = useSelector((state) => state.course)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  )
  const [inputKey, setInputKey] = useState(0)
  const inputRef = useRef(null)

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => setPreviewSource(reader.result)
  }

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles?.[0]
    if (file) {
      setSelectedFile(file)
      previewFile(file)
    }
  }

  // ✅ Allow both click + drag
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: video ? { "video/*": [] } : { "image/*": [] },
    multiple: false,
    onDrop,
    noKeyboard: true,
  })

  useEffect(() => {
    register?.(name, { required: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register])

  useEffect(() => {
    setValue?.(name, selectedFile || null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile])

  const handleCancel = (e) => {
    e?.stopPropagation()
    setPreviewSource("")
    setSelectedFile(null)
    setValue?.(name, null)
    setInputKey((k) => k + 1)
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>

      {/* ✅ Dropzone area — click and drag both work */}
      <div
        {...getRootProps({
          className: `${
            isDragActive ? "bg-richblack-600" : "bg-richblack-700"
          } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500 transition-all`,
        })}
      >
        <input key={inputKey} {...getInputProps()} ref={inputRef} />

        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <Player aspectRatio="16:9" playsInline src={previewSource} />
            )}
            {!viewData && (
              <button
                type="button"
                onClick={handleCancel}
                className="mt-3 self-start text-richblack-400 underline"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center p-6 text-center">
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>
            <p className="mt-2 max-w-[260px] text-sm text-richblack-200">
              Drag & drop an {!video ? "image" : "video"}, or{" "}
              <span
                role="button"
                className="font-semibold text-yellow-50 underline"
                onClick={(e) => {
                  e.preventDefault()
                  open() // ✅ now always works
                }}
              >
                Browse
              </span>
            </p>
            <ul className="mt-8 flex list-disc justify-between space-x-12 text-xs text-richblack-200">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024×576</li>
            </ul>
          </div>
        )}
      </div>

      {errors?.[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}
