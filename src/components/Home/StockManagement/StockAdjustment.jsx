import { useState } from 'react';
import { useTranslation } from '../../../i18n/TranslationProvider';
import Button from '../../shared/Button';
import Input from '../../shared/Input';
import Select from '../../shared/Select';
import Modal from '../../shared/Modal';
import Alert from '../../shared/Alert';
import EmptyState from '../../shared/EmptyState';

const initialForm = { product: '', type: 'Addition', qty: '', reason: '' };

export default function StockAdjustment() {
  const { t } = useTranslation();
  const [adjustments, setAdjustments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.product.trim()) errs.product = t('stockList.errors.required');
    if (!form.qty || Number(form.qty) < 1) errs.qty = t('stockList.errors.validQty');
    if (!form.reason.trim()) errs.reason = t('stockList.errors.required');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setAdjustments([{
      id: Date.now(),
      date: new Date().toLocaleDateString('en-CA'),
      product: form.product,
      type: form.type,
      qty: Number(form.qty),
      reason: form.reason,
      status: t('stockAdj.statusPending'),
    }, ...adjustments]);
    setForm(initialForm);
    setShowModal(false);
    setAlert({ type: 'success', message: t('stockAdj.saveSuccess') });
    setTimeout(() => setAlert(null), 3000);
  };

  const cols = t('stockAdj.columns');

  return (
    <div>
      {alert && <Alert type={alert.type} message={alert.message} onDismiss={() => setAlert(null)} />}

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[24px] font-bold text-[#1c1c1e]">{t('stockAdj.title')}</h2>
        <Button onClick={() => setShowModal(true)}>{t('stockAdj.add')}</Button>
      </div>

      {adjustments.length === 0 ? (
        <EmptyState
          title={t('stockAdj.empty')}
          message={t('stockAdj.emptyMsg')}
          action={<Button onClick={() => setShowModal(true)}>{t('stockAdj.add')}</Button>}
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
                {adjustments.map((adj, i) => (
                  <tr key={adj.id} className={`${i !== adjustments.length - 1 ? 'border-b border-[#c6c6c8]/20' : ''} hover:bg-[#f8f8fc]`}>
                    <td className="py-3 px-4 text-[#8e8e93]">{adj.date}</td>
                    <td className="py-3 px-4 font-semibold">{adj.product}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[12px] font-bold ${adj.type === 'Addition' ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#fce8e8] text-[#d32f2f]'}`}>
                        {adj.type === 'Addition' ? t('stockAdj.typeAddition') : t('stockAdj.typeDeduction')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold">{adj.qty}</td>
                    <td className="py-3 px-4 text-[#8e8e93] max-w-[200px] truncate">{adj.reason}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[12px] font-bold ${adj.status === t('stockAdj.statusApproved') ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#fff3e0] text-[#e65100]'}`}>
                        {adj.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={t('stockAdj.addTitle')}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label={t('stockAdj.form.product')} value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} error={errors.product} placeholder={t('stockAdj.form.placeholder.product')} />
          <div className="grid grid-cols-2 gap-4">
            <Select label={t('stockAdj.form.type')} options={[
              { value: 'Addition', label: t('stockAdj.form.addOpt') },
              { value: 'Deduction', label: t('stockAdj.form.dedOpt') },
            ]} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
            <Input label={t('stockAdj.form.qty')} type="number" min="1" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} error={errors.qty} placeholder="0" />
          </div>
          <Input label={t('stockAdj.form.reason')} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} error={errors.reason} placeholder={t('stockAdj.form.placeholder.reason')} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>{t('stockAdj.cancel')}</Button>
            <Button type="submit">{t('stockAdj.save')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
