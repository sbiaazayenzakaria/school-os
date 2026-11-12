import React from 'react';
import { Plus, CheckCircle } from 'lucide-react';
import { Card, CardContent, Button, Badge } from '@/shared/components/ui';

export const UsersPage: React.FC = () => {
  const users = [
    {
      name: 'Dr. Antoine Dubois',
      email: 'antoine.dubois@schoolos.eu',
      role: 'CAMPUS_PRINCIPAL',
      status: 'ACTIVE',
      mfa: true,
    },
    {
      name: 'Marie Dupont',
      email: 'marie.dupont@ecole-paris.fr',
      role: 'TEACHER',
      status: 'ACTIVE',
      mfa: true,
    },
    {
      name: 'Klaus Weber',
      email: 'k.weber@bavarian-demo.de',
      role: 'TEACHER',
      status: 'ACTIVE',
      mfa: false,
    },
    {
      name: 'Nathalie Fontaine',
      email: 'n.fontaine@email.fr',
      role: 'PARENT',
      status: 'ACTIVE',
      mfa: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            User Management & Role-Based Access Control (RBAC)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global identity, multi-factor authentication (MFA), and
            tenant-scoped security keys
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leadingIcon={<Plus className="h-4 w-4" />}
        >
          Invite User
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Role Hierarchy</th>
                <th className="p-3">MFA Status</th>
                <th className="p-3 text-right">Account State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">
                    <div>
                      <span>{u.name}</span>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        {u.email}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge variant="brand" size="sm">
                      {u.role}
                    </Badge>
                  </td>
                  <td className="p-3">
                    {u.mfa ? (
                      <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-emerald-600" /> MFA
                        Enforced
                      </span>
                    ) : (
                      <span className="text-slate-400">Password Only</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <Badge variant="success" size="sm" dot>
                      {u.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
