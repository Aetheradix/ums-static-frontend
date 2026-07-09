import { useMemo } from 'react';
import { FormPage, FormCard } from 'shared/new-components';
import {
  memberships,
  healthRecords,
  medicalStocks,
  subscriptions,
} from '../../data';
import { getHmsBreadcrumbs } from '../../utils';

export default function ReportsPage() {
  const stats = useMemo(
    () => ({
      totalMemberships: memberships.length,
      totalRecords: healthRecords.length,
      totalStock: medicalStocks.length,
      totalSubscriptions: subscriptions.length,
      paidSubscriptions: subscriptions.filter(s => s.status === 'Paid').length,
      pendingSubscriptions: subscriptions.filter(s => s.status === 'Pending')
        .length,
      lowStock: medicalStocks.filter(s => s.quantity > 0 && s.quantity < 50)
        .length,
      outOfStock: medicalStocks.filter(s => s.quantity === 0).length,
    }),
    []
  );

  const reportCards = [
    {
      label: 'Total Memberships',
      value: stats.totalMemberships,
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      icon: 'card_membership',
    },
    {
      label: 'Health Records',
      value: stats.totalRecords,
      color: 'bg-green-50 border-green-200 text-green-700',
      icon: 'medical_information',
    },
    {
      label: 'Stock Items',
      value: stats.totalStock,
      color: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      icon: 'inventory_2',
    },
    {
      label: 'Low Stock',
      value: stats.lowStock,
      color: 'bg-amber-50 border-amber-200 text-amber-700',
      icon: 'inventory',
    },
    {
      label: 'Out of Stock',
      value: stats.outOfStock,
      color: 'bg-red-50 border-red-200 text-red-700',
      icon: 'block',
    },
    {
      label: 'Paid Subscriptions',
      value: stats.paidSubscriptions,
      color: 'bg-teal-50 border-teal-200 text-teal-700',
      icon: 'payments',
    },
    {
      label: 'Pending Payments',
      value: stats.pendingSubscriptions,
      color: 'bg-orange-50 border-orange-200 text-orange-700',
      icon: 'pending',
    },
    {
      label: 'Total Subscriptions',
      value: stats.totalSubscriptions,
      color: 'bg-purple-50 border-purple-200 text-purple-700',
      icon: 'receipt_long',
    },
  ];

  return (
    <FormPage
      title="Reports"
      description="Health management system statistics and summaries."
      breadcrumbs={getHmsBreadcrumbs('Reports')}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {reportCards.map(card => (
          <div
            key={card.label}
            className={`rounded-xl border p-4 ${card.color}`}
          >
            <div
              className={`flex items-center gap-1.5 text-xs font-medium mb-1 opacity-70`}
            >
              <span className="material-symbols-outlined text-sm">
                {card.icon}
              </span>
              {card.label}
            </div>
            <div className="text-2xl font-bold">{card.value}</div>
          </div>
        ))}
      </div>

      <FormCard title="Export Options">
        <p className="text-sm text-gray-500 mb-4">
          Generate and export reports in PDF or CSV format.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: 'Membership Report', icon: 'card_membership' },
            { label: 'Health Records Report', icon: 'medical_information' },
            { label: 'Stock Report', icon: 'inventory_2' },
            { label: 'Prescription Report', icon: 'prescriptions' },
            { label: 'Appointment Report', icon: 'calendar_month' },
            { label: 'Subscription Report', icon: 'receipt_long' },
          ].map(r => (
            <button
              key={r.label}
              className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-gray-400">
                {r.icon}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {r.label}
              </span>
            </button>
          ))}
        </div>
      </FormCard>
    </FormPage>
  );
}
