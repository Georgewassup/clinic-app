import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../i18n/TranslationProvider';
import { stockService } from '../../../services/firestore/stockService';
import Button from '../../shared/Button';
import Input from '../../shared/Input';
import Select from '../../shared/Select';
import Alert from '../../shared/Alert';

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

export default function AddProduct() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await stockService.create({ ...form, qty: Number(form.qty), minQty: Number(form.minQty), price: Number(form.price) });
      setAlert({ type: 'success', message: `${form.name} ${t('stockList.addSuccess')}` });
      setTimeout(() => {
        setAlert(null);
        navigate('/stock');
      }, 1500);
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  return (
    <div>
      {alert && <Alert type={alert.type} message={alert.message} onDismiss={() => setAlert(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/stock')} className="p-2 rounded-xl hover:bg-[#f2f2f7] transition-colors">
            <svg className="w-5 h-5 text-[#007AFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-[24px] font-bold text-[#1c1c1e]">{t('stockList.addTitle')}</h2>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-[#c6c6c8]/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload — Full width hero */}
            <div>
              <label className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-2xl cursor-pointer transition-all ${imagePreview ? 'border-[#007AFF] bg-[#007AFF]/5' : 'border-[#c6c6c8]/30 bg-[#f8f8fc] hover:border-[#007AFF]/40 hover:bg-[#f0f0f5]'}`}>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                {imagePreview ? (
                  <div className="relative w-full">
                    <img src={imagePreview} alt="Preview" className="w-full h-52 object-contain rounded-2xl p-4" />
                    <button type="button" onClick={(e) => { e.preventDefault(); clearImage(); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-10">
                    <div className="w-16 h-16 rounded-full bg-[#007AFF]/10 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-[#007AFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-[16px] font-semibold text-[#3a3a3c]">{t('stockList.form.uploadImage')}</p>
                    <p className="text-[14px] text-[#8e8e93] mt-1">{t('stockList.form.acceptedFormats')} — {t('stockList.form.browse')}</p>
                  </div>
                )}
              </label>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-5">
              <Input label={t('stockList.form.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} placeholder={t('stockList.form.placeholder.name')} />
              <Input label={`${t('stockList.form.nameLa')} — ${t('stockList.form.optional')}`} value={form.nameLa} onChange={(e) => setForm({ ...form, nameLa: e.target.value })} placeholder={t('stockList.form.placeholder.nameLa')} style={{ fontFamily: "'Noto Sans Lao', sans-serif" }} />
            </div>

            {/* Category, Unit, Location */}
            <div className="grid grid-cols-3 gap-5">
              <Select label={t('stockList.form.category')} options={categories} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} error={errors.category} placeholder="Select..." />
              <Select label={t('stockList.form.unit')} options={units} value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} error={errors.unit} placeholder="Select..." />
              <Input label={t('stockList.form.location')} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} error={errors.location} placeholder={t('stockList.form.placeholder.location')} />
            </div>

            {/* Qty, Min Qty, Price */}
            <div className="grid grid-cols-3 gap-5">
              <Input label={t('stockList.form.qty')} type="number" min="0" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} error={errors.qty} placeholder="0" />
              <Input label={t('stockList.form.minQty')} type="number" min="0" value={form.minQty} onChange={(e) => setForm({ ...form, minQty: e.target.value })} error={errors.minQty} placeholder="0" />
              <Input label={t('stockList.form.price')} type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} error={errors.price} placeholder="0.00" />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#c6c6c8]/20">
              <Button variant="secondary" onClick={() => navigate('/stock')}>{t('stockList.cancel')}</Button>
              <Button type="submit">{t('stockList.save')}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
