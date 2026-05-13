import { useState } from 'react';
import { useTranslation } from '../../../i18n/TranslationProvider';
import Button from '../../shared/Button';
import Input from '../../shared/Input';
import Select from '../../shared/Select';
import Modal from '../../shared/Modal';
import Alert from '../../shared/Alert';
import EmptyState from '../../shared/EmptyState';

const locations = [
  { value: 'Main Store', label: 'Main Store' },
  { value: 'Pharmacy A', label: 'Pharmacy A' },
  { value: 'Pharmacy B', label: 'Pharmacy B' },
  { value: 'Clinic Room 1', label: 'Clinic Room 1' },
  { value: 'Clinic Room 2', label: 'Clinic Room 2' },
];

const initialForm = { product: '', from: '', to: '', qty: '' };

export default function StockTransfer() {
  const { t } = useTranslation();
  const [transfers, setTransfers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.product.trim()) errs.product = t('stockList.errors.required');
    if (!form.from) errs.from = t('stockList.errors.required');
    if (!form.to) errs.to = t('stockList.errors.required');
    if (form.from && form.to && form.from === form.to) errs.to = t('stockTransfer.form.sameLocation');
    if (!form.qty || Number(form.qty) < 1) errs.qty = t('stockList.errors.validQty');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setTransfers([{
      id: Date.now(),
      date: new Date().toLocaleDateString('en-CA'),
      product: form.product,
      from: form.from,
      to: form.to,
      qty: Number(form.qty),
      status: t('stockTransfer.statusPending'),
    }, ...transfers]);
    setForm(initialForm);
    setShowModal(false);
    setAlert({ type: 'success', message: t('stockTransfer.saveSuccess') });
    setTimeout(() => setAlert(null), 3000);
  };

  const cols = t('stockTransfer.columns');

  return (
    <div>
      {alert && <Alert type={alert.type} message={alert.message} onDismiss={() => setAlert(null)} />}

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[24px] font-bold text-[#1c1c1e]">{t('stockTransfer.title')}</h2>
        <Button onClick={() => setShowModal(true)}>{t('stockTransfer.add')}</Button>
      </div>

      {transfers.length === 0 ? (
        <EmptyState
          title={t('stockTransfer.empty')}
          message={t('stockTransfer.emptyMsg')}
          action={<Button onClick={() => setShowModal(true)}>{t('stockTransfer.add')}</Button>}
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
                {transfers.map((tr, i) => (
                  <tr key={tr.id} className={`${i !== transfers.length - 1 ? 'border-b border-[#c6c6c8]/20' : ''} hover:bg-[#f8f8fc]`}>
                    <td className="py-3 px-4 text-[#8e8e93]">{tr.date}</td>
                    <td className="py-3 px-4 font-semibold">{tr.product}</td>
                    <td className="py-3 px-4">{tr.from}</td>
                    <td className="py-3 px-4">{tr.to}</td>
                    <td className="py-3 px-4 font-semibold">{tr.qty}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[12px] font-bold ${tr.status === t('stockTransfer.statusCompleted') ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#fff3e0] text-[#e65100]'}`}>
                        {tr.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={t('stockTransfer.addTitle')}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label={t('stockTransfer.form.product')} value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} error={errors.product} placeholder={t('stockTransfer.form.placeholder.product')} />
          <div className="grid grid-cols-2 gap-4">
            <Select label={t('stockTransfer.form.from')} options={locations} value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} error={errors.from} placeholder="Select..." />
            <Select label={t('stockTransfer.form.to')} options={locations} value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} error={errors.to} placeholder="Select..." />
          </div>
          <Input label={t('stockTransfer.form.qty')} type="number" min="1" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} error={errors.qty} placeholder="0" />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>{t('stockTransfer.cancel')}</Button>
            <Button type="submit">{t('stockTransfer.create')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
