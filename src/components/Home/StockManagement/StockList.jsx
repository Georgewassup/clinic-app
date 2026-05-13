import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../../i18n/TranslationProvider';
import { useFirestore } from '../../../hooks/useFirestore';
import { stockService } from '../../../services/firestore/stockService';
import Button from '../../shared/Button';
import Input from '../../shared/Input';
import Select from '../../shared/Select';
import Modal from '../../shared/Modal';
import Alert from '../../shared/Alert';
import EmptyState from '../../shared/EmptyState';
import TableSkeleton from '../../shared/TableSkeleton';

const categories = [
  { value: 'Medicine', label: 'Medicine' },
  { value: 'Supply', label: 'Supply' },
  { value: 'Equipment', label: 'Equipment' },
];

const units = [
  { value: 'Tablets', label: 'Tablets' },
  { value: 'Capsules', label: 'Capsules' },
  { value: 'Boxes', label: 'Boxes' },
  { value: 'Pieces', label: 'Pieces' },
  { value: 'Rolls', label: 'Rolls' },
  { value: 'Sets', label: 'Sets' },
  { value: 'Bottles', label: 'Bottles' },
];

const initialForm = { name: '', nameLa: '', category: '', unit: '', qty: '', minQty: '', price: '', location: '', image: '' };

export default function StockList() {
  const { t } = useTranslation();
  const { data: items, loading, error: fetchError, add, remove } = useFirestore(stockService);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileRef = useRef(null);

  // Show fetch errors
  useEffect(() => {
    if (fetchError) {
      setAlert({ type: 'error', message: fetchError });
      const t = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(t);
    }
  }, [fetchError]);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setForm((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview('');
    setForm((prev) => ({ ...prev, image: '' }));
    if (fileRef.current) fileRef.current.value = '';
  };

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    (item.nameLa && item.nameLa.toLowerCase().includes(search.toLowerCase())) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t('stockList.errors.required');
    if (!form.category) errs.category = t('stockList.errors.required');
    if (!form.unit) errs.unit = t('stockList.errors.required');
    if (!form.qty || Number(form.qty) < 0) errs.qty = t('stockList.errors.validQty');
    if (!form.minQty || Number(form.minQty) < 0) errs.minQty = t('stockList.errors.required');
    if (!form.price || Number(form.price) < 0) errs.price = t('stockList.errors.validPrice');
    if (!form.location.trim()) errs.location = t('stockList.errors.required');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await add({ ...form, qty: Number(form.qty), minQty: Number(form.minQty), price: Number(form.price) });
      setForm(initialForm);
      setShowModal(false);
      setAlert({ type: 'success', message: `${form.name} ${t('stockList.addSuccess')}` });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const handleDelete = async (id, name) => {
    try {
      await remove(id);
      setAlert({ type: 'success', message: `${name} ${t('stockList.deleteSuccess')}` });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const statusBadge = (qty, minQty) => {
    if (qty <= minQty) return 'bg-[#fce8e8] text-[#d32f2f]';
    if (qty <= minQty * 2) return 'bg-[#fff3e0] text-[#e65100]';
    return 'bg-[#e8f5e9] text-[#2e7d32]';
  };

  const statusLabel = (qty, minQty) => {
    if (qty <= minQty) return t('stockList.statusLow');
    if (qty <= minQty * 2) return t('stockList.statusMedium');
    return t('stockList.statusInStock');
  };

  const cols = t('stockList.columns');

  return (
    <div>
      {alert && <Alert type={alert.type} message={alert.message} onDismiss={() => setAlert(null)} />}

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[24px] font-bold text-[#1c1c1e]">{t('stockList.title')}</h2>
        <div className="flex items-center gap-2">
          <Link to="/stock/add-product" className="text-[13px] text-[#007AFF] font-semibold hover:opacity-70 transition-opacity">{t('stockList.addPage')}</Link>
          <Button onClick={() => setShowModal(true)}>{t('stockList.add')}</Button>
        </div>
      </div>

      <div className="relative mb-5">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e8e93]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder={t('stockList.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-[15px] text-[#1c1c1e] placeholder-[#8e8e93] border border-[#c6c6c8]/40 focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF]/30 transition-all"
        />
      </div>

      {loading ? (
        <TableSkeleton rows={4} cols={8} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={search ? t('stockList.noResults') : t('stockList.empty')}
          message={search ? t('stockList.noResultsMsg') : t('stockList.emptyMsg')}
          action={!search && <Button onClick={() => setShowModal(true)}>{t('stockList.add')}</Button>}
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
                  <th className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => (
                  <tr key={item.id} className={`${i !== filtered.length - 1 ? 'border-b border-[#c6c6c8]/20' : ''} hover:bg-[#f8f8fc] transition-colors`}>
                    <td className="py-3 px-4 font-semibold text-[#1c1c1e]">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-[#c6c6c8]/20 shrink-0" />
                        )}
                        <div>
                          <div>{item.name}</div>
                          {item.nameLa && <div className="text-[13px] text-[#8e8e93] font-normal">{item.nameLa}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#8e8e93]">{item.category}</td>
                    <td className="py-3 px-4 font-semibold">{item.qty}</td>
                    <td className="py-3 px-4 text-[#8e8e93]">{item.unit}</td>
                    <td className="py-3 px-4">{item.minQty}</td>
                    <td className="py-3 px-4">{Number(item.price).toFixed(2)}</td>
                    <td className="py-3 px-4 text-[#8e8e93]">{item.location}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[12px] font-bold ${statusBadge(item.qty, item.minQty)}`}>
                        {statusLabel(item.qty, item.minQty)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button onClick={() => handleDelete(item.id, item.name)} className="text-[#ff3b30] hover:bg-[#fce8e8] p-1.5 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={t('stockList.addTitle')} wide>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('stockList.form.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} placeholder={t('stockList.form.placeholder.name')} />
            <Input label={`${t('stockList.form.nameLa')} — ${t('stockList.form.optional')}`} value={form.nameLa} onChange={(e) => setForm({ ...form, nameLa: e.target.value })} placeholder={t('stockList.form.placeholder.nameLa')} style={{ fontFamily: "'Noto Sans Lao', sans-serif" }} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Select label={t('stockList.form.category')} options={categories} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} error={errors.category} placeholder="Select..." />
            <Select label={t('stockList.form.unit')} options={units} value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} error={errors.unit} placeholder="Select..." />
            <Input label={t('stockList.form.location')} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} error={errors.location} placeholder={t('stockList.form.placeholder.location')} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label={t('stockList.form.qty')} type="number" min="0" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} error={errors.qty} placeholder="0" />
            <Input label={t('stockList.form.minQty')} type="number" min="0" value={form.minQty} onChange={(e) => setForm({ ...form, minQty: e.target.value })} error={errors.minQty} placeholder="0" />
            <Input label={t('stockList.form.price')} type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} error={errors.price} placeholder="0.00" />
          </div>
          {/* Image Upload */}
          <div>
            <label className="block text-[15px] font-semibold text-[#3a3a3c] mb-1.5">{t('stockList.form.image')}</label>
            <label className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-2xl cursor-pointer transition-all ${imagePreview ? 'border-[#007AFF] bg-[#007AFF]/5' : 'border-[#c6c6c8]/40 bg-[#f8f8fc] hover:border-[#007AFF]/40 hover:bg-[#f0f0f5]'}`}>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              {imagePreview ? (
                <div className="relative w-full">
                  <img src={imagePreview} alt="Preview" className="w-full h-36 object-contain rounded-2xl p-3" />
                  <button onClick={(e) => { e.preventDefault(); clearImage(); }} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center py-8">
                  <div className="w-14 h-14 rounded-full bg-[#007AFF]/10 flex items-center justify-center mb-3">
                    <svg className="w-7 h-7 text-[#007AFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-[15px] font-semibold text-[#3a3a3c]">{t('stockList.form.uploadImage')}</p>
                  <p className="text-[13px] text-[#8e8e93] mt-1">{t('stockList.form.acceptedFormats')}</p>
                </div>
              )}
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>{t('stockList.cancel')}</Button>
            <Button type="submit">{t('stockList.save')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
