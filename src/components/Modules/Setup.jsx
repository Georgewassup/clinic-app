import { useState } from 'react';
import { useTranslation } from '../../i18n/TranslationProvider';
import ModuleLayout from '../shared/ModuleLayout';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Select from '../shared/Select';

export default function Setup() {
  const { t } = useTranslation();
  const [clinicName, setClinicName] = useState('My Clinic');
  const [currency, setCurrency] = useState('RM');
  const [taxRate, setTaxRate] = useState('6');

  return (
    <ModuleLayout title="Setup">
      <h2 className="text-[24px] font-bold text-[#1c1c1e] mb-5">Setup</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-[#c6c6c8]/20 p-6 mb-5">
        <h3 className="text-[17px] font-semibold text-[#1c1c1e] mb-4">Clinic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input label="Clinic Name" value={clinicName} onChange={(e) => setClinicName(e.target.value)} />
          <Select label="Currency" options={[{ value: 'RM', label: 'RM (Malaysian Ringgit)' }, { value: 'LAK', label: 'LAK (Lao Kip)' }, { value: 'USD', label: 'USD (US Dollar)' }]} value={currency} onChange={(e) => setCurrency(e.target.value)} />
        </div>
        <Input label="Tax Rate (%)" type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
        <div className="mt-4">
          <Button>Save Settings</Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#c6c6c8]/20 p-6">
        <h3 className="text-[17px] font-semibold text-[#1c1c1e] mb-4">About</h3>
        <p className="text-[15px] text-[#8e8e93] mb-1">Clinic Management System</p>
        <p className="text-[15px] text-[#8e8e93]">Version 1.0.0</p>
      </div>
    </ModuleLayout>
  );
}
