import { useState } from 'react';
import { useTranslation } from '../../../i18n/TranslationProvider';
import Button from '../../shared/Button';
import Input from '../../shared/Input';
import Select from '../../shared/Select';
import Modal from '../../shared/Modal';
import Alert from '../../shared/Alert';
import EmptyState from '../../shared/EmptyState';

const suppliers = [
  { value: 'MediSupply Sdn Bhd', label: 'MediSupply Sdn Bhd' },
  { value: 'PharmaCare Malaysia', label: 'PharmaCare Malaysia' },
  { value: 'HealthPlus Distributor', label: 'HealthPlus Distributor' },
];

const initialForm = { product: '', supplier: '', qty: '', estArrival: '' };

export default function StockReplenishment() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.product.trim()) errs.product = t('stockList.errors.required');
    if (!form.supplier) errs.supplier = t('stockList.errors.required');
    if (!form.qty || Number(form.qty) < 1) errs.qty = t('stockList.errors.validQty');
    if (!form.estArrival) errs.estArrival = t('stockList.errors.required');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setOrders([{
      id: Date.now(),
      date: new Date().toLocaleDateString('en-CA'),
      product: form.product,
      supplier: form.supplier,
      qty: Number(form.qty),
      estArrival: form.estArrival,
      status: t('stockReplenish.statusPending'),
    }, ...orders]);
    setForm(initialForm);
    setShowModal(false);
    setAlert({ type: 'success', message: t('stockReplenish.saveSuccess') });
    setTimeout(() => setAlert(null), 3000);
  };

  const statusColor = (s) => {
    if (s === t('stockReplenish.statusReceived')) return 'bg-[#e8f5e9] text-[#2e7d32]';
    if (s === t('stockReplenish.statusOrdered')) return 'bg-[#e3f2fd] text-[#1565c0]';
    return 'bg-[#fff3e0] text-[#e65100]';
  };

  const cols = t('stockReplenish.columns');

  return (
    <div>
      {alert && <Alert type={alert.type} message={alert.message} onDismiss={() => setAlert(null)} />}

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[24px] font-bold text-[#1c1c1e]">{t('stockReplenish.title')}</h2>
        <Button onClick={() => setShowModal(true)}>{t('stockReplenish.add')}</Button>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title={t('stockReplenish.empty')}
          message={t('stockReplenish.emptyMsg')}
          action={<Button onClick={() => setShowModal(true)}>{t('stockReplenish.add')}</Button>}
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-[#c6c6c8]/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[15px]">
              <thead>
                <tr className="bg-[#f8f8fc] border-b border-[#c6c6c8]/20">
                  {cols.map((h) => (
                    <th key={h} className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((r, i) => (
                  <tr key={r.id} className={`${i !== orders.length - 1 ? 'border-b border-[#c6c6c8]/20' : ''} hover:bg-[#f8f8fc]`}>
                    <td className="py-3 px-4 text-[#8e8e93]">{r.date}</td>
                    <td className="py-3 px-4 font-semibold">{r.product}</td>
                    <td className="py-3 px-4">{r.supplier}</td>
                    <td className="py-3 px-4 font-semibold">{r.qty}</td>
                    <td className="py-3 px-4">{r.estArrival}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[12px] font-bold ${statusColor(r.status)}`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={t('stockReplenish.addTitle')}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label={t('stockReplenish.form.product')} value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} error={errors.product} placeholder={t('stockReplenish.form.placeholder.product')} />
          <Select label={t('stockReplenish.form.supplier')} options={suppliers} value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} error={errors.supplier} placeholder="Select..." />
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('stockReplenish.form.qty')} type="number" min="1" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} error={errors.qty} placeholder="0" />
            <Input label={t('stockReplenish.form.estArrival')} type="date" value={form.estArrival} onChange={(e) => setForm({ ...form, estArrival: e.target.value })} error={errors.estArrival} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>{t('stockReplenish.cancel')}</Button>
            <Button type="submit">{t('stockReplenish.create')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
