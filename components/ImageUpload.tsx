"use client"

import {IKImage, ImageKitProvider, IKUpload} from "imagekitio-next"
import config from "@/lib/config"
import {useRef, useState} from "react"
import Image from "next/image"
import {toast} from "sonner"

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

const ImageUpload = ({
  onFileChange,
}: {
  onFileChange: (filePath: string) => void
}) => {
  const ikUploadRef = useRef(null)
  const [file, setFile] = useState<{filePath: string} | null>(null)

  const onError = (error: any) => {
    console.log(error)
    toast(`Image uploaded failed.Please try again`)
  }
  const onSuccess = (res: any) => {
    setFile(res)
    onFileChange(res.filePath)

    toast(`Image uploaded susccessfully ${res.filePath} uploaded successfully`)
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
        fileName="test-upload.png"
      />

      <button
        className="upload-btn bg-blend-darken"
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

        <p className="text-base text-light-100">Upload a File</p>

        {file && <p className="upload-filename">{file.filePath}</p>}
      </button>

      {file && (
        <IKImage
          alt={file.filePath}
          path={file.filePath}
          width={500}
          height={300}
        />
      )}
    </ImageKitProvider>
  )
}

export default ImageUpload
