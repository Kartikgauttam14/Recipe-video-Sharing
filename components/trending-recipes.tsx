import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Clock, Flame, Heart } from "lucide-react"

// Mock data for trending recipes
const trendingRecipes = [
  {
    id: "1",
    title: "Korean Fried Chicken",
    category: "Asian",
    difficulty: "Medium",
    time: "45 min",
    likes: 1243,
    thumbnail: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "2",
    title: "Avocado Toast Variations",
    category: "Breakfast",
    difficulty: "Easy",
    time: "15 min",
    likes: 982,
    thumbnail: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "3",
    title: "Homemade Ramen Bowl",
    category: "Asian",
    difficulty: "Hard",
    time: "2 hrs",
    likes: 1567,
    thumbnail: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "4",
    title: "Mediterranean Salad",
    category: "Healthy",
    difficulty: "Easy",
    time: "20 min",
    likes: 754,
    thumbnail: "/placeholder.svg?height=400&width=600",
  },
]

export default function TrendingRecipes() {
  return (
    <section className="py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Trending Recipes</h2>
          <Flame className="h-5 w-5 text-red-500" />
        </div>
        <Link href="/trending" className="text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trendingRecipes.map((recipe) => (
          <Link href={`/recipe/${recipe.id}`} key={recipe.id}>
            <Card className="overflow-hidden transition-all hover:shadow-lg h-full">
              <div className="relative h-48">
                <img
                  src={recipe.thumbnail || "/placeholder.svg"}
                  alt={recipe.title}
                  className="object-cover w-full h-full"
                />
                <Badge className="absolute top-2 right-2" variant="secondary">
                  {recipe.category}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{recipe.title}</h3>
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>{recipe.likes}</span>
                  </div>
                </div>
                <Badge variant="outline" className="mt-3">
                  {recipe.difficulty}
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

