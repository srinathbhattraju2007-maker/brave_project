import React from 'react';
import { Search, Sun, Moon, Menu, ShieldCheck, ShieldAlert, Info, MapPin, Clock, LogOut } from 'lucide-react';

export default function BrandedHeader({ 
  searchQuery, 
  setSearchQuery, 
  darkMode, 
  toggleDarkMode,
  isAdmin,
  onMenuToggle,
  lang,
  setLang,
  t,
  onExit
}) {
  const translate = t || ((k) => k);
  return (
    <header className="sticky top-0 z-10 w-full border-b border-border-card bg-bg-main/95 backdrop-blur-md transition-colors duration-200 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 select-none">
      
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle (hamburger) */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 border border-border-card text-text-muted hover:text-text-main rounded-full bg-bg-card hover:bg-bg-main transition-all cursor-pointer"
          aria-label="Toggle Sidebar Menu"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="font-display font-extrabold text-2xl tracking-tighter text-text-main leading-none">
            {lang === 'en' ? 'MERCHANDISE' : 'మర్చండైజ్'}<span className="text-[#bd00ff]">.</span>
          </div>
        </div>
      </div>

      {/* Middle: Live Search Bar (Rounded Pill Style) */}
      <div className="flex-1 max-w-sm relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-text-muted" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={translate('searchPlaceholder')}
          className="block w-full pl-10 pr-4 py-2 border border-border-card rounded-full bg-bg-card text-text-main placeholder-text-muted/50 focus:outline-none focus:border-[#bd00ff] focus:ring-1 focus:ring-[#bd00ff]/30 font-mono-system text-[11px] tracking-wider uppercase transition-all"
        />
      </div>

      {/* Right: Info Hover, Theme Switch, and Active Badge */}
      <div className="flex items-center gap-3 font-mono-system text-[10px]">
        
        {/* Language Toggle Button */}
        <button
          onClick={() => setLang(lang === 'en' ? 'te' : 'en')}
          className="btn-secondary px-3 py-1.5 text-[9px] rounded-full font-bold uppercase"
        >
          {lang === 'en' ? 'తెలుగు' : 'ENGLISH'}
        </button>

        {/* System Stability Widget */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-border-card bg-bg-card text-text-muted rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
          <span>{translate('stability')} <span className="text-text-main font-bold">100%</span></span>
        </div>

        {/* Active Session Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-border-card bg-bg-card rounded-full">
          {isAdmin ? (
            <>
              <ShieldCheck className="h-3.5 w-3.5 text-[#bd00ff]" />
              <span className="text-[#bd00ff] font-bold uppercase tracking-wider">{translate('rootOp')}</span>
            </>
          ) : (
            <>
              <ShieldAlert className="h-3.5 w-3.5 text-text-muted" />
              <span className="text-text-muted uppercase tracking-wider">{translate('guestOp')}</span>
            </>
          )}
        </div>

        {/* Info Box Hover (Location/Hours) */}
        <div className="relative group hidden md:block">
          <button className="p-2 border border-border-card bg-bg-card text-text-muted hover:text-text-main rounded-full transition-all cursor-pointer">
            <Info className="h-4 w-4" />
          </button>
          
          <div className="absolute right-0 top-full mt-2 w-64 p-4 rounded-2xl bg-bg-card border border-border-card shadow-2xl opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none transition-all duration-200 z-50 text-left">
            <h4 className="font-display text-sm font-bold text-[#bd00ff] tracking-wider mb-2 leading-none uppercase">
              {translate('merchantCoords')}
            </h4>
            <div className="space-y-2 text-xs text-text-muted">
              <p className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#bd00ff] shrink-0 mt-0.5" />
                <span>{translate('address')}</span>
              </p>
              <p className="flex items-start gap-2">
                <Clock className="h-3.5 w-3.5 text-[#bd00ff] shrink-0 mt-0.5" />
                <span>{translate('activeHours')}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="p-2 border border-border-card bg-bg-card text-text-muted hover:text-text-main rounded-full transition-all cursor-pointer"
          aria-label="Toggle Theme"
        >
          {darkMode ? <Sun className="h-4 w-4 text-[#bd00ff]" /> : <Moon className="h-4 w-4 text-[#bd00ff]" />}
        </button>

        {/* Exit Portal Button */}
        {onExit && (
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/25 hover:text-red-300 hover:border-red-400/60 rounded-full transition-all cursor-pointer group"
            aria-label="Exit to Portal"
            title={translate('exitPortal')}
          >
            <LogOut className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline text-[9px] font-bold uppercase tracking-wider">{translate('exitPortal')}</span>
          </button>
        )}

      </div>
    </header>
  );
}
