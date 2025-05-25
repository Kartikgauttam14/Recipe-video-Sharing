"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

interface VideoInfoProps {
  title: string
  description: string
  author: {
    id: string
    name: string
    avatar?: string
    subscribers: number
  }
  category: string
  tags: string[]
  ingredients?: string[]
  instructions?: string[]
  prepTime?: string
  cookTime?: string
  servings?: number
}

export default function VideoInfo({
  title,
  description,
  author,
  category,
  tags,
  ingredients,
  instructions,
  prepTime,
  cookTime,
  servings,
}: VideoInfoProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would call an API endpoint
      // const response = await fetch(`/api/users/${author.id}/subscribe`, {
      //   method: "POST",
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to subscribe");
      // }

      // const data = await response.json();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setIsSubscribed(!isSubscribed)

      toast({
        title: isSubscribed ? "Unsubscribed" : "Subscribed",
        description: isSubscribed
          ? `You have unsubscribed from ${author.name}`
          : `You have subscribed to ${author.name}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe/unsubscribe",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <Link href={`/profile/${author.id}`} className="font-medium hover:text-primary">
              {author.name}
            </Link>
            <div className="text-sm text-muted-foreground">{author.subscribers.toLocaleString()} subscribers</div>
          </div>
        </div>
        <Button onClick={handleSubscribe} disabled={isLoading} variant={isSubscribed ? "outline" : "default"}>
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </Button>
      </div>

      <Tabs defaultValue="description">
        <TabsList className="w-full">
          <TabsTrigger value="description" className="flex-1">
            Description
          </TabsTrigger>
          <TabsTrigger value="ingredients" className="flex-1">
            Ingredients
          </TabsTrigger>
          <TabsTrigger value="instructions" className="flex-1">
            Instructions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge>{category}</Badge>
              {tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
              {prepTime && <Badge variant="outline">Prep: {prepTime}</Badge>}
              {cookTime && <Badge variant="outline">Cook: {cookTime}</Badge>}
              {servings && <Badge variant="outline">Servings: {servings}</Badge>}
            </div>
            <p className="whitespace-pre-line">{description}</p>
          </div>
        </TabsContent>

        <TabsContent value="ingredients" className="mt-4">
          <div className="bg-muted/50 rounded-lg p-4">
            {ingredients && ingredients.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No ingredients listed for this recipe.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="instructions" className="mt-4">
          <div className="bg-muted/50 rounded-lg p-4">
            {instructions && instructions.length > 0 ? (
              <ol className="list-decimal pl-5 space-y-2">
                {instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            ) : (
              <p className="text-muted-foreground">No instructions listed for this recipe.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

