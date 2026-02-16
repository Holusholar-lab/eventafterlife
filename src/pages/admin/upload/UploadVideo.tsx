import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createAdminVideo } from "@/lib/admin-videos";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  duration: z.string().optional(),
  videoUrl: z.string().min(1, "Video URL is required"),
  thumbnailUrl: z.string().optional(),
  price24h: z.number().min(0, "Price must be 0 or greater").default(0),
  price48h: z.number().min(0, "Price must be 0 or greater").default(0),
  price72h: z.number().min(0, "Price must be 0 or greater").default(0),
  isPublic: z.boolean().default(true),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const UploadVideo = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      duration: "",
      videoUrl: "",
      thumbnailUrl: "",
      price24h: 2.99,
      price48h: 4.99,
      price72h: 6.99,
      isPublic: true,
      isActive: true,
    },
  });

  // Convert file to base64 for storage
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 500MB for video)
      const maxSize = 500 * 1024 * 1024; // 500MB
      if (file.size > maxSize) {
        toast.error("Video file is too large. Maximum size is 500MB.");
        return;
      }

      setVideoFile(file);
      try {
        // Convert to base64 for storage
        const base64 = await fileToBase64(file);
        form.setValue("videoUrl", base64);
        toast.success("Video file loaded successfully");
      } catch (error) {
        toast.error("Failed to process video file");
        console.error(error);
      }
    }
  };

  const handleThumbnailFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB for image)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error("Thumbnail image is too large. Maximum size is 10MB.");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file for the thumbnail");
        return;
      }

      setThumbnailFile(file);
      try {
        // Convert to base64 for storage
        const base64 = await fileToBase64(file);
        form.setValue("thumbnailUrl", base64);
        toast.success("Thumbnail image loaded successfully");
      } catch (error) {
        toast.error("Failed to process thumbnail image");
        console.error(error);
      }
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await createAdminVideo({
        title: data.title,
        description: data.description,
        category: data.category,
        duration: data.duration || "0 min",
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl || "",
        price24h: data.price24h,
        price48h: data.price48h,
        price72h: data.price72h,
        isPublic: data.category === "Public" || data.isPublic,
        isActive: data.isActive,
      });

      toast.success("Video uploaded successfully!");
      form.reset();
      setVideoFile(null);
      setThumbnailFile(null);
      navigate("/admin/videos");
    } catch (error) {
      toast.error("Failed to upload video");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Video</h1>
        <p className="text-gray-600">Add a new video to your library.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* Video Upload Zone */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Video source</CardTitle>
              <CardDescription className="text-gray-600">
                Add a video by pasting a URL (Google Drive, YouTube, Vimeo, or direct link) or by uploading a file.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Video URL or file</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {/* URL input first for clarity */}
                        <div className="space-y-2">
                          <Input
                            placeholder="Paste video URL: Google Drive, YouTube, Vimeo, or direct .mp4 link"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              if (e.target.value) {
                                setVideoFile(null);
                              }
                            }}
                            className="border-gray-300"
                          />
                          <p className="text-xs text-gray-500">
                            <strong>Google Drive:</strong> Share the video → &quot;Anyone with the link can view&quot; → copy the link and paste above.
                          </p>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">Or upload a file</span>
                          </div>
                        </div>
                        {/* Drag and Drop Zone */}
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-teal-500 transition-colors cursor-pointer bg-gray-50"
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.add("border-teal-500", "bg-teal-50");
                          }}
                          onDragLeave={(e) => {
                            e.currentTarget.classList.remove("border-teal-500", "bg-teal-50");
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove("border-teal-500", "bg-teal-50");
                            const file = e.dataTransfer.files[0];
                            if (file && file.type.startsWith("video/")) {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "video/*";
                              const dataTransfer = new DataTransfer();
                              dataTransfer.items.add(file);
                              input.files = dataTransfer.files;
                              handleVideoFileChange({ target: input } as any);
                            }
                          }}
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "video/*";
                            input.onchange = handleVideoFileChange as any;
                            input.click();
                          }}
                        >
                          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                          <p className="text-lg font-medium text-gray-900 mb-2">
                            Drop your video here or click to browse
                          </p>
                          <p className="text-sm text-gray-500">MP4, MOV, AVI up to 2GB</p>
                        </div>
                        {videoFile && (
                          <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                            <p className="text-sm font-medium text-teal-900">Selected: {videoFile.name}</p>
                            <p className="text-xs text-teal-700 mt-1">
                              Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                            {field.value && field.value.startsWith("data:video") && (
                              <p className="text-xs text-green-600 mt-1">✓ File ready to upload</p>
                            )}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Thumbnail upload */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Thumbnail
              </CardTitle>
              <CardDescription className="text-gray-600">
                Upload a cover image for the video card. Shown in the library and on hover. Optional — leave empty to use a fallback.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                          <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors cursor-pointer bg-gray-50 min-w-[200px] aspect-video flex flex-col items-center justify-center"
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "image/*";
                              input.onchange = handleThumbnailFileChange as any;
                              input.click();
                            }}
                          >
                            {field.value && (field.value.startsWith("data:image") || field.value.startsWith("http")) ? (
                              <img
                                src={field.value}
                                alt="Thumbnail preview"
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <>
                                <ImageIcon className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                                <p className="text-sm font-medium text-gray-900">Upload image</p>
                                <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP</p>
                                <p className="text-xs text-gray-500">Max 10MB</p>
                              </>
                            )}
                          </div>
                          <div className="flex-1 space-y-2 w-full">
                            <Input
                              placeholder="Or paste thumbnail image URL"
                              value={typeof field.value === "string" && field.value && !field.value.startsWith("data:") ? field.value : ""}
                              onChange={(e) => {
                                setThumbnailFile(null);
                                field.onChange(e.target.value);
                              }}
                              className="border-gray-300"
                            />
                            {(field.value && field.value.startsWith("data:image")) && (
                              <p className="text-xs text-green-600">✓ Image file ready</p>
                            )}
                            {thumbnailFile && (
                              <p className="text-xs text-gray-600">Selected: {thumbnailFile.name}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Video Details */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Video Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter video title" {...field} className="border-gray-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your video content..."
                        rows={4}
                        {...field}
                        className="border-gray-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price48h"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00 = Free"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          className="border-gray-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Access Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="Select access level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Public">Public</SelectItem>
                          <SelectItem value="Private">Private</SelectItem>
                          <SelectItem value="Subscribers">Subscribers</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>


          {/* Submit */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/videos")}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-500 hover:bg-teal-600"
            >
              {isSubmitting ? "Uploading..." : "Upload Video"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UploadVideo;
