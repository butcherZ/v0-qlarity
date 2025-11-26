import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const repository = searchParams.get("repository")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    let query = supabase.from("coverage_reports").select("*").order("uploaded_at", { ascending: false }).limit(limit)

    if (repository) {
      query = query.eq("repository", repository)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch reports: " + error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      reports: data,
    })
  } catch (error) {
    console.error("[v0] Fetch error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch reports" },
      { status: 500 },
    )
  }
}
