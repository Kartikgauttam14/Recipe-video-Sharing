"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X } from "lucide-react"

export default function UploadPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0])
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    // Simulate upload delay
    setTimeout(() => {
      setUploading(false)
      alert("Video uploaded successfully!")
      // Reset form or redirect
    }, 2000)
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Upload Recipe Video</CardTitle>
          <CardDescription>Share your cooking skills with the community</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Recipe Title</Label>
              <Input id="title" placeholder="Enter a descriptive title" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your recipe, including any tips or variations"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
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
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="prepTime">Prep Time (minutes)</Label>
                <Input id="prepTime" type="number" min="0" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cookTime">Cook Time (minutes)</Label>
                <Input id="cookTime" type="number" min="0" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="servings">Servings</Label>
                <Input id="servings" type="number" min="1" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Video File</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {videoFile ? (
                  <div className="flex items-center justify-between bg-muted p-2 rounded">
                    <span className="text-sm truncate max-w-[80%]">{videoFile.name}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setVideoFile(null)}>
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
                    <Input id="video" type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
                    <Button type="button" variant="outline" onClick={() => document.getElementById("video")?.click()}>
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
                  <div className="flex items-center justify-between bg-muted p-2 rounded">
                    <span className="text-sm truncate max-w-[80%]">{thumbnailFile.name}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setThumbnailFile(null)}>
                      <X className="h-4 w-4" />
                    </Button>
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
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("thumbnail")?.click()}
                    >
                      Select Image
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Recipe Video"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

