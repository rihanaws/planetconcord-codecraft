"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Eye } from "lucide-react"
import { format } from "date-fns"
import { UserDetailModal } from "@/components/admin/user-detail-modal"

interface UserRow {
  id: string
  name: string | null
  email: string
  role: string
  emailVerified: Date | null
  image: string | null
  createdAt: Date
  _count: {
    purchases: number
    productAccess: number
  }
}

interface UserTableProps {
  users: UserRow[]
}

export function UserTable({ users }: UserTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("ALL")
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null)

  const filtered = useMemo(() => {
    return users.filter((user) => {
      if (roleFilter !== "ALL" && user.role !== roleFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !user.email.toLowerCase().includes(q) &&
          !(user.name?.toLowerCase().includes(q))
        ) {
          return false
        }
      }
      return true
    })
  }, [users, searchQuery, roleFilter])

  const getUserInitials = (name: string | null): string => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-transparent opacity-50" />

        <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="CUSTOMER">Customer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} of {users.length} users
        </p>
      </div>

      {/* Table */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-transparent opacity-50" />

        <div className="relative overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No users match your filters</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Role</TableHead>
                  <TableHead className="font-semibold">Verified</TableHead>
                  <TableHead className="font-semibold">Activity</TableHead>
                  <TableHead className="font-semibold">Created</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-border/50 hover:bg-accent/30 transition-colors duration-200"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.image || undefined} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {getUserInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium">{user.name || "Anonymous"}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === "ADMIN" ? "destructive" : "secondary"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          user.emailVerified ? "text-chart-2" : "text-muted-foreground"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            user.emailVerified ? "bg-chart-2" : "bg-muted-foreground"
                          }`}
                        />
                        {user.emailVerified ? "Verified" : "Unverified"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                        <span>{user._count.purchases} purchases</span>
                        <span>{user._count.productAccess} products</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          userId={selectedUser.id}
          userName={selectedUser.name || "Anonymous"}
          userEmail={selectedUser.email}
          userRole={selectedUser.role}
          open={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  )
}
