import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/utils/cn';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ClipboardList,
  GraduationCap,
  Briefcase,
  CalendarCheck,
  BookOpen,
  Award,
  FileText,
  Calendar,
  Building2,
  MessageSquare,
  FolderOpen,
  CreditCard,
  BarChart3,
  Settings,
  Shield,
  UserCog,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  key: string;
  to: string;
  icon: React.ReactNode;
}

interface NavGroup {
  groupKey: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupKey: 'coreModules',
    items: [
      {
        key: 'dashboard',
        to: '/dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      { key: 'students', to: '/students', icon: <Users className="h-5 w-5" /> },
      {
        key: 'guardians',
        to: '/guardians',
        icon: <UserCheck className="h-5 w-5" />,
      },
      {
        key: 'admissions',
        to: '/admissions',
        icon: <ClipboardList className="h-5 w-5" />,
      },
    ],
  },
  {
    groupKey: 'academicsModules',
    items: [
      {
        key: 'teachers',
        to: '/staff',
        icon: <GraduationCap className="h-5 w-5" />,
      },
      {
        key: 'academicStructure',
        to: '/academic-structure',
        icon: <Building2 className="h-5 w-5" />,
      },
      {
        key: 'attendance',
        to: '/attendance',
        icon: <CalendarCheck className="h-5 w-5" />,
      },
      {
        key: 'assessments',
        to: '/assessments',
        icon: <BookOpen className="h-5 w-5" />,
      },
      {
        key: 'grades',
        to: '/assessments/gradebook',
        icon: <Award className="h-5 w-5" />,
      },
      {
        key: 'reportCards',
        to: '/assessments/report-cards',
        icon: <FileText className="h-5 w-5" />,
      },
      {
        key: 'timetable',
        to: '/timetable',
        icon: <Calendar className="h-5 w-5" />,
      },
    ],
  },
  {
    groupKey: 'financeModules',
    items: [
      {
        key: 'finance',
        to: '/finance',
        icon: <CreditCard className="h-5 w-5" />,
      },
      {
        key: 'communications',
        to: '/communications',
        icon: <MessageSquare className="h-5 w-5" />,
      },
      {
        key: 'documents',
        to: '/documents',
        icon: <FolderOpen className="h-5 w-5" />,
      },
      {
        key: 'humanResources',
        to: '/hr',
        icon: <Briefcase className="h-5 w-5" />,
      },
    ],
  },
  {
    groupKey: 'systemModules',
    items: [
      {
        key: 'organizations',
        to: '/organizations',
        icon: <Settings className="h-5 w-5" />,
      },
      {
        key: 'reporting',
        to: '/reporting',
        icon: <BarChart3 className="h-5 w-5" />,
      },
      {
        key: 'gdprCompliance',
        to: '/gdpr',
        icon: <Shield className="h-5 w-5" />,
      },
      {
        key: 'userManagement',
        to: '/users',
        icon: <UserCog className="h-5 w-5" />,
      },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { t } = useTranslation('navigation');

  return (
    <aside
      className={cn(
        'flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out shrink-0 h-full',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center h-16 border-b border-slate-200 px-4 shrink-0',
          collapsed ? 'justify-center' : 'gap-3'
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
          <GraduationCap className="h-5 w-5" aria-hidden="true" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <span className="font-bold text-slate-900 text-sm tracking-tight block truncate">
              SchoolOS
            </span>
            <span className="text-xs text-slate-400 block">
              Education Platform
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav
        className="flex-1 overflow-y-auto py-3 px-2 space-y-4"
        aria-label="Main navigation"
      >
        {NAV_GROUPS.map(group => (
          <div key={group.groupKey}>
            {!collapsed && (
              <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-widest text-slate-400 select-none">
                {t(group.groupKey)}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map(item => (
                <li key={item.key}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/dashboard'}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1',
                        isActive
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                        collapsed && 'justify-center px-2'
                      )
                    }
                    title={collapsed ? t(item.key) : undefined}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    {!collapsed && (
                      <span className="truncate">{t(item.key)}</span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="shrink-0 border-t border-slate-200 p-2">
        <button
          onClick={onToggle}
          className={cn(
            'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
            collapsed && 'justify-center'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
