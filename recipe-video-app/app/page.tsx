import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import FeaturedVideos from "@/components/featured-videos"
import TrendingRecipes from "@/components/trending-recipes"
import RecentUploads from "@/components/recent-uploads"
import AIRecipeGenerator from "@/components/ai-recipe-generator"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Share Your Culinary Journey</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload, discover, and learn from cooking videos shared by food enthusiasts around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild>
              <Link href="/upload">Upload Recipe</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/browse">
                <Search className="mr-2 h-4 w-4" />
                Browse Recipes
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <FeaturedVideos />
      <TrendingRecipes />
      <RecentUploads />

      <section className="py-12 bg-muted rounded-lg my-12 p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Generate Recipes with AI</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Not sure what to cook? Let our AI suggest recipes based on ingredients you have or dietary preferences.
          </p>
        </div>
        <AIRecipeGenerator />
      </section>
    </div>
  )
}

