import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Boxes,
  LayoutDashboard,
  FileText,
  ChevronDown,
  Plus,
  ArrowDownToLine,
  Receipt,
  Check,
  User,
  LogOut,
  Lock,
} from 'lucide-react';
import { AppUser } from '../types';

export type MainNavView = 'catalogue' | 'factures';

interface KaufmannHeaderProps {
  currentView: MainNavView;
  setCurrentView: (view: MainNavView) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onOpenAddModal: () => void;
  onOpenStockArrivalModal: () => void;
  onOpenNewInvoiceModal: () => void;
  selectedFamily: string;
  setSelectedFamily: (family: string) => void;
  totalInvoicesCount: number;
  firebaseStatus?: 'connected' | 'blocked' | 'checking';
  onOpenFirebaseModal?: () => void;
  currentUser?: AppUser | null;
  onOpenAccountModal?: () => void;
  onLogout?: () => void;
  onOpenLoginModal?: () => void;
}

export const KaufmannHeader: React.FC<KaufmannHeaderProps> = ({
  currentView,
  setCurrentView,
  searchTerm,
  setSearchTerm,
  onOpenAddModal,
  onOpenStockArrivalModal,
  onOpenNewInvoiceModal,
  selectedFamily,
  setSelectedFamily,
  totalInvoicesCount,
  firebaseStatus = 'checking',
  onOpenFirebaseModal,
  currentUser,
  onOpenAccountModal,
  onLogout,
  onOpenLoginModal,
}) => {
  const [isFamilyDropdownOpen, setIsFamilyDropdownOpen] = useState(false);
  const familyDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (familyDropdownRef.current && !familyDropdownRef.current.contains(e.target as Node)) {
        setIsFamilyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const familiesList = [
    'Toutes les familles',
    'Filtre à air',
    'Filtre à carburant',
    'Filtre à huile',
    'Filtre air d\'habitacle',
    'Disques de frein',
    'Plaquettes de frein',
    'Alternateurs & Démarreurs',
    'Batteries',
    'Balais d\'essuie-glace',
    'Huiles & Lubrifiants',
    'Amortisseurs & Suspension',
    'Embrayage',
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs no-print">
      {/* Top Bar with Brand, Big Search, and Action Buttons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Left: Burger Menu & EL HAJI AUTO Logo */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setIsFamilyDropdownOpen(!isFamilyDropdownOpen)}
              className="p-2 rounded-md hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Menu Familles"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Red Kaufmann-style Logo */}
            <div
              onClick={() => setCurrentView('catalogue')}
              className="cursor-pointer select-none"
            >
              <div className="text-2xl font-black tracking-tight text-[#e52e2d] leading-none uppercase">
                EL HAJI AUTO
              </div>
              <div className="text-[10px] font-bold text-slate-700 tracking-tight mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span className="bg-slate-900 text-white px-1.5 py-0.2 rounded font-mono text-[9px]">
                  PORTAIL ADMIN
                </span>
                {firebaseStatus === 'connected' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenFirebaseModal) onOpenFirebaseModal();
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-1.5 py-0.2 rounded font-mono text-[9px] flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                    title="Firebase Connecté - Cliquez pour gérer la synchronisation"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                    <span>FIREBASE (kaufmann-projet)</span>
                  </button>
                )}
                {firebaseStatus === 'blocked' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenFirebaseModal) onOpenFirebaseModal();
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-2 py-0.5 rounded font-mono text-[9px] font-black flex items-center gap-1 shadow-xs cursor-pointer transition-colors animate-pulse"
                    title="Règles Firestore bloquées - Cliquez pour débloquer en 30 secondes"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-200"></span>
                    <span>⚠️ FIREBASE BLOQUÉ (CLIQUEZ ICI)</span>
                  </button>
                )}
                {firebaseStatus === 'checking' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenFirebaseModal) onOpenFirebaseModal();
                    }}
                    className="bg-slate-700 text-slate-300 px-1.5 py-0.2 rounded font-mono text-[9px] flex items-center gap-1 cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"></span>
                    <span>FIREBASE: VÉRIFICATION...</span>
                  </button>
                )}
                <span className="hidden md:inline">GARAGE AUTO EL HAJI · TANGER</span>
              </div>
            </div>
          </div>

          {/* Center: Search input */}
          <div className="flex-1 max-w-2xl mx-2">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher une pièce par RÉFÉRENCE, OE, NOM, VÉHICULE..."
                className="w-full pl-10 pr-20 py-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#e52e2d] focus:ring-1 focus:ring-[#e52e2d] transition-all font-medium shadow-2xs"
              />
              <span className="absolute right-3 text-[11px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 pointer-events-none">
                Ctrl + K
              </span>
            </div>
          </div>

          {/* Right: Quick Action Buttons for Morad */}
          <div className="flex items-center gap-2.5 shrink-0">
            {currentUser ? (
              <>
                {/* Quick Stock Arrival (Entrée de stock) */}
                <button
                  onClick={onOpenStockArrivalModal}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs cursor-pointer"
                  title="Ajouter des quantités reçues au stock"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  <span className="hidden sm:inline">Entrée Stock</span>
                </button>

                {/* Quick Add Product Button (Nouveau Produit) */}
                <button
                  onClick={onOpenAddModal}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors shadow-2xs cursor-pointer border border-slate-700"
                  title="Ajouter un nouveau produit au catalogue"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">+ Nouveau Produit</span>
                </button>

                {/* Create Invoice Button */}
                <button
                  onClick={onOpenNewInvoiceModal}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#e52e2d] hover:bg-[#c82322] rounded-lg transition-colors shadow-2xs cursor-pointer"
                  title="Créer une nouvelle facture suite à une vente"
                >
                  <Receipt className="w-4 h-4" />
                  <span>+ Nouvelle Facture</span>
                </button>

                {/* Authenticated Admin Badge & Profile Button */}
                <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
                  <button
                    type="button"
                    onClick={onOpenAccountModal}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors text-xs font-semibold cursor-pointer border border-slate-200"
                    title="Voir les détails du compte administrateur et de la base Firebase"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#e52e2d] text-white flex items-center justify-center text-[10px] font-black shadow-xs">
                      HA
                    </div>
                    <div className="hidden lg:block text-left">
                      <div className="text-[11px] font-bold leading-tight text-slate-900">
                        EL HAJI AUTO
                      </div>
                      <div className="text-[9px] text-emerald-600 font-mono font-semibold leading-tight flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Admin · Firebase</span>
                      </div>
                    </div>
                  </button>

                  {onLogout && (
                    <button
                      type="button"
                      onClick={onLogout}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Se déconnecter (Verrouiller le portail)"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* Public / Client View: Only a secure Admin Login button */
              <button
                type="button"
                onClick={onOpenLoginModal}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-linear-to-r from-[#e52e2d] to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all shadow-md shadow-red-500/20 cursor-pointer"
                title="Connexion réservée à l'administrateur"
              >
                <Lock className="w-4 h-4" />
                <span>Connexion Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dark Navy Sub-Navigation Bar */}
      <div className="bg-[#001f3f] text-white text-xs font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {/* 1. TABLEAU DE BORD TAB */}
              <button
                onClick={() => setCurrentView('catalogue')}
                className={`flex items-center gap-2 px-5 py-2.5 transition-colors whitespace-nowrap cursor-pointer ${
                  currentView === 'catalogue'
                    ? 'bg-[#e52e2d] text-white font-bold shadow-xs'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">
                  {currentUser ? 'Tableau de Bord' : 'Catalogue Pièces'}
                </span>
              </button>

              {/* 2. MES FACTURES TAB (CONFIDENTIAL - SHOWN ONLY TO AUTHENTICATED ADMIN) */}
              {currentUser && (
                <button
                  onClick={() => setCurrentView('factures')}
                  className={`flex items-center gap-2 px-5 py-2.5 transition-colors whitespace-nowrap cursor-pointer ${
                    currentView === 'factures'
                      ? 'bg-[#e52e2d] text-white font-bold shadow-xs'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wide">Mes Factures</span>
                  {totalInvoicesCount > 0 && (
                    <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
                      {totalInvoicesCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
