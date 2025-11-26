"use client"

import type React from "react"
import { useState, useRef } from "react"

interface FileUploadProps {
  onUpload: (data: any, repository: string) => void
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError(null)
    setIsUploading(true)

    if (!file.name.endsWith(".json")) {
      setError("Please upload a valid JSON file")
      setIsUploading(false)
      return
    }

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string)

          let repository = "unknown"
          if (jsonData.context?.repository) {
            repository = jsonData.context.repository
          } else if (jsonData.reports?.[0]?.name) {
            repository = jsonData.reports[0].name
          } else if (jsonData.reports?.length === 1) {
            repository = jsonData.reports[0].data?.context?.repository || "merged-report"
          }

          const formData = new FormData()
          formData.append("file", file)
          formData.append("repository", repository)

          const response = await fetch("/api/upload-coverage", {
            method: "POST",
            body: formData,
          })

          const contentType = response.headers.get("content-type")
          if (!contentType?.includes("application/json")) {
            throw new Error("Server error: Invalid response format")
          }

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Upload failed")
          }

          const result = await response.json()
          onUpload(jsonData, repository)
        } catch (err) {
          console.error("[v0] Error:", err)
          setError(err instanceof Error ? err.message : "Invalid JSON file format")
        } finally {
          setIsUploading(false)
        }
      }
      reader.readAsText(file)
    } catch (err) {
      setError("Failed to process file")
      setIsUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {isUploading ? "Uploading..." : "Upload JSON"}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFile(e.target.files[0])
          }
        }}
        disabled={isUploading}
        className="hidden"
      />
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  )
}
