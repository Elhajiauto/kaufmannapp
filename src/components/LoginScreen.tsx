import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Flame,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Wrench,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { authenticateUser } from '../lib/firebase';
import { AppUser } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (user: AppUser) => void;
  onContinueAsVisitor?: () => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onContinueAsVisitor,
  onClose,
  isModal = false,
}) => {
  // Empty inputs by default - strictly confidential
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Veuillez renseigner votre email et mot de passe administrateur.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessInfo(null);

    try {
      const result = await authenticateUser(email, password);

      if (result.success && result.user) {
        setSuccessInfo(
          `Connexion réussie ! Bienvenue ${result.user.displayName}.`
        );
        setTimeout(() => {
          onLoginSuccess(result.user!);
        }, 600);
      } else {
        setErrorMessage(
          result.error ||
            'Email ou mot de passe incorrect. Accès réservé à l\'administrateur.'
        );
      }
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Une erreur inattendue est survenue lors de la connexion.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const containerClasses = isModal
    ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs'
    : 'min-h-screen bg-linear-to-br from-slate-900 via-[#001f3f] to-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100';

  return (
    <div className={containerClasses}>
      {/* Background geometric accents if full screen */}
      {!isModal && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#e52e2d] blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-600 blur-3xl" />
        </div>
      )}

      <div className="w-full max-w-md relative z-10">
        {/* Brand Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-tr from-[#e52e2d] to-red-600 shadow-xl shadow-red-500/20 mb-3 border border-red-400/30">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase drop-shadow-sm">
            EL HAJI AUTO
          </h1>
          <p className="text-xs text-slate-300 font-medium mt-1">
            Pièces Détachées & Système de Facturation · Tanger
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/60 border border-red-500/30 rounded-full mt-2.5 text-[11px] font-semibold text-red-200">
            <Lock className="w-3 h-3 text-[#e52e2d]" />
            <span>Portail Administrateur Privé</span>
          </div>
        </div>

        {/* Card Form */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          {onClose && (
            <button
              onClick={onClose}
              type="button"
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer text-xs font-semibold"
            >
              ✕ Fermer
            </button>
          )}

          <div className="mb-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#e52e2d]" />
              Connexion Administrateur
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Entrez vos identifiants pour gérer le stock, les prix d'achat et les factures.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-950/80 border border-red-500/40 rounded-xl flex items-start gap-3 text-red-200 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-100">Erreur de connexion</p>
                <p className="mt-0.5 text-red-200/90">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successInfo && (
            <div className="mb-5 p-3.5 bg-emerald-950/80 border border-emerald-500/40 rounded-xl flex items-center gap-3 text-emerald-200 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="font-semibold text-emerald-100">{successInfo}</p>
                <p className="text-[11px] text-emerald-300/80">Chargement de votre session...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#e52e2d] focus:ring-1 focus:ring-[#e52e2d] placeholder-slate-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#e52e2d] focus:ring-1 focus:ring-[#e52e2d] placeholder-slate-500 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  title={showPassword ? 'Masquer' : 'Afficher'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-linear-to-r from-[#e52e2d] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm uppercase tracking-wider"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Vérification des accès...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Se connecter</span>
                </>
              )}
            </button>
          </form>

          {/* Optional: Visitor / Client Link */}
          {onContinueAsVisitor && (
            <div className="mt-5 pt-4 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={onContinueAsVisitor}
                className="w-full py-2.5 px-3 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-slate-700/60 cursor-pointer"
              >
                <span>Consulter le catalogue en mode client (Visiteur)</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <p className="text-[10px] text-slate-400 mt-1.5">
                Les prix d'achat, marges et factures restent strictement masqués.
              </p>
            </div>
          )}

          {/* Security note */}
          <div className="mt-4 pt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Authentification Firebase
            </span>
            <span className="flex items-center gap-1 text-slate-400 font-medium">
              SSL / Chiffrement 256-bit
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} GARAGE AUTO EL HAJI · Tanger (Maroc)</p>
        </div>
      </div>
    </div>
  );
};
