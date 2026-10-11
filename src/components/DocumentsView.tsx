import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Minus,
  Printer,
  Search,
  CheckCircle2,
  Clock,
  Receipt,
  Trash2,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Car,
  User,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { InvoiceDocument } from '../types';

interface DocumentsViewProps {
  invoices: InvoiceDocument[];
  onPrintInvoice: (inv: InvoiceDocument) => void;
  onOpenNewInvoiceModal: () => void;
  onDeleteInvoice: (id: string) => void;
  onToggleStatus?: (id: string) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  invoices,
  onPrintInvoice,
  onOpenNewInvoiceModal,
  onDeleteInvoice,
  onToggleStatus,
}) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAYÉ' | 'EN_ATTENTE'>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // KPIs
  const totalRevenueMAD = useMemo(
    () => invoices.reduce((acc, inv) => acc + inv.totalTTC_MAD, 0),
    [invoices]
  );

  const paidInvoices = useMemo(
    () => invoices.filter((inv) => inv.status === 'PAYÉ'),
    [invoices]
  );

  const pendingInvoices = useMemo(
    () => invoices.filter((inv) => inv.status === 'EN_ATTENTE'),
    [invoices]
  );

  const pendingTotalMAD = useMemo(
    () => pendingInvoices.reduce((acc, inv) => acc + inv.totalTTC_MAD, 0),
    [pendingInvoices]
  );

  const averageTicketMAD = invoices.length > 0 ? totalRevenueMAD / invoices.length : 0;

  // Filter & sort
  const filteredInvoices = useMemo(() => {
    return invoices
      .filter((inv) => {
        if (statusFilter !== 'ALL' && inv.status !== statusFilter) return false;
        if (typeFilter !== 'ALL' && inv.type !== typeFilter) return false;
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          return (
            inv.invoiceNumber.toLowerCase().includes(term) ||
            inv.clientName.toLowerCase().includes(term) ||
            (inv.clientVehicle && inv.clientVehicle.toLowerCase().includes(term)) ||
            (inv.clientPhone && inv.clientPhone.toLowerCase().includes(term)) ||
            inv.itemsSummary.toLowerCase().includes(term)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'date_asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortBy === 'amount_desc') return b.totalTTC_MAD - a.totalTTC_MAD;
        if (sortBy === 'amount_asc') return a.totalTTC_MAD - b.totalTTC_MAD;
        return 0;
      });
  }, [invoices, statusFilter, typeFilter, searchTerm, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Mes Factures
            </h1>
            <span className="bg-[#001f3f] text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded">
              GARAGE AUTO EL HAJI
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gérez toutes vos ventes de pièces détachées, encaissez vos clients et imprimez les factures officielles de l'établissement.
          </p>
        </div>

        <button
          onClick={onOpenNewInvoiceModal}
          className="px-5 py-2.5 bg-[#e52e2d] hover:bg-[#c82322] text-white font-extrabold text-xs rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider shrink-0"
        >
          <Receipt className="w-4 h-4" />
          <span>+ Nouvelle Vente / Facture</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Facturé (TTC)</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 tabular-nums">
            {totalRevenueMAD.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block">
            {paidInvoices.length} factures encaissées
          </span>
        </div>

        {/* Invoice Count */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Nombre de Factures</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900">
            {invoices.length}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Dossiers enregistrés
          </span>
        </div>

        {/* En Attente */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">En Attente / Crédit</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-600 tabular-nums">
            {pendingTotalMAD.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
          </div>
          <span className="text-[11px] text-amber-700 font-semibold block">
            {pendingInvoices.length} dossier(s) en attente
          </span>
        </div>

        {/* Average Ticket */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Vente Moyenne</span>
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 tabular-nums">
            {averageTicketMAD.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
          </div>
          <span className="text-[11px] text-slate-500 block">
            Par facture émise
          </span>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        {/* Filters and Search Bar */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row gap-3 text-xs items-center justify-between">
          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            {/* Status Tabs */}
            <div className="inline-flex bg-slate-200/80 p-0.5 rounded-lg text-slate-700">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                  statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                Toutes ({invoices.length})
              </button>
              <button
                onClick={() => setStatusFilter('PAYÉ')}
                className={`px-3 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                  statusFilter === 'PAYÉ' ? 'bg-white text-emerald-700 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                Payées ({paidInvoices.length})
              </button>
              <button
                onClick={() => setStatusFilter('EN_ATTENTE')}
                className={`px-3 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                  statusFilter === 'EN_ATTENTE' ? 'bg-white text-amber-700 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                En Attente ({pendingInvoices.length})
              </button>
            </div>

            {/* Type selector */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-none focus:border-[#e52e2d]"
            >
              <option value="ALL">Tous types</option>
              <option value="FACTURE">Factures</option>
              <option value="BON_COMMANDE">Bons de Commande</option>
            </select>

            {/* Sort selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-none focus:border-[#e52e2d]"
            >
              <option value="date_desc">Plus récentes en premier</option>
              <option value="date_asc">Plus anciennes</option>
              <option value="amount_desc">Montant le plus élevé</option>
              <option value="amount_asc">Montant le plus faible</option>
            </select>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par N°, Client, Véhicule..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#e52e2d] text-xs font-medium"
            />
          </div>
        </div>

        {/* Invoices List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-white text-slate-600 font-black">
                <th className="py-3 px-3 w-10 text-center"></th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Pièce/Service</th>
                <th className="py-3 px-4">Numéro Facture</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Client & Véhicule</th>
                <th className="py-3 px-4">Articles Vendus</th>
                <th className="py-3 px-4 text-right">Montant (TTC)</th>
                <th className="py-3 px-4 text-center">Statut</th>
                <th className="py-3 px-4 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-slate-400">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                        <Receipt className="w-7 h-7 text-slate-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-slate-700 text-sm">
                          {invoices.length === 0 ? 'Aucune facture réelle enregistrée pour le moment' : 'Aucune facture ne correspond à votre recherche'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {invoices.length === 0
                            ? 'Toutes les factures fictives ont été supprimées. Cliquez ci-dessous pour saisir votre première vraie facture comptoir ou atelier.'
                            : 'Modifiez vos filtres ou termes de recherche.'}
                        </p>
                      </div>
                      <button
                        onClick={onOpenNewInvoiceModal}
                        className="px-5 py-2.5 bg-[#e52e2d] hover:bg-[#c82322] text-white rounded-lg font-bold text-xs cursor-pointer shadow-sm inline-flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Saisir une nouvelle facture réelle</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const isExpanded = expandedRows[inv.id];
                  const invoiceDate = (() => {
                    try {
                      return new Date(inv.date).toLocaleDateString('fr-FR');
                    } catch {
                      return '10/10/2026';
                    }
                  })();

                  return (
                    <React.Fragment key={inv.id}>
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        {/* Plus button to toggle row details */}
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => toggleExpand(inv.id)}
                            className="w-5 h-5 rounded border border-slate-300 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                            title="Voir les articles"
                          >
                            {isExpanded ? '−' : '+'}
                          </button>
                        </td>

                        {/* Type badge */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded border border-emerald-400 text-emerald-700 bg-emerald-50 text-[11px] font-bold">
                            {inv.type}
                          </span>
                        </td>

                        {/* Category badge */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded border border-sky-400 text-sky-700 bg-sky-50 text-[11px] font-bold">
                            {inv.categoryType}
                          </span>
                        </td>

                        {/* Numéro Facture */}
                        <td className="py-3 px-4 font-bold font-mono text-slate-900 whitespace-nowrap">
                          {inv.invoiceNumber}
                        </td>

                        {/* Date */}
                        <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap text-[11px]">
                          {invoiceDate}
                        </td>

                        {/* Client & Vehicle */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{inv.clientName}</div>
                          {inv.clientVehicle && (
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Car className="w-3 h-3 text-slate-400 inline" />
                              <span>{inv.clientVehicle}</span>
                            </div>
                          )}
                        </td>

                        {/* Items summary */}
                        <td className="py-3 px-4 text-slate-700 font-mono text-[11px] max-w-xs truncate">
                          <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {inv.itemsSummary}
                          </span>
                        </td>

                        {/* Montant TTC */}
                        <td className="py-3 px-4 text-right font-black font-mono text-slate-900 text-sm tabular-nums whitespace-nowrap">
                          {inv.totalTTC_MAD.toLocaleString('fr-FR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{' '}
                          DH
                        </td>

                        {/* Status toggle button */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => onToggleStatus && onToggleStatus(inv.id)}
                            className={`px-2.5 py-1 rounded text-[11px] font-extrabold cursor-pointer border transition-colors ${
                              inv.status === 'PAYÉ'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                            }`}
                            title="Cliquer pour changer de statut"
                          >
                            {inv.status === 'PAYÉ' ? 'PAYÉ' : 'EN ATTENTE'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Print / View */}
                            <button
                              onClick={() => onPrintInvoice(inv)}
                              className="px-2.5 py-1 bg-[#e52e2d] hover:bg-[#c82322] text-white text-[11px] font-bold rounded flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                              title="Imprimer / Télécharger la facture"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Facture</span>
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => {
                                if (confirm(`Supprimer la facture ${inv.invoiceNumber} de ${inv.clientName} ?`)) {
                                  onDeleteInvoice(inv.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                              title="Supprimer la facture"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Accordion: detailed pieces breakdown */}
                      {isExpanded && (
                        <tr className="bg-slate-50">
                          <td colSpan={10} className="p-4 border-t border-slate-200">
                            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
                              {/* Metadata header */}
                              <div className="flex flex-col sm:flex-row justify-between sm:items-center text-xs border-b border-slate-100 pb-2.5 gap-2">
                                <div>
                                  <span className="font-extrabold text-slate-900">
                                    Facture N° {inv.invoiceNumber}
                                  </span>
                                  <span className="text-slate-500 ml-2">
                                    Client : <strong className="text-slate-800">{inv.clientName}</strong>
                                  </span>
                                  {inv.clientPhone && (
                                    <span className="text-slate-500 font-mono ml-2">
                                      · Tél: {inv.clientPhone}
                                    </span>
                                  )}
                                  {inv.clientVehicle && (
                                    <span className="text-slate-500 ml-2">
                                      · Véhicule: <strong className="text-slate-700">{inv.clientVehicle}</strong>
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-500 text-[11px]">
                                    Mode : <strong className="text-slate-800">{inv.paymentMethod || 'Espèces'}</strong>
                                  </span>
                                  <span className="text-slate-500 text-[11px]">
                                    Commercial : <strong className="text-slate-800">{inv.commercial || 'Morad Fouder'}</strong>
                                  </span>
                                </div>
                              </div>

                              {/* Detailed items table */}
                              <div className="space-y-1">
                                <span className="text-[11px] font-bold text-slate-700 block uppercase">
                                  Détail des pièces vendues :
                                </span>
                                <div className="border border-slate-200 rounded-lg overflow-hidden">
                                  <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                                      <tr>
                                        <th className="py-1.5 px-3">Réf</th>
                                        <th className="py-1.5 px-3">Désignation</th>
                                        <th className="py-1.5 px-3 text-center">Qté</th>
                                        <th className="py-1.5 px-3 text-right">P.U TTC</th>
                                        <th className="py-1.5 px-3 text-right">Remise</th>
                                        <th className="py-1.5 px-3 text-right">Total TTC</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                      {inv.itemsDetail && inv.itemsDetail.length > 0 ? (
                                        inv.itemsDetail.map((it, idx) => (
                                          <tr key={idx} className="hover:bg-slate-50/50">
                                            <td className="py-1.5 px-3 font-mono font-bold text-slate-800">
                                              {it.ref}
                                            </td>
                                            <td className="py-1.5 px-3 text-slate-700">
                                              {it.designation}
                                            </td>
                                            <td className="py-1.5 px-3 text-center font-mono font-bold">
                                              {it.quantity}
                                            </td>
                                            <td className="py-1.5 px-3 text-right font-mono">
                                              {it.unitPriceTTC.toFixed(2)} DH
                                            </td>
                                            <td className="py-1.5 px-3 text-right font-mono text-slate-500">
                                              {it.discountPercent}%
                                            </td>
                                            <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">
                                              {it.totalTTC.toFixed(2)} DH
                                            </td>
                                          </tr>
                                        ))
                                      ) : inv.items && inv.items.length > 0 ? (
                                        inv.items.map((it, idx) => (
                                          <tr key={idx} className="hover:bg-slate-50/50">
                                            <td className="py-1.5 px-3 font-mono font-bold text-slate-800">
                                              {it.product.ref}
                                            </td>
                                            <td className="py-1.5 px-3 text-slate-700">
                                              {it.product.title} ({it.product.brand})
                                            </td>
                                            <td className="py-1.5 px-3 text-center font-mono font-bold">
                                              {it.quantity}
                                            </td>
                                            <td className="py-1.5 px-3 text-right font-mono">
                                              {it.product.priceMAD.toFixed(2)} DH
                                            </td>
                                            <td className="py-1.5 px-3 text-right font-mono text-slate-500">
                                              0%
                                            </td>
                                            <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">
                                              {it.totalMAD.toFixed(2)} DH
                                            </td>
                                          </tr>
                                        ))
                                      ) : (
                                        <tr>
                                          <td colSpan={6} className="py-2 text-center text-slate-400">
                                            Aucun détail enregistré
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              {/* Footer of accordion */}
                              <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                                <span className="text-slate-500">
                                  Garage Auto El Haji · Tanger (Maroc)
                                </span>
                                <button
                                  onClick={() => onPrintInvoice(inv)}
                                  className="px-4 py-1.5 bg-[#e52e2d] hover:bg-[#c82322] text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                  <span>Imprimer Facture Officielle</span>
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
