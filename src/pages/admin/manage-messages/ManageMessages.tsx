import { useState, useEffect } from "react";
import { getAllMessagesAsync, updateMessageStatus, deleteMessage, getMessagesStatsAsync, ContactMessage } from "@/lib/contact-messages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { MoreVertical, Mail, Trash2, Eye, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const ManageMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState({ total: 0, new: 0, read: 0, replied: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const allMessages = await getAllMessagesAsync();
      const s = await getMessagesStatsAsync();
      setMessages(allMessages.sort((a, b) => b.createdAt - a.createdAt));
      setStats(s);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleStatusChange = async (id: string, status: ContactMessage["status"]) => {
    await updateMessageStatus(id, status);
    loadMessages();
    toast.success("Message status updated");
  };

  const handleDelete = (id: string) => {
    setMessageToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (messageToDelete) {
      await deleteMessage(messageToDelete);
      loadMessages();
      toast.success("Message deleted");
      setDeleteDialogOpen(false);
      setMessageToDelete(null);
    }
  };

  const getStatusBadge = (status: ContactMessage["status"]) => {
    const variants = {
      new: { label: "New", className: "bg-blue-500/10 text-blue-500" },
      read: { label: "Read", className: "bg-yellow-500/10 text-yellow-500" },
      replied: { label: "Replied", className: "bg-green-500/10 text-green-500" },
    };
    return variants[status];
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">Manage contact form submissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">New</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Read</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.read}</div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Replied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.replied}</div>
          </CardContent>
        </Card>
      </div>

      {/* Messages Table */}
      {loading ? (
        <p className="text-gray-600">Loading messages...</p>
      ) : (
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">All Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No messages yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => {
                  const statusBadge = getStatusBadge(message.status);
                  return (
                    <TableRow key={message.id}>
                      <TableCell className="font-medium text-gray-900">{message.name}</TableCell>
                      <TableCell className="text-gray-600">{message.email}</TableCell>
                      <TableCell className="text-gray-600">{message.subject}</TableCell>
                      <TableCell>
                        <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedMessage(message);
                                if (message.status === "new") {
                                  handleStatusChange(message.id, "read");
                                }
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {message.status !== "read" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(message.id, "read")}>
                                <Eye className="w-4 h-4 mr-2" />
                                Mark as Read
                              </DropdownMenuItem>
                            )}
                            {message.status !== "replied" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(message.id, "replied")}>
                                <Check className="w-4 h-4 mr-2" />
                                Mark as Replied
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDelete(message.id)}
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
          )}
        </CardContent>
      </Card>
      )}

      {/* Message Details Dialog */}
      {selectedMessage && (
        <AlertDialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>{selectedMessage.subject}</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="space-y-2 mt-4">
                  <p>
                    <strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                  <div className="mt-4">
                    <strong>Message:</strong>
                    <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`);
                      }}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Reply via Email
                    </Button>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setSelectedMessage(null)}>Close</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageMessages;
