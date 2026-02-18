# Categories Management Setup

This guide explains how to set up the categories management system for Library and Community pages.

## Overview

Categories are now managed centrally and shared between:
- **Library page** - Video filtering by category
- **Community page** - Discussion categories
- **Admin panel** - Category management and video upload/edit

## Supabase Setup

### Step 1: Create the Categories Table

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file `supabase/categories-table.sql`
4. Copy and paste the entire SQL script into the SQL Editor
5. Click **Run** to execute

The script will:
- Create the `categories` table
- Insert default categories (Leadership & Management, Politics & Governance, Innovation & Tech)
- Set up Row Level Security (RLS) policies

### Step 2: Verify Table Creation

1. Go to **Table Editor** in Supabase
2. You should see a new `categories` table
3. It should contain 3 default categories

## Features

### Admin Panel - Categories Page

- **View all categories** with video counts
- **Add new categories** with name, description, and icon
- **Edit existing categories**
- **Delete categories** (videos keep their category, but it won't appear in lists)

### Video Upload/Edit

- **Select from existing categories** in dropdown
- **Add new category** inline using the "+" button
- Categories are immediately available for selection

### Library & Community

- **Dynamic category filtering** - Categories are loaded from the database
- **Consistent categories** - Same categories appear in both Library and Community
- **Automatic updates** - New categories appear automatically after creation

## How It Works

1. **Storage**: Categories are stored in Supabase `categories` table (with localStorage fallback)
2. **Default Categories**: If Supabase table doesn't exist, default categories are used
3. **Sync**: Categories sync across all devices via Supabase
4. **Fallback**: If Supabase is unavailable, categories fall back to localStorage

## Adding Categories

### Via Admin Panel

1. Go to **Admin → Categories**
2. Click **Add Category**
3. Fill in:
   - **Name** (required): e.g., "Leadership & Management"
   - **Description** (optional): Brief description
   - **Icon** (optional): Single emoji, e.g., "🎯"
4. Click **Create Category**

### Via Video Upload

1. Go to **Admin → Upload Video**
2. In the **Category** field, click the **"+"** button
3. Fill in the category details
4. The new category will be automatically selected

## Notes

- Categories are shared between Library and Community
- When you upload a video with a new category, it's automatically added to the categories list
- Categories can be edited or deleted from the Admin Categories page
- If a category is deleted, videos using that category will still have it, but it won't appear in category filters
