import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPage, FormCard, FormGrid } from 'shared/new-components';
import { TextBox, DropDownList } from 'shared/components/forms';
import { Button } from 'shared/components/buttons';
import {
  medicineBrands,
  medicineCompanies,
  medicineSalts,
  medicineStockTypes,
} from '../../data';
import { hmsUrls } from '../../urls';
import { getHmsBreadcrumbs } from '../../utils';

export default function AddStockPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    saltId: '',
    brandId: '',
    companyId: '',
    stockTypeId: '',
    batchNo: '',
    expiryDate: '',
    quantity: '0',
    unitPrice: '0',
    healthCenter: '',
  });

  const brandOptions = medicineBrands.map(b => ({
    label: b.brandName,
    value: b.id,
  }));
  const companyOptions = medicineCompanies.map(c => ({
    label: c.companyName,
    value: c.id,
  }));
  const saltOptions = medicineSalts.map(s => ({
    label: s.saltName,
    value: s.id,
  }));
  const typeOptions = medicineStockTypes.map(st => ({
    label: st.name,
    value: st.id,
  }));

  const handleChange = (field: string) => (e: any) => {
    setForm(prev => ({
      ...prev,
      [field]: e?.value ?? e?.target?.value ?? e ?? '',
    }));
  };

  return (
    <FormPage
      title="Add Stock"
      description="Add a new medicine batch to the medical stock inventory."
      breadcrumbs={getHmsBreadcrumbs('Medical Stock', 'Add Stock')}
    >
      <FormCard title="Stock Details">
        <FormGrid>
          <DropDownList
            label="Medicine Salt"
            data={saltOptions}
            textField="label"
            optionValue="value"
            value={form.saltId}
            onChange={handleChange('saltId')}
          />
          <DropDownList
            label="Brand"
            data={brandOptions}
            textField="label"
            optionValue="value"
            value={form.brandId}
            onChange={handleChange('brandId')}
          />
          <DropDownList
            label="Company"
            data={companyOptions}
            textField="label"
            optionValue="value"
            value={form.companyId}
            onChange={handleChange('companyId')}
          />
          <DropDownList
            label="Stock Type"
            data={typeOptions}
            textField="label"
            optionValue="value"
            value={form.stockTypeId}
            onChange={handleChange('stockTypeId')}
          />
          <TextBox
            label="Batch No"
            placeholder="e.g. CIP-PCM-2401"
            value={form.batchNo}
            onChange={handleChange('batchNo')}
          />
          <TextBox
            label="Expiry Date"
            type="date"
            value={form.expiryDate}
            onChange={handleChange('expiryDate')}
          />
          <TextBox
            label="Quantity"
            type="number"
            placeholder="0"
            value={form.quantity}
            onChange={handleChange('quantity')}
          />
          <TextBox
            label="Unit Price (₹)"
            type="number"
            placeholder="0"
            value={form.unitPrice}
            onChange={handleChange('unitPrice')}
          />
          <TextBox
            label="Health Center"
            placeholder="e.g. Campus Health Center"
            value={form.healthCenter}
            onChange={handleChange('healthCenter')}
          />
        </FormGrid>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => navigate(hmsUrls.stock)}
          />
          <Button
            label="Save Stock"
            icon="save"
            onClick={() => navigate(hmsUrls.stock)}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
