import { useState, useEffect } from "react";
import { getAllPartnersForAdmin, createPartner, updatePartner, deletePartner, Partner, refetchPartners } from "@/lib/partners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Edit, Trash2, ExternalLink, ArrowUp, ArrowDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const AdminPartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPartnerOpen, setNewPartnerOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [newPartnerName, setNewPartnerName] = useState("");
  const [newPartnerLogoUrl, setNewPartnerLogoUrl] = useState("");
  const [newPartnerWebsiteUrl, setNewPartnerWebsiteUrl] = useState("");
  const [newPartnerDescription, setNewPartnerDescription] = useState("");
  const [newPartnerOrder, setNewPartnerOrder] = useState(0);
  const [newPartnerIsActive, setNewPartnerIsActive] = useState(true);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    setIsLoading(true);
    try {
      const parts = await getAllPartnersForAdmin();
      setPartners(parts.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error("Failed to load partners:", error);
      toast.error("Failed to load partners");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePartner = async () => {
    if (!newPartnerName.trim()) {
      toast.error("Partner name is required");
      return;
    }
    if (!newPartnerLogoUrl.trim()) {
      toast.error("Logo URL is required");
      return;
    }

    try {
      await createPartner(
        newPartnerName.trim(),
        newPartnerLogoUrl.trim(),
        newPartnerWebsiteUrl.trim() || undefined,
        newPartnerDescription.trim() || undefined,
        newPartnerOrder
      );
      toast.success("Partner created successfully");
      setNewPartnerOpen(false);
      resetForm();
      await loadPartners();
      await refetchPartners();
    } catch (error: any) {
      toast.error(error.message || "Failed to create partner");
    }
  };

  const handleUpdatePartner = async () => {
    if (!editingPartner || !newPartnerName.trim()) {
      toast.error("Partner name is required");
      return;
    }
    if (!newPartnerLogoUrl.trim()) {
      toast.error("Logo URL is required");
      return;
    }

    try {
      await updatePartner(editingPartner.id, {
        name: newPartnerName.trim(),
        logoUrl: newPartnerLogoUrl.trim(),
        websiteUrl: newPartnerWebsiteUrl.trim() || undefined,
        description: newPartnerDescription.trim() || undefined,
        order: newPartnerOrder,
        isActive: newPartnerIsActive,
      });
      toast.success("Partner updated successfully");
      setEditingPartner(null);
      resetForm();
      await loadPartners();
      await refetchPartners();
    } catch (error: any) {
      toast.error(error.message || "Failed to update partner");
    }
  };

  const handleDeletePartner = async (partner: Partner) => {
    if (!confirm(`Delete partner "${partner.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deletePartner(partner.id);
      toast.success("Partner deleted successfully");
      await loadPartners();
      await refetchPartners();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete partner");
    }
  };

  const handleMoveOrder = async (partner: Partner, direction: "up" | "down") => {
    const currentIndex = partners.findIndex(p => p.id === partner.id);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= partners.length) return;

    const targetPartner = partners[newIndex];
    const newOrder = targetPartner.order;
    const oldOrder = partner.order;

    try {
      await updatePartner(partner.id, { order: newOrder });
      await updatePartner(targetPartner.id, { order: oldOrder });
      await loadPartners();
      await refetchPartners();
    } catch (error: any) {
      toast.error(error.message || "Failed to reorder partners");
    }
  };

  const resetForm = () => {
    setNewPartnerName("");
    setNewPartnerLogoUrl("");
    setNewPartnerWebsiteUrl("");
    setNewPartnerDescription("");
    setNewPartnerOrder(partners.length);
    setNewPartnerIsActive(true);
  };

  const openEditDialog = (partner: Partner) => {
    setEditingPartner(partner);
    setNewPartnerName(partner.name);
    setNewPartnerLogoUrl(partner.logoUrl);
    setNewPartnerWebsiteUrl(partner.websiteUrl || "");
    setNewPartnerDescription(partner.description || "");
    setNewPartnerOrder(partner.order);
    setNewPartnerIsActive(partner.isActive);
  };

  const openNewDialog = () => {
    setEditingPartner(null);
    resetForm();
    setNewPartnerOpen(true);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Partners</h1>
          <Button onClick={openNewDialog} className="bg-teal-500 hover:bg-teal-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Partner
          </Button>
        </div>
        <p className="text-gray-600">Manage partner companies displayed on the home page.</p>
      </div>

      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">All Partners</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading partners...</div>
          ) : partners.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No partners yet. Click "Add Partner" to create one.
            </div>
          ) : (
            <div className="space-y-4">
              {partners.map((partner, index) => (
                <div
                  key={partner.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveOrder(partner, "up")}
                      disabled={index === 0}
                      className="h-8 w-8 p-0"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveOrder(partner, "down")}
                      disabled={index === partners.length - 1}
                      className="h-8 w-8 p-0"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 flex items-center gap-4 min-w-0">
                    {partner.logoUrl && (
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="h-12 w-12 object-contain bg-white rounded p-2 border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{partner.name}</span>
                        {partner.isActive ? (
                          <Badge variant="default" className="bg-green-100 text-green-700">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                        {partner.websiteUrl && (
                          <a
                            href={partner.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      {partner.description && (
                        <p className="text-sm text-gray-600 line-clamp-1">{partner.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Order: {partner.order}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(partner)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePartner(partner)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New/Edit Partner Dialog */}
      <Dialog open={newPartnerOpen || editingPartner !== null} onOpenChange={(open) => {
        if (!open) {
          setNewPartnerOpen(false);
          setEditingPartner(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPartner ? "Edit Partner" : "Add New Partner"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="partner-name">Company Name *</Label>
              <Input
                id="partner-name"
                placeholder="e.g., Acme Corporation"
                value={newPartnerName}
                onChange={(e) => setNewPartnerName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="partner-logo">Logo URL *</Label>
              <Input
                id="partner-logo"
                placeholder="https://example.com/logo.png"
                value={newPartnerLogoUrl}
                onChange={(e) => setNewPartnerLogoUrl(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">URL to the partner's logo image</p>
              {newPartnerLogoUrl && (
                <div className="mt-2">
                  <img
                    src={newPartnerLogoUrl}
                    alt="Logo preview"
                    className="h-16 w-16 object-contain bg-gray-50 border border-gray-200 rounded p-2"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="partner-website">Website URL (optional)</Label>
              <Input
                id="partner-website"
                placeholder="https://example.com"
                value={newPartnerWebsiteUrl}
                onChange={(e) => setNewPartnerWebsiteUrl(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="partner-description">Description (optional)</Label>
              <Textarea
                id="partner-description"
                placeholder="Brief description of the partnership"
                value={newPartnerDescription}
                onChange={(e) => setNewPartnerDescription(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="partner-order">Display Order</Label>
                <Input
                  id="partner-order"
                  type="number"
                  min="0"
                  value={newPartnerOrder}
                  onChange={(e) => setNewPartnerOrder(parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>
              {editingPartner && (
                <div className="flex items-center justify-between pt-6">
                  <Label htmlFor="partner-active">Active</Label>
                  <Switch
                    id="partner-active"
                    checked={newPartnerIsActive}
                    onCheckedChange={setNewPartnerIsActive}
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setNewPartnerOpen(false);
              setEditingPartner(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={editingPartner ? handleUpdatePartner : handleCreatePartner}>
              {editingPartner ? "Update" : "Create"} Partner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPartners;
