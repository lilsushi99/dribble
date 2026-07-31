import React, { useState } from 'react';
import { FormSubmissionData } from '../types/admin.types';
import { Card, Badge, Button, Input, Modal } from '../components/ui';
import { Inbox, Search, Clock, Mail, Building, DollarSign, MessageSquare, Eye } from 'lucide-react';

export interface FormsPageProps {
  submissions: FormSubmissionData[];
}

export const FormsPage: React.FC<FormsPageProps> = ({ submissions }) => {
  const [selectedSub, setSelectedSub] = useState<FormSubmissionData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = submissions.filter((s) => {
    return (
      s.data_json.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.ip_address && s.ip_address.includes(searchQuery))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
            <Inbox className="w-5 h-5 text-blue-500" />
            <span>Form Submissions & Lead Inquiries</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Incoming diagnostic inquiries, book-a-call requests, and contact messages stored in MySQL.
          </p>
        </div>

        <Input
          icon={<Search className="w-4 h-4" />}
          placeholder="Filter submissions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64"
        />
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-zinc-800 text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider bg-slate-50/50 dark:bg-zinc-950/40">
              <th className="py-3.5 px-4">Client Name</th>
              <th className="py-3.5 px-4">Company & Email</th>
              <th className="py-3.5 px-4">Estimated Budget</th>
              <th className="py-3.5 px-4">Received Date</th>
              <th className="py-3.5 px-4 text-right">View Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80 text-xs">
            {filtered.map((sub) => {
              let parsed: any = {};
              try {
                parsed = JSON.parse(sub.data_json);
              } catch (e) {
                parsed = {};
              }

              return (
                <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-zinc-100">
                    {parsed.full_name || 'Anonymous Inquiry'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800 dark:text-zinc-200">{parsed.email}</span>
                      <span className="text-[11px] text-slate-400">{parsed.company || 'Private Client'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="emerald">{parsed.budget || 'Custom Scope'}</Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-zinc-400">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Eye className="w-3.5 h-3.5 text-blue-500" />}
                      onClick={() => setSelectedSub(sub)}
                    >
                      Inspect
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedSub}
        onClose={() => setSelectedSub(null)}
        title="Form Lead Submission Details"
        subtitle="Complete payload record from Hostinger MySQL database"
      >
        {selectedSub && (
          <div className="space-y-4 text-xs">
            {(() => {
              let parsed: any = {};
              try {
                parsed = JSON.parse(selectedSub.data_json);
              } catch (e) {
                parsed = {};
              }
              return (
                <>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800 space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-500">Client Name:</span>
                      <span className="text-slate-900 dark:text-zinc-100">{parsed.full_name}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-500">Email Address:</span>
                      <span className="text-blue-600 dark:text-blue-400">{parsed.email}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-500">Company / Organization:</span>
                      <span className="text-slate-900 dark:text-zinc-100">{parsed.company}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-500">Target Budget:</span>
                      <span className="text-emerald-600 dark:text-emerald-400">{parsed.budget}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Message Payload</span>
                    <p className="text-slate-800 dark:text-zinc-200 leading-relaxed font-sans pt-1">
                      "{parsed.message}"
                    </p>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </Modal>
    </div>
  );
};
