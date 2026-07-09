import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPage, GridPanel, FormCard } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { medicalStocks } from '../../data';
import { hmsUrls } from '../../urls';

export default function MedicalStockPage() {
  const navigate = useNavigate();
  const data = useMemo(() => medicalStocks, []);

  const isExpired = (expiry: string) => new Date(expiry) < new Date();
  const isLowStock = (qty: number) => qty > 0 && qty < 50;

  return (
    <FormPage
      title="Medical Stock"
      description="Track medicine inventory, expiry dates, and stock levels across health centers."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Health Services', to: hmsUrls.portal },
        { label: 'Medical Stock' },
      ]}
      headerAction={
        <Button
          onClick={() => navigate(hmsUrls.addStock)}
          label="Add Stock"
          icon="plus"
        />
      }
    >
      <FormCard title="All Stock Items">
        <GridPanel
          data={data}
          searchBox={true}
          searchFields={['saltName', 'brandName', 'batchNo', 'healthCenter']}
          columns={[
            {
              field: 'saltName',
              header: 'Medicine',
              cell: (r: any) => (
                <span className="font-medium">{r.saltName}</span>
              ),
            },
            { field: 'brandName', header: 'Brand', width: '110px' },
            { field: 'batchNo', header: 'Batch', width: '130px' },
            { field: 'stockTypeName', header: 'Type', width: '90px' },
            {
              field: 'expiryDate',
              header: 'Expiry',
              width: '110px',
              cell: (r: any) => {
                const expired = isExpired(r.expiryDate);
                return (
                  <span className={expired ? 'text-red-600 font-medium' : ''}>
                    {r.expiryDate}
                    {expired ? ' ⚠' : ''}
                  </span>
                );
              },
            },
            {
              field: 'quantity',
              header: 'Qty',
              width: '80px',
              cell: (r: any) => {
                const low = isLowStock(r.quantity);
                const out = r.quantity === 0;
                return (
                  <span
                    className={`font-medium ${out ? 'text-red-600' : low ? 'text-amber-600' : ''}`}
                  >
                    {r.quantity}
                  </span>
                );
              },
            },
            {
              field: 'unitPrice',
              header: 'Price',
              width: '80px',
              cell: (r: any) => <span>₹{r.unitPrice}</span>,
            },
            { field: 'healthCenter', header: 'Center', width: '160px' },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
