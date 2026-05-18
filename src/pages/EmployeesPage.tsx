import { useState } from "react";
import { useEmployees, useAddEmployee } from "@/hooks/useEmployees";
import { Employee } from "@/types";
import { TableSkeleton } from "@/components/states/LoadingSkeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Users, UserCheck, ClipboardCheck, FileCheck2, Repeat, Plus, Search, Mail, Phone } from "lucide-react";
import StatCard from "@/components/StatCard";

const roleColors: Record<string, string> = {
  Admin: "bg-primary text-primary-foreground",
  Manager: "bg-chart-2 text-white",
  Staff: "bg-muted text-muted-foreground",
};

const statusColors: Record<string, string> = {
  Active: "bg-chart-2/10 text-chart-2",
  Inactive: "bg-muted text-muted-foreground",
};

const EmployeesPage = () => {
  const employeesQ = useEmployees();
  const employees = employeesQ.data ?? [];
  const addEmployee = useAddEmployee();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "Staff" as Employee["role"], join_date: "" });

  const totalOnboards = employees.reduce((s, e) => s + e.onboard_count, 0);
  const activeCount = employees.filter((e) => e.status === "Active").length;

  const filtered = employees.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || e.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleAdd = () => {
    if (!form.name || !form.email) return;
    addEmployee.mutate(
      { ...form, onboard_count: 0, status: "Active", join_date: form.join_date || new Date().toISOString().split("T")[0] },
      {
        onSuccess: () => {
          setForm({ name: "", email: "", phone: "", role: "Staff", join_date: "" });
          setOpen(false);
        },
      }
    );
  };

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Team performance and operational tasks</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Employees" value={activeCount} icon={UserCheck} accent="success" subtitle={`${employees.length} total`} />
        <StatCard title="Pending Tasks" value={7} icon={ClipboardCheck} accent="warning" subtitle="Across all hubs" />
        <StatCard title="KYC Approvals" value={4} icon={FileCheck2} accent="primary" subtitle="Awaiting review" />
        <StatCard title="Handovers Today" value={3} icon={Repeat} accent="accent" subtitle={`${totalOnboards} onboards total`} />
      </div>

      {/* Team Management Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Team Management</h2>
          <p className="text-sm text-muted-foreground">View and manage your team members</p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus size={16} /> Add Employee
        </Button>
      </div>

      {/* Table Card */}
      <div className="bg-card rounded-xl border">
        <div className="p-5 border-b">
          <h3 className="font-semibold">All Employees</h3>
          <p className="text-sm text-muted-foreground">Manage your team members and their roles</p>
        </div>

        <div className="p-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          {employeesQ.isLoading ? (
            <TableSkeleton rows={5} cols={6} />
          ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Employee</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Contact</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Role</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Onboards</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Join Date</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                        {getInitials(e.name)}
                      </div>
                      <span className="font-medium">{e.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-muted-foreground"><Mail size={13} /> {e.email}</div>
                      <div className="flex items-center gap-1.5 text-muted-foreground"><Phone size={13} /> {e.phone}</div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[e.role]}`}>{e.role}</span>
                  </td>
                  <td className="px-5 py-4 font-medium">{e.onboard_count} <span className="text-muted-foreground font-normal">bookings</span></td>
                  <td className="px-5 py-4 text-muted-foreground">{formatDate(e.join_date)}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[e.status]}`}>{e.status}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No employees found.</td></tr>
              )}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {/* Add Employee Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>Add a new team member to your organization.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Full Name</Label>
              <Input placeholder="Enter full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email Address</Label>
                <Input placeholder="email@zargo.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as Employee["role"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Join Date</Label>
                <Input type="date" value={form.join_date} onChange={(e) => setForm({ ...form, join_date: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd}>Add Employee</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesPage;
