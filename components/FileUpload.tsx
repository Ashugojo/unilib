"use client"

import {IKImage, ImageKitProvider, IKUpload, IKVideo} from "imagekitio-next"
import config from "@/lib/config"
import {useRef, useState} from "react"
import Image from "next/image"
import {toast} from "sonner"
import {cn} from "@/lib/utils"

const {
  env: {
    imagekit: {publicKey, urlEndpoint},
  },
} = config

const authenticator = async () => {
  try {
    const responce = await fetch(`${config.env.apiEndPoint}/api/auth/imagekit`)

    if (!responce.ok) {
      const errorText = await responce.text()

      throw new Error(
        `Request failed with status ${responce.status} : ${errorText}`
      )
    }

    const data = await responce.json()
    const {signature, expire, token} = data

    return {token, expire, signature}
  } catch (error: any) {
    throw new Error(`Authentication requent failed: ${error.message}`)
  }
}

interface Props {
  type: "image" | "video"
  accept: string
  placeholder: string
  folder: string
  varient: "dark" | "light"
  onFileChange: (filePath: string) => void
  value?: string
}

const ImageUpload = ({
  type,
  accept,
  placeholder,
  folder,
  varient,
  onFileChange,
  value,
}: Props) => {
  const ikUploadRef = useRef(null)
  const [file, setFile] = useState<{filePath: string | null} | null>({
    filePath: value ?? null,
  })

  const [progress, setProgress] = useState(0)

  const styles = {
    button:
      varient === "dark"
        ? "bg-dark-300"
        : "bg-light-600 border-gray-100 border",
    placeholder: varient === "dark" ? "text-light-100" : "text-slate-500",
    text: varient === "dark" ? "text-light-100" : "text-dark-400",
  }

  const onError = (error: any) => {
    console.log(error)

    toast(`${type} upload failed. Please try again.`)
  }

  const onSuccess = (res: any) => {
    setFile(res)
    onFileChange(res.filePath)

    toast(`${type} uploaded successfully: ${res.filePath}`)
  }

  const onValidate = (file: File) => {
    if (type === "image") {
      if (file.size > 20 * 1024 * 1024) {
        toast("Please upload an image less than 20MB")

        return false
      }
    } else if (type === "video") {
      if (file.size > 50 * 1024 * 1024) {
        toast("Please upload a video less than 50MB")
        return false
      }
    }

    return true
  }

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        className="hidden"
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        validateFile={onValidate}
        onUploadStart={() => setProgress(0)}
        onUploadProgress={({loaded, total}) => {
          const percent = Math.round((loaded / total) * 100)
          console.log("Upload progress:", percent)
          setProgress(percent)
        }}
        folder={folder}
        accept={accept}
      />

      <button
        className={cn("upload-btn", styles.button)}
        onClick={(e) => {
          e.preventDefault()

          if (ikUploadRef.current) {
            // @ts-ignore
            ikUploadRef.current?.click()
          }
        }}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />

        <p className={cn("text-base", styles.placeholder)}>{placeholder}</p>

        {file && (
          <p className={cn("upload-filename", styles.text)}>{file.filePath}</p>
        )}
      </button>

      {progress > 0 && progress !== 100 && (
        <div className="w-full mt-2 h-4 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-green-500 text-white text-xs flex items-center justify-center transition-all duration-200 ease-in-out"
            style={{width: `${progress}%`}}
          >
            {progress}%
          </div>
        </div>
      )}

      {file &&
        (type === "image" ? (
          <IKImage
            alt={file.filePath}
            path={file.filePath}
            width={500}
            height={300}
          />
        ) : type === "video" ? (
          <IKVideo
            path={file.filePath}
            controls={true}
            className="h-96 w-full rounded-xl"
          />
        ) : null)}
    </ImageKitProvider>
  )
}

export default ImageUpload
