# Partners Management Setup

This guide explains how to set up the partners management system for displaying partner companies on the home page.

## Overview

Partners are companies that have partnered with your platform. They are displayed in a dedicated section on the home page, showing their logos and linking to their websites.

## Supabase Setup

### Step 1: Create the Partners Table

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file `supabase/partners-table.sql`
4. Copy and paste the entire SQL script into the SQL Editor
5. Click **Run** to execute

The script will:
- Create the `partners` table
- Set up indexes for performance
- Configure Row Level Security (RLS) policies

### Step 2: Verify Table Creation

1. Go to **Table Editor** in Supabase
2. You should see a new `partners` table
3. The table should be empty initially

## Features

### Admin Panel - Partners Page

- **View all partners** with their logos and details
- **Add new partners** with:
  - Company name
  - Logo URL (image URL)
  - Website URL (optional)
  - Description (optional)
  - Display order
  - Active/Inactive status
- **Edit existing partners**
- **Delete partners**
- **Reorder partners** using up/down arrows
- **Toggle active status** to show/hide partners on the home page

### Home Page Display

- Partners are displayed in a grid layout
- Only active partners are shown
- Partners are sorted by their display order
- Logos are clickable and link to partner websites
- Responsive design (2-6 columns depending on screen size)

## How It Works

1. **Storage**: Partners are stored in Supabase `partners` table (with localStorage fallback)
2. **Display**: Only active partners are shown on the home page
3. **Ordering**: Partners can be reordered using the order field
4. **Sync**: Partners sync across all devices via Supabase
5. **Fallback**: If Supabase is unavailable, partners fall back to localStorage

## Adding Partners

### Via Admin Panel

1. Go to **Admin → Content → Partners**
2. Click **Add Partner**
3. Fill in:
   - **Company Name** (required): e.g., "Acme Corporation"
   - **Logo URL** (required): URL to the partner's logo image
   - **Website URL** (optional): Link to partner's website
   - **Description** (optional): Brief description of the partnership
   - **Display Order**: Number for sorting (lower numbers appear first)
4. Click **Create Partner**

### Logo Requirements

- Logo should be hosted on a public URL (e.g., CDN, image hosting service)
- Recommended size: 200x100px or similar aspect ratio
- Supported formats: PNG, JPG, SVG
- Logo will be displayed with max-height constraints to maintain consistency

## Managing Partners

### Reordering

- Use the up/down arrow buttons to change display order
- Lower order numbers appear first
- Changes are saved immediately

### Activating/Deactivating

- Edit a partner and toggle the "Active" switch
- Inactive partners won't appear on the home page
- Useful for temporarily hiding partners without deleting them

### Editing

- Click the edit icon (pencil) on any partner
- Update any field
- Logo preview is shown when editing

### Deleting

- Click the delete icon (trash) on any partner
- Confirm deletion
- This action cannot be undone

## Display on Home Page

Partners appear in a dedicated section between the "Rental Model" and "FAQ" sections:
- Grid layout (responsive: 2-6 columns)
- Logo images with hover effects
- Clickable logos that open partner websites in new tabs
- Only active partners are displayed
- Sorted by display order

## Notes

- Partners are only visible on the home page
- Logo URLs must be publicly accessible
- If a logo fails to load, the partner name is displayed as fallback
- Partners sync across all devices via Supabase
- The section only appears if there are active partners
