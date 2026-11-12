import React, { useMemo } from 'react';
import { useTenant } from '@/providers';
import { ANNOUNCEMENTS } from '@/data/mockData';
import { formatDate } from '@/shared/utils/formatters';
import { Plus, AlertTriangle, Globe } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  useToast,
} from '@/shared/components/ui';

export const CommunicationsPage: React.FC = () => {
  const { activeOrganization } = useTenant();
  const { success } = useToast();

  const announcements = useMemo(() => {
    return ANNOUNCEMENTS.filter(
      a => a.organizationId === (activeOrganization?.id ?? 'org-ecole-paris')
    );
  }, [activeOrganization]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Multilingual Communications & Safety Broadcasts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Side-by-side authoring in EN, FR, DE, high-priority emergency alerts
            & audience targeting
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leadingIcon={<Plus className="h-4 w-4" />}
          onClick={() =>
            success('Composer Opened', {
              message: 'Multilingual circular announcement composer launched.',
            })
          }
        >
          Author Announcement
        </Button>
      </div>

      <div className="space-y-4">
        {announcements.map(ann => (
          <Card
            key={ann.id}
            className={ann.isUrgent ? 'border-rose-400 bg-rose-50/20' : ''}
          >
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {ann.isUrgent ? (
                    <Badge variant="danger" size="sm">
                      <AlertTriangle className="h-3 w-3 mr-1" /> URGENT
                      BROADCAST
                    </Badge>
                  ) : (
                    <Badge variant="brand" size="sm">
                      NOTICE
                    </Badge>
                  )}
                  <span className="text-xs font-semibold text-slate-500">
                    Audience: {ann.audience}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {formatDate(ann.publishedAt)}
                </span>
              </div>
              <CardTitle className="text-base mt-2">{ann.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-slate-700 leading-relaxed">
                {ann.body}
              </p>

              {ann.translations.length > 0 && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Globe className="h-3 w-3" /> Available Translations:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ann.translations.map((tr, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        <span className="font-bold text-slate-800 uppercase block text-[10px]">
                          [{tr.lang}] {tr.title}
                        </span>
                        <p className="text-slate-600 text-[11px] mt-1">
                          {tr.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
