import { useState } from 'react';
import { useTranslation } from '../../i18n/TranslationProvider';
import { useFirestore } from '../../hooks/useFirestore';
import { currencyService } from '../../services/firestore/currencyService';
import ModuleLayout from '../shared/ModuleLayout';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Modal from '../shared/Modal';
import Alert from '../shared/Alert';

const emptyForm = {
  name: '', rateId: '', thb: '', lak: '', usd: '', yuan: '', description: '',
};

export default function CurrencyManagement() {
  const { t } = useTranslation();
  const { data: rates, loading, add, update, remove } = useFirestore(currencyService);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditing(r.id);
    setForm({
      name: r.name,
      rateId: r.rateId,
      thb: String(r.thb),
      lak: String(r.lak),
      usd: String(r.usd),
      yuan: String(r.yuan),
      description: r.description || '',
    });
    setErrors({});
    setShowModal(true);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSave = async () => {
    const e = {};
    if (!form.name.trim()) e.name = t('currency.errors.required');
    if (!form.rateId.trim()) e.rateId = t('currency.errors.required');
    if (!form.lak || parseFloat(form.lak) <= 0) e.lak = t('currency.errors.required');
    if (!form.thb || parseFloat(form.thb) <= 0) e.thb = t('currency.errors.required');
    if (!form.usd || parseFloat(form.usd) <= 0) e.usd = t('currency.errors.required');
    if (!form.yuan || parseFloat(form.yuan) <= 0) e.yuan = t('currency.errors.required');
    if (!editing && rates.some((r) => r.rateId === form.rateId.trim())) e.rateId = t('currency.errors.idExists');
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const entry = {
      name: form.name.trim(),
      rateId: form.rateId.trim(),
      lak: parseFloat(form.lak),
      thb: parseFloat(form.thb),
      usd: parseFloat(form.usd),
      yuan: parseFloat(form.yuan),
      description: form.description.trim(),
    };

    try {
      if (editing) {
        await update(editing, entry);
        setAlert({ type: 'success', message: `"${entry.name}" ${t('currency.updated')}` });
      } else {
        await add(entry);
        setAlert({ type: 'success', message: `"${entry.name}" ${t('currency.added')}` });
      }
      setShowModal(false);
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const handleDelete = async (id, name) => {
    try {
      await remove(id);
      setAlert({ type: 'success', message: t('currency.deleted') });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  return (
    <ModuleLayout title={t('home.modules.currency')}>
      {alert && <Alert type={alert.type} message={alert.message} onDismiss={() => setAlert(null)} />}

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[24px] font-bold text-[#1c1c1e]">{t('home.modules.currency')}</h2>
        <Button onClick={openAdd}>{t('currency.addRate')}</Button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-[#c6c6c8]/20 p-10 text-center text-[#8e8e93]">Loading...</div>
      ) : rates.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-[#c6c6c8]/20 p-10">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#007AFF]/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#007AFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-[18px] font-semibold text-[#1c1c1e] mb-1">{t('currency.noRates')}</h3>
            <p className="text-[14px] text-[#8e8e93] font-medium mb-5">{t('currency.noRatesMsg')}</p>
            <Button onClick={openAdd}>{t('currency.addRate')}</Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-[#c6c6c8]/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[15px]">
              <thead>
                <tr className="bg-[#f8f8fc] border-b border-[#c6c6c8]/20">
                  <th className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">{t('currency.rateName')}</th>
                  <th className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">{t('currency.rateId')}</th>
                  <th className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">LAK</th>
                  <th className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">THB</th>
                  <th className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">USD</th>
                  <th className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">YUAN</th>
                  <th className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">{t('currency.description')}</th>
                  <th className="text-right py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {rates.map((r, i) => (
                  <tr key={r.id} className={`${i !== rates.length - 1 ? 'border-b border-[#c6c6c8]/20' : ''} hover:bg-[#f8f8fc] transition-colors`}>
                    <td className="py-3.5 px-4 font-semibold">{r.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-[#e3f2fd] text-[#1565c0] text-[12px] font-bold">{r.rateId}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium">{r.lak}</td>
                    <td className="py-3.5 px-4 font-medium">{r.thb}</td>
                    <td className="py-3.5 px-4 font-medium">{r.usd}</td>
                    <td className="py-3.5 px-4 font-medium">{r.yuan}</td>
                    <td className="py-3.5 px-4 text-[#8e8e93] text-[14px] max-w-[200px] truncate">{r.description || '—'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-[#f2f2f7] text-[#8e8e93] hover:text-[#007AFF] transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(r.id, r.name)} className="p-1.5 rounded-lg hover:bg-[#fce8e8] text-[#8e8e93] hover:text-[#ff3b30] transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? t('currency.editRate') : t('currency.addRate')}>
        <div className="space-y-4">
          <Input label={t('currency.rateName')} placeholder={t('currency.namePlaceholder')} value={form.name} onChange={(e) => handleChange('name', e.target.value)} error={errors.name} />
          <Input label={t('currency.rateId')} placeholder={t('currency.idPlaceholder')} value={form.rateId} onChange={(e) => handleChange('rateId', e.target.value)} error={errors.rateId} disabled={!!editing} />

          <div className="grid grid-cols-2 gap-3">
            <Input label="LAK" type="number" step="0.000001" min="0" placeholder="1" value={form.lak} onChange={(e) => handleChange('lak', e.target.value)} error={errors.lak} />
            <Input label="THB" type="number" step="0.000001" min="0" placeholder="0.00" value={form.thb} onChange={(e) => handleChange('thb', e.target.value)} error={errors.thb} />
            <Input label="USD" type="number" step="0.000001" min="0" placeholder="0.00" value={form.usd} onChange={(e) => handleChange('usd', e.target.value)} error={errors.usd} />
            <Input label="YUAN" type="number" step="0.000001" min="0" placeholder="0.00" value={form.yuan} onChange={(e) => handleChange('yuan', e.target.value)} error={errors.yuan} />
          </div>

          <Input label={`${t('currency.description')} (optional)`} placeholder={t('currency.descPlaceholder')} value={form.description} onChange={(e) => handleChange('description', e.target.value)} />

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>{t('currency.cancel')}</Button>
            <Button className="flex-1" onClick={handleSave}>{editing ? t('currency.saveChanges') : t('currency.addRate')}</Button>
          </div>
        </div>
      </Modal>
    </ModuleLayout>
  );
}
