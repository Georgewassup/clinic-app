import { useTranslation } from '../../i18n/TranslationProvider';
import { useFirestore } from '../../hooks/useFirestore';
import { staffService } from '../../services/firestore/staffService';
import ModuleLayout from '../shared/ModuleLayout';
import Button from '../shared/Button';
import EmptyState from '../shared/EmptyState';

export default function ManageStaff() {
  const { t } = useTranslation();
  const { data: staff } = useFirestore(staffService);

  return (
    <ModuleLayout title={t('home.modules.staff')}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[24px] font-bold text-[#1c1c1e]">{t('home.modules.staff')}</h2>
        <Button>+ Add Staff</Button>
      </div>
      {staff.length === 0 ? (
        <EmptyState title="No staff" message="Add your first staff member." action={<Button>+ Add Staff</Button>} />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-[#c6c6c8]/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[15px]">
              <thead>
                <tr className="bg-[#f8f8fc] border-b border-[#c6c6c8]/20">
                  <th className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">Name</th>
                  <th className="text-left py-3.5 px-4 text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">Role</th>
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
