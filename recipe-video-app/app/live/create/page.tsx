"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

export default function CreateLiveStreamPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Show loading state while checking auth
  if (status === "loading") {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  // Don't render the form if not authenticated
  if (!session) {
    return null;
  }
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [scheduleNow, setScheduleNow] = useState(true);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      
      // Preview thumbnail
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setThumbnailPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a live stream",
        variant: "destructive",
      });
      return;
    }
    
    if (!title || !description || !category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      let thumbnailUrl = "";
      
      // Upload thumbnail if provided
      if (thumbnailFile) {
        const formData = new FormData();
        formData.append("file", thumbnailFile);
        formData.append("fileType", "image");
        
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error("Failed to upload thumbnail");
        }
        
        const uploadData = await uploadResponse.json();
        thumbnailUrl = uploadData.url;
      }
      
      // Create live stream
      const response = await fetch("/api/live", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
          thumbnailUrl,
          scheduledFor: scheduleNow ? null : scheduledDate,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create live stream");
      }
      
      const data = await response.json();
      
      toast({
        title: "Success",
        description: scheduleNow 
          ? "Your live stream has been created. You can start it now!" 
          : "Your live stream has been scheduled",
      });
      
      // Redirect to the live stream page
      router.push(scheduleNow ? `/live/${data.liveStream._id}/host` : "/live");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create live stream",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
     
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Live Stream</CardTitle>
          <CardDescription>
            Share your cooking skills in real-time with your audience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Stream Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                placeholder="Enter a descriptive title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
              <Textarea
                id="description"
                placeholder="Describe what you'll be cooking and what viewers can expect"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
              <Select value={category} onValueChange={setCategory} disabled={isLoading}>
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
              <Label>Thumbnail Image (Optional)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {thumbnailPreview ? (
                  <div className="space-y-2">
                    <img 
                      src={thumbnailPreview || "/placeholder.svg"} 
                      alt="Thumbnail preview" 
                      className="max-h-40 mx-auto rounded"
                    />
                    <div className="flex justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setThumbnailFile(null);
                          setThumbnailPreview("");
                        }}
                        disabled={isLoading}
                      >
                        Remove Thumbnail
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
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("thumbnail")?.click()}
                      disabled={isLoading}
                    >
                      Select Image
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Schedule</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="scheduleNow"
                  checked={scheduleNow}
                  onChange={() => setScheduleNow(true)}
                  disabled={isLoading}
                />
                <Label htmlFor="scheduleNow">Start immediately</Label>
                
                <input
                  type="radio"
                  id="scheduleLater"
                  checked={!scheduleNow}
                  onChange={() => setScheduleNow(false)}
                  disabled={isLoading}
                />
                <Label htmlFor="scheduleLater">Schedule for later</Label>
              </div>
              
              {!scheduleNow && (
                <Input
                  type="datetime-local"
                  value={scheduledDate?.toISOString().slice(0, 16)}
                  onChange={(e) => setScheduledDate(new Date(e.target.value))}
                  disabled={isLoading}
                  min={new Date().toISOString().slice(0, 16)}
                />
              )}
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Live Stream"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

