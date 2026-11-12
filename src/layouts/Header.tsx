import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTenant } from '@/providers';
import { supportedLanguages, SupportedLanguage, languageLabels } from '@/i18n';
import {
  Menu,
  Bell,
  Building,
  School,
  Globe,
  ChevronDown,
  User,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/shared/components/ui';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { i18n } = useTranslation();
  const {
    organizations,
    activeOrganization,
    activeCampus,
    setActiveOrganization,
    setActiveCampus,
  } = useTenant();

  const [isTenantMenuOpen, setIsTenantMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const tenantMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tenantMenuRef.current &&
        !tenantMenuRef.current.contains(event.target as Node)
      ) {
        setIsTenantMenuOpen(false);
      }
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(event.target as Node)
      ) {
        setIsLangMenuOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('schoolos_lang', lang);
    setIsLangMenuOpen(false);
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 md:px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
      {/* Left: Mobile hamburger & breadcrumb/tenant context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Institution & Campus Context Selector Dropdown */}
        <div className="relative" ref={tenantMenuRef}>
          <button
            onClick={() => setIsTenantMenuOpen(prev => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-expanded={isTenantMenuOpen}
          >
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 leading-tight">
                <Building className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                <span className="truncate max-w-[150px] sm:max-w-[220px]">
                  {activeOrganization?.name ?? 'Select School'}
                </span>
              </span>
              <span className="text-[11px] text-slate-500 flex items-center gap-1 leading-tight">
                <School className="h-3 w-3 text-slate-400 shrink-0" />
                <span className="truncate max-w-[140px] sm:max-w-[200px]">
                  {activeCampus?.name ?? 'All Campuses'}
                </span>
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-1" />
          </button>

          {isTenantMenuOpen && (
            <div className="absolute left-0 mt-2 w-72 rounded-xl bg-white shadow-lg border border-slate-200 p-2 z-50">
              <div className="text-xs font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Select Institution & Campus
              </div>
              <div className="space-y-1 mt-1 max-h-80 overflow-y-auto">
                {organizations.map(org => (
                  <div
                    key={org.id}
                    className="p-1 border-b border-slate-100 last:border-b-0"
                  >
                    <button
                      onClick={() => {
                        setActiveOrganization(org);
                        setIsTenantMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium text-slate-900 hover:bg-slate-50 flex items-center justify-between"
                    >
                      <span className="truncate">{org.name}</span>
                      <Badge
                        size="sm"
                        variant={
                          org.id === activeOrganization?.id
                            ? 'brand'
                            : 'neutral'
                        }
                      >
                        {org.baseCurrency}
                      </Badge>
                    </button>
                    {/* Campuses under this org */}
                    <div className="pl-4 mt-1 space-y-0.5">
                      {org.campuses.map(campus => (
                        <button
                          key={campus.id}
                          onClick={() => {
                            if (org.id !== activeOrganization?.id) {
                              setActiveOrganization(org);
                            }
                            setActiveCampus(campus);
                            setIsTenantMenuOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1 rounded text-[11px] flex items-center justify-between transition-colors ${
                            activeCampus?.id === campus.id
                              ? 'bg-brand-50 text-brand-700 font-medium'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className="truncate">{campus.name}</span>
                          <span className="text-[10px] text-slate-400">
                            {campus.type}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right controls: Language, Notifications, User */}
      <div className="flex items-center gap-2">
        {/* Language Switcher */}
        <div className="relative" ref={langMenuRef}>
          <button
            onClick={() => setIsLangMenuOpen(prev => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="Change language"
          >
            <Globe className="h-3.5 w-3.5 text-slate-500" />
            <span>
              {languageLabels[i18n.language as SupportedLanguage] || 'EN'}
            </span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {isLangMenuOpen && (
            <div className="absolute right-0 mt-2 w-36 rounded-lg bg-white shadow-lg border border-slate-200 py-1 z-50">
              {supportedLanguages.map(lang => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                    i18n.language === lang
                      ? 'text-brand-600 font-semibold bg-brand-50'
                      : 'text-slate-700'
                  }`}
                >
                  <span>
                    {lang === 'en'
                      ? 'English'
                      : lang === 'fr'
                        ? 'Français'
                        : 'Deutsch'}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 uppercase">
                    {lang}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
        </button>

        {/* User Profile */}
        <div className="relative ml-1" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(prev => !prev)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="User profile menu"
          >
            <div className="h-8 w-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-semibold text-xs shadow-sm">
              AD
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-slate-200 p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">
                  Dr. Antoine Dubois
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  antoine.dubois@schoolos.eu
                </p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-brand-700 font-medium">
                  <ShieldCheck className="h-3 w-3" /> Campus Principal & Admin
                </div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                >
                  <User className="h-3.5 w-3.5 text-slate-400" /> Profile &
                  Account
                </button>
                <button
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="h-3.5 w-3.5 text-rose-500" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
