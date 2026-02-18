import { supabase } from "./supabase";

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "afterlife_categories";
let _cache: Category[] | null = null;
let _loadError: string | null = null;

/**
 * Get all categories - from Supabase if available, else localStorage
 */
export async function getAllCategories(): Promise<Category[]> {
  await ensureCategoriesLoaded();
  return _cache || [];
}

/**
 * Get categories synchronously from cache
 */
export function getCategories(): Category[] {
  if (_cache) return _cache;
  
  // Fallback to localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn("Failed to load categories from localStorage:", error);
  }
  
  // Return default categories if nothing found
  return getDefaultCategories();
}

/**
 * Get default categories (matching Community discussion categories)
 */
function getDefaultCategories(): Category[] {
  return [
    {
      id: "leadership",
      name: "Leadership & Management",
      description: "Discussions on leading teams, management...",
      icon: "🎯",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: "politics",
      name: "Politics & Governance",
      description: "Policy, governance, civic engagement...",
      icon: "🏛️",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: "innovation",
      name: "Innovation & Tech",
      description: "Technology, innovation, digital transformation...",
      icon: "💡",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];
}

/**
 * Ensure categories are loaded from Supabase
 */
async function ensureCategoriesLoaded(): Promise<void> {
  if (_cache !== null) return;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data) {
        _cache = data.map((row) => ({
          id: row.id,
          name: row.name,
          description: row.description || undefined,
          icon: row.icon || undefined,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));
        // Cache in localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(_cache));
        _loadError = null;
        return;
      }
      
      if (error && (error.code === "PGRST116" || error.message?.includes("404") || error.code === "42P01")) {
        // Table doesn't exist, use defaults
        console.warn("categories table not found, using default categories");
        _cache = getDefaultCategories();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(_cache));
        _loadError = null;
        return;
      }
      
      _loadError = error?.message || "Failed to load categories";
    } catch (error: any) {
      if (error?.code === "PGRST116" || error?.message?.includes("404") || error?.status === 404) {
        // Table doesn't exist, use defaults
        _cache = getDefaultCategories();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(_cache));
        _loadError = null;
        return;
      }
      console.warn("Supabase categories load error:", error);
      _loadError = error?.message || "Failed to load categories";
    }
  }

  // Fallback to localStorage or defaults
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      _cache = JSON.parse(stored);
    } else {
      _cache = getDefaultCategories();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_cache));
    }
  } catch (error) {
    console.warn("Failed to load categories from localStorage:", error);
    _cache = getDefaultCategories();
  }
}

/**
 * Create a new category
 */
export async function createCategory(name: string, description?: string, icon?: string): Promise<Category> {
  const category: Category = {
    id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: name.trim(),
    description: description?.trim(),
    icon: icon?.trim(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  if (supabase) {
    try {
      const { error } = await supabase.from("categories").insert({
        id: category.id,
        name: category.name,
        description: category.description || null,
        icon: category.icon || null,
        created_at: category.createdAt,
        updated_at: category.updatedAt,
      });

      if (error && !(error.code === "PGRST116" || error.message?.includes("404") || error.code === "42P01")) {
        throw new Error(error.message || "Failed to create category");
      }
    } catch (error: any) {
      if (!(error?.code === "PGRST116" || error?.message?.includes("404") || error?.status === 404)) {
        console.warn("Failed to create category in Supabase:", error);
      }
    }
  }

  // Save to localStorage
  const categories = getCategories();
  categories.push(category);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  _cache = categories;

  return category;
}

/**
 * Update a category
 */
export async function updateCategory(id: string, updates: Partial<Pick<Category, "name" | "description" | "icon">>): Promise<void> {
  const categories = getCategories();
  const index = categories.findIndex((c) => c.id === id);
  
  if (index === -1) {
    throw new Error("Category not found");
  }

  categories[index] = {
    ...categories[index],
    ...updates,
    updatedAt: Date.now(),
  };

  if (supabase) {
    try {
      const { error } = await supabase
        .from("categories")
        .update({
          name: categories[index].name,
          description: categories[index].description || null,
          icon: categories[index].icon || null,
          updated_at: categories[index].updatedAt,
        })
        .eq("id", id);

      if (error && !(error.code === "PGRST116" || error.message?.includes("404") || error.code === "42P01")) {
        throw new Error(error.message || "Failed to update category");
      }
    } catch (error: any) {
      if (!(error?.code === "PGRST116" || error?.message?.includes("404") || error?.status === 404)) {
        console.warn("Failed to update category in Supabase:", error);
      }
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  _cache = categories;
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string): Promise<void> {
  const categories = getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  
  if (filtered.length === categories.length) {
    throw new Error("Category not found");
  }

  if (supabase) {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error && !(error.code === "PGRST116" || error.message?.includes("404") || error.code === "42P01")) {
        throw new Error(error.message || "Failed to delete category");
      }
    } catch (error: any) {
      if (!(error?.code === "PGRST116" || error?.message?.includes("404") || error?.status === 404)) {
        console.warn("Failed to delete category from Supabase:", error);
      }
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  _cache = filtered;
}

/**
 * Refetch categories from Supabase
 */
export async function refetchCategories(): Promise<void> {
  _cache = null;
  _loadError = null;
  await ensureCategoriesLoaded();
}

/**
 * Get category names as array (for dropdowns)
 */
export function getCategoryNames(): string[] {
  return getCategories().map((c) => c.name);
}

/**
 * Find category by name
 */
export function findCategoryByName(name: string): Category | undefined {
  return getCategories().find((c) => c.name === name || c.id === name);
}
