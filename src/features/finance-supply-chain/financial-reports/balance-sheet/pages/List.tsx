import { FormCard, FormPage } from 'shared/new-components';
import { BALANCE_SHEET } from '../../../mock-data';

export default function List() {
  const data = BALANCE_SHEET;

  return (
    <FormPage
      title="Balance Sheet"
      description="View assets, liabilities, and equity of the university."
    >
      <FormCard>
        <div className="grid grid-cols-2 gap-8 p-4">
          {/* Liabilities Side */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
              Liabilities & Equity
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-600 mb-2">
                  Current Liabilities
                </h4>
                {data.liabilities.currentLiabilities.map(l => (
                  <div
                    key={l.name}
                    className="flex justify-between py-1 text-sm"
                  >
                    <span>{l.name}</span>
                    <span>₹{l.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-medium text-gray-600 mb-2">
                  Equity & Funds
                </h4>
                {data.liabilities.equity.map(e => (
                  <div
                    key={e.name}
                    className="flex justify-between py-1 text-sm"
                  >
                    <span>{e.name}</span>
                    <span>₹{e.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-gray-800 border-t pt-2 mt-4">
                <span>Total Liabilities</span>
                <span>
                  ₹{data.liabilities.totalLiabilities.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Assets Side */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
              Assets
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-600 mb-2">
                  Current Assets
                </h4>
                {data.assets.currentAssets.map(a => (
                  <div
                    key={a.name}
                    className="flex justify-between py-1 text-sm"
                  >
                    <span>{a.name}</span>
                    <span>₹{a.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-medium text-gray-600 mb-2">Fixed Assets</h4>
                {data.assets.fixedAssets.map(a => (
                  <div
                    key={a.name}
                    className="flex justify-between py-1 text-sm"
                  >
                    <span>{a.name}</span>
                    <span>₹{a.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-gray-800 border-t pt-2 mt-4">
                <span>Total Assets</span>
                <span>₹{data.assets.totalAssets.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </FormCard>
    </FormPage>
  );
}
