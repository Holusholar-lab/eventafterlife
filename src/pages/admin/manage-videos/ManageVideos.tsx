import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Eye, EyeOff, Lock, Unlock, Plus, Search, MoreVertical, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getAllAdminVideos, deleteAdminVideo, updateAdminVideo, AdminVideo } from "@/lib/admin-videos";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const ManageVideos = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<AdminVideo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [accessFilter, setAccessFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    filterVideos();
  }, [searchQuery, accessFilter, videos]);

  const loadVideos = () => {
    const allVideos = getAllAdminVideos();
    setVideos(allVideos);
  };

  const filterVideos = () => {
    let filtered = [...videos];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Access filter
    if (accessFilter === "public") {
      filtered = filtered.filter((video) => video.isPublic);
    } else if (accessFilter === "private") {
      filtered = filtered.filter((video) => !video.isPublic);
    }

    setFilteredVideos(filtered);
  };

  const handleDelete = (id: string) => {
    setVideoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (videoToDelete) {
      const success = await deleteAdminVideo(videoToDelete);
      if (success) {
        toast.success("Video deleted successfully");
        loadVideos();
      } else {
        toast.error("Failed to delete video");
      }
      setDeleteDialogOpen(false);
      setVideoToDelete(null);
    }
  };

  const togglePublic = async (video: AdminVideo) => {
    await updateAdminVideo(video.id, { isPublic: !video.isPublic });
    toast.success(`Video is now ${!video.isPublic ? "public" : "private"}`);
    loadVideos();
  };

  const toggleActive = async (video: AdminVideo) => {
    await updateAdminVideo(video.id, { isActive: !video.isActive });
    toast.success(`Video is now ${!video.isActive ? "active" : "inactive"}`);
    loadVideos();
  };

  const getStatusBadge = (video: AdminVideo) => {
    if (!video.isActive) return { label: "draft", variant: "secondary" as const };
    return { label: "published", variant: "default" as const };
  };

  const getAccessInfo = (video: AdminVideo) => {
    if (!video.isPublic) return { label: "Private", icon: Lock };
    return { label: "Public", icon: Globe };
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Videos</h1>
          <p className="text-gray-600">Manage your video library</p>
        </div>
        <Button onClick={() => navigate("/admin/upload")} className="bg-teal-500 hover:bg-teal-600">
          <Plus className="w-4 h-4 mr-2" />
          Upload New
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="border border-gray-200 mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={accessFilter} onValueChange={setAccessFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Access" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Access</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Videos Table */}
      {filteredVideos.length === 0 ? (
        <Card className="border border-gray-200">
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No videos found.</p>
            <Button onClick={() => navigate("/admin/upload")} className="bg-teal-500 hover:bg-teal-600">
              <Plus className="w-4 h-4 mr-2" />
              Upload Your First Video
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-gray-200">
          <CardContent className="p-0">
            <div className="rounded-md border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-gray-700 font-semibold">Video</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Access</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Price</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Views</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Revenue</TableHead>
                    <TableHead className="text-gray-700 font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVideos.map((video) => {
                    const status = getStatusBadge(video);
                    const access = getAccessInfo(video);
                    const AccessIcon = access.icon;
                    return (
                      <TableRow key={video.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{video.title}</div>
                            <div className="text-sm text-gray-500 mt-1">
                              {video.duration} • {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={status.variant}
                            className={
                              status.label === "published"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-gray-100 text-gray-800 border-gray-200"
                            }
                          >
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-gray-600">
                            <AccessIcon className="w-4 h-4" />
                            {access.label}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900">
                          ${video.price48h.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-gray-900">{video.views.toLocaleString()}</TableCell>
                        <TableCell className="font-medium text-gray-900">${video.revenue.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/admin/videos/edit/${video.id}`)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => togglePublic(video)}>
                                {video.isPublic ? (
                                  <>
                                    <Lock className="w-4 h-4 mr-2" />
                                    Make Private
                                  </>
                                ) : (
                                  <>
                                    <Unlock className="w-4 h-4 mr-2" />
                                    Make Public
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleActive(video)}>
                                {video.isActive ? (
                                  <>
                                    <EyeOff className="w-4 h-4 mr-2" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(video.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the video and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setVideoToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageVideos;
