"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, ChefHat } from "lucide-react"

export default function AIRecipeGenerator() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [recipe, setRecipe] = useState<null | {
    title: string
    ingredients: string[]
    instructions: string[]
    prepTime: string
    cookTime: string
    servings: number
  }>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)

    // Simulate API call to AI service
    setTimeout(() => {
      // Mock response
      setRecipe({
        title: `${query.charAt(0).toUpperCase() + query.slice(1)} Special Recipe`,
        ingredients: [
          "2 cups of main ingredient",
          "1 tablespoon olive oil",
          "2 cloves garlic, minced",
          "1 onion, diced",
          "Salt and pepper to taste",
          "Fresh herbs for garnish",
        ],
        instructions: [
          "Prepare all ingredients by washing and chopping as needed.",
          "Heat olive oil in a large pan over medium heat.",
          "Add onions and garlic, sauté until translucent.",
          "Add main ingredients and cook for 10-15 minutes.",
          "Season with salt and pepper to taste.",
          "Garnish with fresh herbs before serving.",
        ],
        prepTime: "15 minutes",
        cookTime: "25 minutes",
        servings: 4,
      })
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <Input
          placeholder="Enter ingredients or dietary preferences..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating
            </>
          ) : (
            <>
              <ChefHat className="mr-2 h-4 w-4" />
              Generate Recipe
            </>
          )}
        </Button>
      </form>

      {recipe && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-2xl font-bold mb-4">{recipe.title}</h3>

            <div className="flex flex-wrap gap-4 mb-6 text-sm">
              <div className="bg-muted px-3 py-1 rounded-full">Prep: {recipe.prepTime}</div>
              <div className="bg-muted px-3 py-1 rounded-full">Cook: {recipe.cookTime}</div>
              <div className="bg-muted px-3 py-1 rounded-full">Servings: {recipe.servings}</div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-lg mb-2">Ingredients</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-2">Instructions</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  {recipe.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

