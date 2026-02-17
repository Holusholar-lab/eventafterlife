import { useState, useEffect, useMemo } from "react";
import { getAllAdminVideos } from "@/lib/admin-videos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tag, Search } from "lucide-react";

const AdminCategories = () => {
  const [search, setSearch] = useState("");
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const videos = getAllAdminVideos();
    const counts: Record<string, number> = {};
    videos.forEach((v) => {
      const cat = v.category || "Uncategorized";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    setCategoryCounts(counts);
  }, []);

  const categories = useMemo(() => {
    const list = Object.entries(categoryCounts).map(([name, count]) => ({ name, count }));
    if (search.trim()) {
      const q = search.toLowerCase();
      return list.filter((c) => c.name.toLowerCase().includes(q));
    }
    return list.sort((a, b) => b.count - a.count);
  }, [categoryCounts, search]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
        <p className="text-gray-600">Content categories used across your videos. Add or edit categories when uploading or editing content.</p>
      </div>

      <Card className="border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-gray-900">All Categories</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-gray-300"
            />
          </div>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No categories yet. Categories are created when you add or edit videos (e.g. Gala, Company, Event, Politics, Leadership).
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {categories.map(({ name, count }) => (
                <div
                  key={name}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100"
                >
                  <Tag className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-900">{name}</span>
                  <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                    {count} video{count !== 1 ? "s" : ""}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCategories;
