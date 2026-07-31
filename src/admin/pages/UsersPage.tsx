import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Input } from '../components/ui';
import { Users, UserPlus, Shield, Mail, CheckCircle2, Trash2, Edit3, Key, X, Check } from 'lucide-react';
import { adminApi } from '../services/adminApi';

interface UserRecord {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role_id: number;
  role_name: string;
  is_active: number | boolean;
  avatar_url?: string;
}

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);

  const [formState, setFormState] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role_id: 3, // Editor default
  });

  const [submitting, setSubmitting] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getUsers();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (e) {
      console.error('Failed to load users:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormState({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      role_id: 3,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (user: UserRecord) => {
    setEditingUser(user);
    setFormState({
      email: user.email,
      password: '', // leave empty if unchanged
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      role_id: user.role_id || 3,
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingUser) {
        const payload: any = {
          first_name: formState.first_name,
          last_name: formState.last_name,
          role_id: Number(formState.role_id),
        };
        if (formState.password.trim()) {
          payload.password = formState.password;
        }
        await adminApi.updateUser(editingUser.id, payload);
      } else {
        await adminApi.createUser({
          email: formState.email,
          password: formState.password,
          first_name: formState.first_name,
          last_name: formState.last_name,
          role_id: Number(formState.role_id),
        });
      }
      setShowModal(false);
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to remove this administrative user?')) return;
    try {
      await adminApi.deleteUser(id);
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span>Administrative Users & Access Control (RBAC)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Manage authenticated team members, granular roles (Super Admin, Admin, Editor), and password credentials.
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenAdd} icon={<UserPlus className="w-4 h-4" />}>
          Add Admin User
        </Button>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-zinc-800 text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider bg-slate-50/50 dark:bg-zinc-950/40">
              <th className="py-3.5 px-4">User Name</th>
              <th className="py-3.5 px-4">Email Address</th>
              <th className="py-3.5 px-4">Assigned Role</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80 text-xs">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-zinc-100">
                  {u.first_name} {u.last_name}
                </td>
                <td className="py-3 px-4 font-mono text-slate-600 dark:text-zinc-300">{u.email}</td>
                <td className="py-3 px-4">
                  <Badge variant={u.role_id === 1 ? 'purple' : u.role_id === 2 ? 'blue' : 'amber'}>
                    {u.role_name || (u.role_id === 1 ? 'Super Admin' : u.role_id === 2 ? 'Admin' : 'Editor')}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <Badge variant="emerald">Active</Badge>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenEdit(u)}>
                    <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  {u.role_id !== 1 && (
                    <Button variant="outline" size="sm" onClick={() => handleDeleteUser(u.id)} className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/40">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* User Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>{editingUser ? 'Edit User Credentials' : 'Add New Admin User'}</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              {!editingUser && (
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Email Address *</label>
                  <Input
                    required
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="name@kinetic-studio.com"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">First Name</label>
                  <Input
                    value={formState.first_name}
                    onChange={(e) => setFormState({ ...formState, first_name: e.target.value })}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Last Name</label>
                  <Input
                    value={formState.last_name}
                    onChange={(e) => setFormState({ ...formState, last_name: e.target.value })}
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">
                  {editingUser ? 'New Password (leave blank to keep current)' : 'Password *'}
                </label>
                <Input
                  required={!editingUser}
                  type="password"
                  value={formState.password}
                  onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                  placeholder="••••••••••••"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-zinc-300 font-semibold mb-1">Role Permission</label>
                <select
                  value={formState.role_id}
                  onChange={(e) => setFormState({ ...formState, role_id: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 text-xs focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>Super Admin (Full Access)</option>
                  <option value={2}>Admin (Content & Settings)</option>
                  <option value={3}>Editor (Content Only)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
