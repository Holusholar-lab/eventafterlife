import { useState, useEffect, useMemo } from "react";
import { getAllAdminVideos } from "@/lib/admin-videos";
import { getAllCategories, createCategory, updateCategory, deleteCategory, Category, refetchCategories } from "@/lib/categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, Search, Plus, Edit, Trash2, X, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const AdminCategories = () => {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("");

  useEffect(() => {
    loadCategories();
    loadCategoryCounts();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const cats = await getAllCategories();
      setCategories(cats);
    } catch (error) {
      console.error("Failed to load categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategoryCounts = () => {
    const videos = getAllAdminVideos();
    const counts: Record<string, number> = {};
    videos.forEach((v) => {
      const cat = v.category || "Uncategorized";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    setCategoryCounts(counts);
  };

  const filteredCategories = useMemo(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return categories.filter((c) => 
        c.name.toLowerCase().includes(q) || 
        c.description?.toLowerCase().includes(q)
      );
    }
    return categories.sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, search]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      await createCategory(newCategoryName.trim(), newCategoryDescription.trim() || undefined, newCategoryIcon.trim() || undefined);
      toast.success("Category created successfully");
      setNewCategoryOpen(false);
      setNewCategoryName("");
      setNewCategoryDescription("");
      setNewCategoryIcon("");
      await loadCategories();
      await refetchCategories();
    } catch (error: any) {
      toast.error(error.message || "Failed to create category");
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      await updateCategory(editingCategory.id, {
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || undefined,
        icon: newCategoryIcon.trim() || undefined,
      });
      toast.success("Category updated successfully");
      setEditingCategory(null);
      setNewCategoryName("");
      setNewCategoryDescription("");
      setNewCategoryIcon("");
      await loadCategories();
      await refetchCategories();
    } catch (error: any) {
      toast.error(error.message || "Failed to update category");
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!confirm(`Delete category "${category.name}"? Videos using this category will keep it, but it won't appear in the list.`)) {
      return;
    }

    try {
      await deleteCategory(category.id);
      toast.success("Category deleted successfully");
      await loadCategories();
      await refetchCategories();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryDescription(category.description || "");
    setNewCategoryIcon(category.icon || "");
  };

  const openNewDialog = () => {
    setEditingCategory(null);
    setNewCategoryName("");
    setNewCategoryDescription("");
    setNewCategoryIcon("");
    setNewCategoryOpen(true);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <Button onClick={openNewDialog} className="bg-teal-500 hover:bg-teal-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
        <p className="text-gray-600">Manage content categories for Library and Community. Categories are shared between videos and discussions.</p>
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
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading categories...</div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {search ? "No categories found matching your search." : "No categories yet. Click 'Add Category' to create one."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((category) => {
                const count = categoryCounts[category.name] || 0;
                return (
                  <div
                    key={category.id}
                    className="flex items-start justify-between p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {category.icon && <span className="text-lg">{category.icon}</span>}
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </div>
                      {category.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{category.description}</p>
                      )}
                      <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                        {count} video{count !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(category)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New/Edit Category Dialog */}
      <Dialog open={newCategoryOpen || editingCategory !== null} onOpenChange={(open) => {
        if (!open) {
          setNewCategoryOpen(false);
          setEditingCategory(null);
          setNewCategoryName("");
          setNewCategoryDescription("");
          setNewCategoryIcon("");
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category-name">Category Name *</Label>
              <Input
                id="category-name"
                placeholder="e.g., Leadership & Management"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="category-description">Description (optional)</Label>
              <Textarea
                id="category-description"
                placeholder="Brief description of this category"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="category-icon">Icon (optional)</Label>
              <Input
                id="category-icon"
                placeholder="e.g., 🎯"
                value={newCategoryIcon}
                onChange={(e) => setNewCategoryIcon(e.target.value)}
                className="mt-1"
                maxLength={2}
              />
              <p className="text-xs text-gray-500 mt-1">Single emoji or icon character</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setNewCategoryOpen(false);
              setEditingCategory(null);
            }}>
              Cancel
            </Button>
            <Button onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}>
              {editingCategory ? "Update" : "Create"} Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
