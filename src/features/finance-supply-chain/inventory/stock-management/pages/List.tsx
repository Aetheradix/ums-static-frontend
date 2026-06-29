import { Loader } from 'shared/components/progress';
import { FormCard, FormPage, GridPanel } from 'shared/new-components';
import { ITEMS } from '../../../mock-data';
import { useQuery } from '@tanstack/react-query';

type ItemMasterItem = (typeof ITEMS)[0];
const QK = ['@fsc/stock-management'];
function useStockManagementQuery() {
  const { data = [], isLoading } = useQuery({
    queryKey: QK,
    queryFn: async () => [...ITEMS],
  });
  return { data, isLoading };
}

export default function List() {
  const { data, isLoading } = useStockManagementQuery();

  return (
    <FormPage
      title="Stock Management"
      description="View current stock levels across all locations."
    >
      <FormCard>
        {isLoading && <Loader />}
        <GridPanel
          data={data}
          searchBox
          searchPlaceholder="Search by item code, name, location..."
          columns={[
            { cell: (_, o) => <span>{o.rowIndex + 1}</span>, width: '40px' },
            { field: 'itemCode', header: 'Item Code' },
            { field: 'name', header: 'Item Name' },
            { field: 'category', header: 'Category' },
            { field: 'uom', header: 'UOM' },
            { field: 'location', header: 'Location' },
            { field: 'reorderLevel', header: 'Reorder Level' },
            {
              field: 'currentStock',
              header: 'Current Stock',
              cell: (i: ItemMasterItem) => {
                const isLow = i.currentStock <= i.reorderLevel;
                return (
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold ${isLow ? 'text-red-600' : 'text-green-700'}`}
                    >
                      {i.currentStock}
                    </span>
                    {isLow && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-wider">
                        Low Stock
                      </span>
                    )}
                  </div>
                );
              },
            },
          ]}
        />
      </FormCard>
    </FormPage>
  );
}
