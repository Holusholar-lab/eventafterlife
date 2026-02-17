import { useState, useEffect, useMemo } from "react";
import { Search, Mail, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAllUsersForAdmin } from "@/lib/auth";
import type { User } from "@/lib/auth";
import { format } from "date-fns";

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      const allUsers = await getAllUsersForAdmin();
      setUsers(allUsers);
    };
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.fullName.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-sm sm:text-base text-gray-600">View and manage registered users.</p>
      </div>

      <Card className="border border-gray-200">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-4">
          <CardTitle className="text-gray-900">All Users</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-gray-300"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {users.length === 0 ? (
                <p>No users registered yet.</p>
              ) : (
                <p>No users match your search.</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="rounded-md border border-gray-200 min-w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-gray-700 font-semibold min-w-[150px]">Name</TableHead>
                      <TableHead className="text-gray-700 font-semibold min-w-[200px]">Email</TableHead>
                      <TableHead className="text-gray-700 font-semibold whitespace-nowrap">Newsletter</TableHead>
                      <TableHead className="text-gray-700 font-semibold whitespace-nowrap">Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900 break-words">{user.fullName}</TableCell>
                        <TableCell className="text-gray-600 break-all">{user.email}</TableCell>
                      <TableCell>
                        {user.newsletter ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">Subscribed</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-600">No</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {format(new Date(user.createdAt), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
