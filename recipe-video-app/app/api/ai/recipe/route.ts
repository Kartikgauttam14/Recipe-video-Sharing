import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { query } = await req.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    const systemPrompt = `You are a professional chef specializing in recipe creation. 
    Create a detailed recipe based on the user's query. 
    The recipe should include a title, ingredients list, step-by-step instructions, 
    preparation time, cooking time, and number of servings.
    Format the response as JSON with the following structure:
    {
      "title": "Recipe Title",
      "ingredients": ["ingredient 1", "ingredient 2", ...],
      "instructions": ["step 1", "step 2", ...],
      "prepTime": "X minutes",
      "cookTime": "Y minutes",
      "servings": Z,
      "difficulty": "easy|medium|hard",
      "cuisine": "cuisine type",
      "dietaryInfo": ["vegetarian", "gluten-free", etc.] (if applicable)
    }`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: query,
    })

    // Parse the JSON response
    const recipe = JSON.parse(text)

    return NextResponse.json({ recipe })
  } catch (error) {
    console.error("Error generating recipe:", error)
    return NextResponse.json({ error: "Failed to generate recipe" }, { status: 500 })
  }
}

