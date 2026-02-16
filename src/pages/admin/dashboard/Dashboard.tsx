import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Video, Eye, DollarSign, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAllAnalytics, getAllAdminVideos } from "@/lib/admin-videos";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalVideos: 0,
    activeVideos: 0,
    publicVideos: 0,
    totalViews: 0,
    totalRentals: 0,
    totalRevenue: 0,
    averageRevenuePerVideo: 0,
    averageViewsPerVideo: 0,
  });

  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState(1284);

  useEffect(() => {
    const stats = getAllAnalytics();
    setAnalytics(stats);

    const videos = getAllAdminVideos();
    const sorted = [...videos]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5);
    setRecentVideos(sorted);
  }, []);

  const getStatusBadge = (video: any) => {
    if (!video.isActive) return { label: "draft", variant: "secondary" as const };
    if (video.isPublic) return { label: "published", variant: "default" as const };
    return { label: "processing", variant: "secondary" as const };
  };

  const getAccessLabel = (video: any) => {
    if (!video.isPublic) return "Private";
    return "Public";
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your video platform</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Videos</CardTitle>
            <Video className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{analytics.totalVideos}</div>
            <p className="text-xs text-green-600 mt-1">+{analytics.totalVideos > 0 ? Math.floor(analytics.totalVideos * 0.4) : 0} this month</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Views</CardTitle>
            <Eye className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{analytics.totalViews.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">${analytics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">+8.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Subscribers</CardTitle>
            <Users className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{subscribers.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">+64 this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Videos */}
      <Card className="border border-gray-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gray-600" />
            <CardTitle className="text-xl font-semibold text-gray-900">Recent Videos</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {recentVideos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No videos yet. Upload your first video to get started.</p>
            </div>
          ) : (
            <div className="rounded-md border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-gray-700 font-semibold">Title</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Access</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Views</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentVideos.map((video) => {
                    const status = getStatusBadge(video);
                    return (
                      <TableRow key={video.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">
                          <div>
                            <div>{video.title}</div>
                            <div className="text-xs text-gray-500 mt-1">
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
                        <TableCell className="text-gray-600">{getAccessLabel(video)}</TableCell>
                        <TableCell className="text-gray-900">{video.views.toLocaleString()}</TableCell>
                        <TableCell className="font-medium text-gray-900">${video.revenue.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
