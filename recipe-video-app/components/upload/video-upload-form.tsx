"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X, Plus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export default function VideoUploadForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState("")
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("basic")

  // Form fields
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [prepTime, setPrepTime] = useState("")
  const [cookTime, setCookTime] = useState("")
  const [servings, setServings] = useState("")
  const [ingredients, setIngredients] = useState<string[]>([])
  const [ingredientInput, setIngredientInput] = useState("")
  const [instructions, setInstructions] = useState<string[]>([])
  const [instructionInput, setInstructionInput] = useState("")

  const videoInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0])
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0])

      // Preview thumbnail
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setThumbnailUrl(e.target.result as string)
        }
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const addIngredient = () => {
    if (ingredientInput.trim() && !ingredients.includes(ingredientInput.trim())) {
      setIngredients([...ingredients, ingredientInput.trim()])
      setIngredientInput("")
    }
  }

  const removeIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter((ingredient) => ingredient !== ingredientToRemove))
  }

  const addInstruction = () => {
    if (instructionInput.trim()) {
      setInstructions([...instructions, instructionInput.trim()])
      setInstructionInput("")
    }
  }

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index))
  }

  const uploadFile = async (file: File, fileType: string) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("fileType", fileType)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to upload ${fileType}`)
    }

    const data = await response.json()
    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!videoFile) {
      toast({
        title: "Error",
        description: "Please select a video file to upload",
        variant: "destructive",
      })
      return
    }

    if (!title || !description || !category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Upload video
      toast({
        title: "Uploading video",
        description: "Please wait while your video is being uploaded...",
      })

      setUploadProgress(10)
      const videoUploadUrl = await uploadFile(videoFile, "video")
      setVideoUrl(videoUploadUrl)
      setUploadProgress(70)

      // Upload thumbnail if provided
      let thumbnailUploadUrl = ""
      if (thumbnailFile) {
        thumbnailUploadUrl = await uploadFile(thumbnailFile, "image")
        setThumbnailUrl(thumbnailUploadUrl)
      }

      setUploadProgress(90)

      // Create video in database
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          videoUrl: videoUploadUrl,
          thumbnailUrl: thumbnailUploadUrl,
          category,
          tags,
          ingredients,
          instructions,
          prepTime,
          cookTime,
          servings: servings ? Number.parseInt(servings) : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create video")
      }

      setUploadProgress(100)

      toast({
        title: "Success",
        description: "Your video has been uploaded successfully!",
      })

      // Redirect to the video page
      const data = await response.json()
      router.push(`/video/${data.video._id}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Upload Recipe Video</CardTitle>
        <CardDescription>Share your cooking skills with the community</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="recipe">Recipe Details</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-6">
            <TabsContent value="basic" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Recipe Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Enter a descriptive title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isUploading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your recipe, including any tips or variations"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  disabled={isUploading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select value={category} onValueChange={setCategory} disabled={isUploading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="dessert">Dessert</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                    <SelectItem value="beverage">Beverage</SelectItem>
                    <SelectItem value="italian">Italian</SelectItem>
                    <SelectItem value="asian">Asian</SelectItem>
                    <SelectItem value="mexican">Mexican</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="Add tags (e.g., healthy, quick, spicy)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                    disabled={isUploading}
                  />
                  <Button type="button" onClick={addTag} disabled={isUploading || !tagInput.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive"
                          disabled={isUploading}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={() => setActiveTab("recipe")} disabled={isUploading}>
                  Next: Recipe Details
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="recipe" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="prepTime">Prep Time (minutes)</Label>
                  <Input
                    id="prepTime"
                    type="number"
                    min="0"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    disabled={isUploading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cookTime">Cook Time (minutes)</Label>
                  <Input
                    id="cookTime"
                    type="number"
                    min="0"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    disabled={isUploading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="servings">Servings</Label>
                  <Input
                    id="servings"
                    type="number"
                    min="1"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    disabled={isUploading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredients</Label>
                <div className="flex gap-2">
                  <Input
                    id="ingredients"
                    placeholder="Add an ingredient"
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addIngredient()
                      }
                    }}
                    disabled={isUploading}
                  />
                  <Button type="button" onClick={addIngredient} disabled={isUploading || !ingredientInput.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {ingredients.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <Label>Ingredients List:</Label>
                    <ul className="list-disc pl-5 space-y-1">
                      {ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-center justify-between group">
                          <span>{ingredient}</span>
                          <button
                            type="button"
                            onClick={() => removeIngredient(ingredient)}
                            className="opacity-0 group-hover:opacity-100 text-destructive"
                            disabled={isUploading}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <div className="flex gap-2">
                  <Textarea
                    id="instructions"
                    placeholder="Add a step"
                    value={instructionInput}
                    onChange={(e) => setInstructionInput(e.target.value)}
                    disabled={isUploading}
                  />
                  <Button
                    type="button"
                    onClick={addInstruction}
                    className="h-auto"
                    disabled={isUploading || !instructionInput.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {instructions.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <Label>Instructions List:</Label>
                    <ol className="list-decimal pl-5 space-y-2">
                      {instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start justify-between group">
                          <span>{instruction}</span>
                          <button
                            type="button"
                            onClick={() => removeInstruction(index)}
                            className="opacity-0 group-hover:opacity-100 text-destructive mt-1"
                            disabled={isUploading}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab("basic")} disabled={isUploading}>
                  Back: Basic Info
                </Button>
                <Button type="button" onClick={() => setActiveTab("media")} disabled={isUploading}>
                  Next: Media
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <div className="space-y-2">
                <Label>
                  Video File <span className="text-red-500">*</span>
                </Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {videoFile ? (
                    <div className="flex items-center justify-between bg-muted p-2 rounded">
                      <span className="text-sm truncate max-w-[80%]">{videoFile.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setVideoFile(null)}
                        disabled={isUploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-center">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Drag and drop your video file here or click to browse
                      </div>
                      <Input
                        id="video"
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleVideoChange}
                        ref={videoInputRef}
                        disabled={isUploading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => videoInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        Select Video
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Thumbnail Image (Optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {thumbnailFile ? (
                    <div className="space-y-2">
                      <img
                        src={thumbnailUrl || "/placeholder.svg"}
                        alt="Thumbnail preview"
                        className="max-h-40 mx-auto rounded"
                      />
                      <div className="flex items-center justify-between bg-muted p-2 rounded">
                        <span className="text-sm truncate max-w-[80%]">{thumbnailFile.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setThumbnailFile(null)
                            setThumbnailUrl("")
                          }}
                          disabled={isUploading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-center">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Upload a thumbnail image (16:9 ratio recommended)
                      </div>
                      <Input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleThumbnailChange}
                        ref={thumbnailInputRef}
                        disabled={isUploading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => thumbnailInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        Select Image
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab("recipe")} disabled={isUploading}>
                  Back: Recipe Details
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading ({uploadProgress}%)
                    </>
                  ) : (
                    "Upload Recipe Video"
                  )}
                </Button>
              </div>
            </TabsContent>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  )
}

