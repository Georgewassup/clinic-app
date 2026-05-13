import { useTranslation } from '../../i18n/TranslationProvider';
import { useFirestore } from '../../hooks/useFirestore';
import { supplierService } from '../../services/firestore/supplierService';
import ModuleLayout from '../shared/ModuleLayout';
import Button from '../shared/Button';
import EmptyState from '../shared/EmptyState';

export default function ManageSupplier() {
  const { t } = useTranslation();
  const { data: suppliers } = useFirestore(supplierService);

  return (
    <ModuleLayout title={t('home.modules.supplier')}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[24px] font-bold text-[#1c1c1e]">{t('home.modules.supplier')}</h2>
        <Button>+ Add Supplier</Button>
      </div>
      {suppliers.length === 0 ? (
        <EmptyState title="No suppliers" message="Add your first supplier." action={<Button>+ Add Supplier</Button>} />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-[#c6c6c8]/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[15px]">
              <thead>
                <tr className="bg-[#f8f8fc] border-b border-[#c6c6c8]/20">
                  <th className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">Name</th>
                  <th className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">Contact</th>
                  <th className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">Phone</th>
                  <th className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">Email</th>
                  <th className="text-left py-3.5 px-4"></th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      )}
    </ModuleLayout>
  );
}
