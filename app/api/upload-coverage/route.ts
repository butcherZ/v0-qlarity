import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const repository = formData.get("repository") as string

    if (!file || !repository) {
      return NextResponse.json({ error: "File and repository name are required" }, { status: 400 })
    }

    if (!file.name.endsWith(".json")) {
      return NextResponse.json({ error: "Only JSON files are allowed" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const jsonContent = JSON.parse(Buffer.from(buffer).toString("utf-8"))

    const filename = `${repository.replace(/[^a-z0-9-]/gi, "-")}.json`

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("coverage_reports")
      .insert({
        repository,
        filename,
        data: jsonContent,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ error: "Failed to save to database: " + error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      filename,
      repository,
      data: jsonContent,
      id: data.id,
      message: "Coverage report saved successfully to Supabase",
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file" },
      { status: 500 },
    )
  }
}
