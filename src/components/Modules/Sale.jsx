import { useState } from 'react';
import { useTranslation } from '../../i18n/TranslationProvider';
import { useFirestore } from '../../hooks/useFirestore';
import { stockService } from '../../services/firestore/stockService';
import { saleService } from '../../services/firestore/saleService';
import ModuleLayout from '../shared/ModuleLayout';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Select from '../shared/Select';
import Modal from '../shared/Modal';
import Alert from '../shared/Alert';

const categories = ['All', 'Medicine', 'Service', 'Supply'];
const paymentTypes = ['Cash', 'Bank Transfer', 'Credit', 'Other'];

const todayStr = () => new Date().toLocaleDateString('en-CA');

function formatLAK(amount) {
  return `₭ ${Number(amount).toLocaleString()}`;
}

function formatCurrency(amount, symbol) {
  return `${symbol} ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Sale() {
  const { t } = useTranslation();

  const categoryLabels = {
    All: t('sale.category.all'),
    Medicine: t('sale.category.medicine'),
    Service: t('sale.category.service'),
    Supply: t('sale.category.supply'),
  };

  const paymentLabels = {
    'Cash': t('sale.payment.cash'),
    'Bank Transfer': t('sale.payment.bankTransfer'),
    'Credit': t('sale.payment.credit'),
    'Other': t('sale.payment.other'),
  };

  const rateSets = [
    { id: 'R001', name: t('sale.rate.standard'), lak: 1, thb: 0.0046, usd: 0.000049, yuan: 0.00035 },
    { id: 'R002', name: t('sale.rate.vip'), lak: 1, thb: 0.0048, usd: 0.000051, yuan: 0.00036 },
    { id: 'R003', name: t('sale.rate.staff'), lak: 1, thb: 0.0042, usd: 0.000045, yuan: 0.00033 },
  ];

  const { data: products } = useFirestore(stockService);
  const { data: sales, add: addSale } = useFirestore(saleService);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [alert, setAlert] = useState(null);

  // Checkout form
  const [checkout, setCheckout] = useState({
    patient: '',
    date: todayStr(),
    rateId: 'R001',
    payment: 'Cash',
  });
  const [checkoutErrors, setCheckoutErrors] = useState({});

  // ── Filtered products ──
  const filtered = products.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // ── Cart helpers ──
  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.id === product.id);
      if (exist) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // ── Checkout ──
  const openCheckout = () => {
    if (cart.length === 0) return;
    setCheckout({ patient: '', date: todayStr(), rateId: 'R001', payment: 'Cash' });
    setCheckoutErrors({});
    setShowCheckout(true);
  };

  const handleCheckoutChange = (field, value) => {
    setCheckout((prev) => ({ ...prev, [field]: value }));
    if (checkoutErrors[field]) setCheckoutErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleCompleteSale = async () => {
    const e = {};
    if (!checkout.patient.trim()) e.patient = t('currency.errors.required');
    if (!checkout.date) e.date = t('currency.errors.required');
    setCheckoutErrors(e);
    if (Object.keys(e).length > 0) return;

    const selectedRate = rateSets.find((r) => r.id === checkout.rateId);

    try {
      await addSale({
        date: checkout.date,
        patient: checkout.patient.trim(),
        items: [...cart],
        total: cartTotal,
        rateName: selectedRate?.name || '',
        payment: checkout.payment,
        status: 'Completed',
        createdAt: todayStr(),
      });

      setCart([]);
      setShowCheckout(false);
      setAlert({ type: 'success', message: `${checkout.patient.trim()} — ${formatLAK(cartTotal)}` });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  return (
    <ModuleLayout title={t('home.modules.sale')}>
      {alert && <Alert type={alert.type} message={alert.message} onDismiss={() => setAlert(null)} />}

      {/* ── Completed Sales ── */}
      {sales.length > 0 && (
        <div className="mb-5">
          <details className="bg-white rounded-2xl shadow-sm border border-[#c6c6c8]/20">
            <summary className="px-5 py-3.5 text-[15px] font-semibold text-[#007AFF] cursor-pointer select-none">
              {t('sale.saleHistory')} ({sales.length})
            </summary>
            <div className="overflow-x-auto border-t border-[#c6c6c8]/20">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="bg-[#f8f8fc]">
                    <th className="text-left py-2.5 px-4 text-[12px] font-bold text-[#8e8e93] uppercase">#</th>
                    <th className="text-left py-2.5 px-4 text-[12px] font-bold text-[#8e8e93] uppercase">{t('sale.date')}</th>
                    <th className="text-left py-2.5 px-4 text-[12px] font-bold text-[#8e8e93] uppercase">{t('sale.patientName')}</th>
                    <th className="text-left py-2.5 px-4 text-[12px] font-bold text-[#8e8e93] uppercase">{t('sale.items')}</th>
                    <th className="text-left py-2.5 px-4 text-[12px] font-bold text-[#8e8e93] uppercase">{t('sale.total')}</th>
                    <th className="text-left py-2.5 px-4 text-[12px] font-bold text-[#8e8e93] uppercase">{t('sale.rateSet')}</th>
                    <th className="text-left py-2.5 px-4 text-[12px] font-bold text-[#8e8e93] uppercase">{t('sale.paymentMethod')}</th>
                    <th className="text-left py-2.5 px-4 text-[12px] font-bold text-[#8e8e93] uppercase">{t('common.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((s, i) => (
                    <tr key={s.id} className="border-b border-[#c6c6c8]/10 hover:bg-[#f8f8fc]">
                      <td className="py-2.5 px-4 text-[#8e8e93]">{i + 1}</td>
                      <td className="py-2.5 px-4">{s.date}</td>
                      <td className="py-2.5 px-4 font-semibold">{s.patient}</td>
                      <td className="py-2.5 px-4">{s.items.length} {t('sale.items')}</td>
                      <td className="py-2.5 px-4 font-semibold">{formatLAK(s.total)}</td>
                      <td className="py-2.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-[#e3f2fd] text-[#1565c0] text-[11px] font-bold">{s.rateName}</span>
                      </td>
                      <td className="py-2.5 px-4 text-[#8e8e93]">{paymentLabels[s.payment] || s.payment}</td>
                      <td className="py-2.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-[#e8f5e9] text-[#2e7d32] text-[11px] font-bold">{t('sale.completed')}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      )}

      {/* ── POS Layout ── */}
      <div className="flex gap-4">
        {/* ── Left: Products ── */}
        <div className="flex-1 min-w-0">
          {/* Search + Categories */}
          <div className="mb-4 space-y-3">
            <input
              type="text"
              placeholder={t('sale.searchProducts')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 bg-white rounded-xl text-[15px] border border-[#c6c6c8]/30 focus:outline-none focus:border-[#007AFF] placeholder-[#8e8e93]"
            />
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-xl text-[13px] font-semibold transition-all ${
                    activeCategory === cat
                      ? 'bg-[#007AFF] text-white'
                      : 'bg-white text-[#3a3a3c] border border-[#c6c6c8]/30 hover:border-[#007AFF]/30'
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                className="bg-white rounded-2xl p-3.5 text-left shadow-sm border border-[#c6c6c8]/20 hover:shadow-md hover:border-[#007AFF]/30 transition-all active:scale-[0.97] cursor-pointer"
              >
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-2 ${
                  p.category === 'Medicine' ? 'bg-[#fce8e8] text-[#d32f2f]' :
                  p.category === 'Service' ? 'bg-[#e3f2fd] text-[#1565c0]' :
                  'bg-[#e8f5e9] text-[#2e7d32]'
                }`}>
                  {categoryLabels[p.category] || p.category}
                </span>
                <p className="text-[14px] font-semibold text-[#1c1c1e] leading-tight mb-1">{p.name}</p>
                <p className="text-[15px] font-bold text-[#007AFF]">{formatLAK(p.price)}</p>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full py-8 text-center text-[#8e8e93] text-[14px] font-medium">
                {t('sale.noProducts')}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Cart ── */}
        <div className="w-80 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-[#c6c6c8]/20 flex flex-col h-[calc(100vh-220px)] sticky top-28">
            {/* Cart Header */}
            <div className="px-4 py-3.5 border-b border-[#c6c6c8]/20 flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-bold text-[#1c1c1e]">{t('sale.cart')}</h3>
                <p className="text-[12px] text-[#8e8e93] font-medium">{cartCount} {cartCount !== 1 ? t('sale.items') : t('sale.item')}</p>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-[13px] font-semibold text-[#ff3b30] hover:opacity-70 transition-opacity"
                >{t('sale.clearAll')}</button>
              )}
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-[#f2f2f7] flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-[#c6c6c8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                  </div>
                  <p className="text-[13px] text-[#8e8e93] font-medium">{t('sale.cartEmpty')}</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2 border-b border-[#c6c6c8]/10 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-[#1c1c1e] truncate">{item.name}</p>
                      <p className="text-[13px] text-[#007AFF] font-bold">{formatLAK(item.price * item.qty)}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-7 h-7 rounded-lg bg-[#f2f2f7] flex items-center justify-center text-[15px] font-bold text-[#3a3a3c] hover:bg-[#e5e5ea] transition-colors"
                      >−</button>
                      <span className="w-7 text-center text-[15px] font-semibold">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-7 h-7 rounded-lg bg-[#007AFF] flex items-center justify-center text-[15px] font-bold text-white hover:bg-[#0066d6] transition-colors"
                      >+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            <div className="px-4 py-3.5 border-t border-[#c6c6c8]/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[#8e8e93] font-medium">{t('sale.total')}</span>
                <span className="text-[22px] font-bold text-[#1c1c1e]">{formatLAK(cartTotal)}</span>
              </div>
              <Button
                className="w-full"
                disabled={cart.length === 0}
                onClick={openCheckout}
              >
                {t('sale.checkout')}
              </Button>
              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-xl text-[13px] font-semibold bg-[#f2f2f7] text-[#3a3a3c] hover:bg-[#e5e5ea] transition-colors">
                  {t('sale.history')}
                </button>
                <button className="flex-1 py-2 rounded-xl text-[13px] font-semibold bg-[#f2f2f7] text-[#3a3a3c] hover:bg-[#e5e5ea] transition-colors">
                  {t('sale.billing')}
                </button>
                <button className="flex-1 py-2 rounded-xl text-[13px] font-semibold bg-[#f2f2f7] text-[#3a3a3c] hover:bg-[#e5e5ea] transition-colors">
                  {t('sale.print')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Checkout Modal ── */}
      <Modal open={showCheckout} onClose={() => setShowCheckout(false)} title={t('sale.checkout')}>
        <div className="space-y-4">
          {/* Order Summary */}
          <div className="bg-[#f8f8fc] rounded-xl p-4">
            <p className="text-[13px] text-[#8e8e93] font-medium mb-2">{t('sale.orderSummary')}</p>
            <div className="space-y-1.5">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-[14px]">
                  <span className="text-[#3a3a3c]">{item.name} × {item.qty}</span>
                  <span className="font-semibold">{formatLAK(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#c6c6c8]/20 mt-2 pt-2 flex justify-between text-[16px] font-bold">
              <span>{t('sale.totalLak')}</span>
              <span>{formatLAK(cartTotal)}</span>
            </div>
            {(() => {
              const r = rateSets.find((rs) => rs.id === checkout.rateId);
              if (!r) return null;
              return (
                <div className="border-t border-[#c6c6c8]/20 mt-2 pt-2 space-y-1">
                  <p className="text-[11px] text-[#8e8e93] font-semibold uppercase tracking-wider">{t('sale.equivalent')}</p>
                  <div className="flex justify-between text-[13px]">
                    <span>THB</span>
                    <span className="font-semibold">{formatCurrency(cartTotal * r.thb, '฿')}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span>USD</span>
                    <span className="font-semibold">{formatCurrency(cartTotal * r.usd, '$')}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span>YUAN</span>
                    <span className="font-semibold">{formatCurrency(cartTotal * r.yuan, '¥')}</span>
                  </div>
                </div>
              );
            })()}
          </div>

          <Input
            label={t('sale.patientName')}
            placeholder={t('sale.patientPlaceholder')}
            value={checkout.patient}
            onChange={(e) => handleCheckoutChange('patient', e.target.value)}
            error={checkoutErrors.patient}
          />

          <Input
            label={t('sale.date')}
            type="date"
            value={checkout.date}
            onChange={(e) => handleCheckoutChange('date', e.target.value)}
            error={checkoutErrors.date}
          />

          <Select
            label={t('sale.rateSet')}
            value={checkout.rateId}
            onChange={(e) => handleCheckoutChange('rateId', e.target.value)}
            options={rateSets.map((r) => ({
              value: r.id,
              label: `${r.name} (THB ${r.thb} | USD ${r.usd} | YUAN ${r.yuan})`,
            }))}
          />

          <Select
            label={t('sale.paymentMethod')}
            value={checkout.payment}
            onChange={(e) => handleCheckoutChange('payment', e.target.value)}
            options={paymentTypes.map((p) => ({ value: p, label: paymentLabels[p] }))}
          />

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => setShowCheckout(false)}>{t('sale.cancel')}</Button>
            <Button className="flex-1" onClick={handleCompleteSale}>{t('sale.completeSale')}</Button>
          </div>
        </div>
      </Modal>
    </ModuleLayout>
  );
}
