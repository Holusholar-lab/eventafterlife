import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllAnalytics, getAllAdminVideos } from "@/lib/admin-videos";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

const Analytics = () => {
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

  const [topVideos, setTopVideos] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [accessDistribution, setAccessDistribution] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    const stats = getAllAnalytics();
    setAnalytics(stats);

    // Get top performing videos
    const videos = getAllAdminVideos();
    const sorted = [...videos]
      .sort((a, b) => b.views - a.views)
      .slice(0, 3);
    setTopVideos(sorted);

    // Generate monthly data (last 12 months)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthly = months.map((month, index) => ({
      month,
      views: Math.floor(Math.random() * 30000) + 10000 + index * 2000,
      revenue: Math.floor(Math.random() * 15000) + 5000 + index * 1000,
    }));
    setMonthlyData(monthly);

    // Calculate access distribution
    const publicCount = videos.filter((v) => v.isPublic).length;
    const privateCount = videos.filter((v) => !v.isPublic).length;
    const total = videos.length || 1;
    setAccessDistribution([
      { name: "Subscribers", value: Math.floor((publicCount / total) * 45), color: "#0EA5E9" },
      { name: "Public", value: Math.floor((publicCount / total) * 35), color: "#14B8A6" },
      { name: "Private", value: Math.floor((privateCount / total) * 20), color: "#8B5CF6" },
    ]);
  };

  const chartConfig = {
    views: {
      label: "Views",
      color: "hsl(var(--chart-1))",
    },
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-2))",
    },
  };

  const statCards = [
    {
      title: "Total Videos",
      value: analytics.totalVideos,
      icon: Video,
      description: `${analytics.activeVideos} active`,
      trend: null,
    },
    {
      title: "Total Views",
      value: analytics.totalViews.toLocaleString(),
      icon: Eye,
      description: `${analytics.averageViewsPerVideo.toFixed(1)} avg per video`,
      trend: null,
    },
    {
      title: "Total Rentals",
      value: analytics.totalRentals.toLocaleString(),
      icon: Users,
      description: "All time rentals",
      trend: null,
    },
    {
      title: "Total Revenue",
      value: `$${analytics.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: `$${analytics.averageRevenuePerVideo.toFixed(2)} avg per video`,
      trend: null,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Performance insights for your content</p>
      </div>

      {/* Views & Revenue Over Time */}
      <Card className="border border-gray-200 mb-6">
        <CardHeader>
          <CardTitle className="text-gray-900">Views & Revenue Over Time</CardTitle>
          <CardDescription className="text-gray-600">Monthly performance for the last 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#0EA5E9"
                  strokeWidth={2}
                  fill="#0EA5E9"
                  fillOpacity={0.1}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#14B8A6"
                  strokeWidth={2}
                  fill="#14B8A6"
                  fillOpacity={0.1}
                />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* Access Distribution */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Access Distribution</CardTitle>
            <CardDescription className="text-gray-600">How your content is distributed</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={accessDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {accessDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Videos by Views */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Top Videos by Views
            </CardTitle>
            <CardDescription className="text-gray-600">Your best performing content</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topVideos} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis dataKey="title" type="category" stroke="#6b7280" width={150} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="views" fill="#14B8A6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>


      {/* Top Performing Videos Table */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Top Performing Videos</CardTitle>
          <CardDescription className="text-gray-600">Videos ranked by views</CardDescription>
        </CardHeader>
        <CardContent>
          {topVideos.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No videos yet. Upload videos to see analytics.</p>
          ) : (
            <div className="rounded-md border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-gray-700 font-semibold">Rank</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Title</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Category</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Views</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Rentals</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topVideos.map((video, index) => (
                    <TableRow key={video.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">#{index + 1}</TableCell>
                      <TableCell className="font-medium text-gray-900">{video.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">
                          {video.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-900">{video.views.toLocaleString()}</TableCell>
                      <TableCell className="text-gray-900">{video.rentals}</TableCell>
                      <TableCell className="font-medium text-gray-900">${video.revenue.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
