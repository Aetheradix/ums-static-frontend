import { useNavigate } from 'react-router-dom';
import { FormPage } from 'shared/new-components';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';

export default function FeeSummaryMockup() {
  const navigate = useNavigate();

  // Mock data representing the selected courses from the form
  const feeCalculationDetails = [
    {
      courseName: 'B.A. (General)',
      applicationType: 'New Affiliation (1st Year)',
      totalSeats: 120,
      baseFee: 40000,
      extraSeatBlocks: 1, // 1 block of 60 seats extra
      extraSeatFee: 20000,
      totalFee: 60000,
      status: 'Calculated from PDF Rule #1',
    },
    {
      courseName: 'B.Com. (General)',
      applicationType: 'Renewal (2nd Year)',
      totalSeats: 60,
      baseFee: 60000,
      extraSeatBlocks: 0,
      extraSeatFee: 0,
      totalFee: 60000,
      status: 'Calculated from PDF Rule #2',
    },
  ];

  const grandTotal = feeCalculationDetails.reduce(
    (acc, curr) => acc + curr.totalFee,
    0
  );

  return (
    <FormPage
      title="Step 11: Fee Payment & Summary"
      description="Review your calculated application fee based on your course selection before final submission."
    >
      <div className="card">
        <div className="mb-4 p-3 border-round bg-blue-50">
          <h4 className="m-0 text-blue-800">
            <i className="pi pi-info-circle mr-2"></i>Fee Calculation Logic
          </h4>
          <p className="mt-2 text-blue-900 line-height-3">
            यह पेज कॉलेज को फॉर्म भरने के बाद दिखेगा। कॉलेज ने जो भी{' '}
            <strong>Course</strong> और <strong>Year</strong> (New / Renewal)
            सेलेक्ट किया है, सिस्टम अपने आप <strong>Fee Master</strong> से मैच
            करके फीस कैलकुलेट कर लेगा। कॉलेज को बस यहाँ टोटल अमाउंट देखकर पे
            (Pay) करना है!
          </p>
        </div>

        <h5 className="mb-3">
          Itemized Fee Structure for Academic Year 2026-27
        </h5>
        <DataTable
          value={feeCalculationDetails}
          responsiveLayout="scroll"
          className="mb-4"
        >
          <Column field="courseName" header="Course Name" />
          <Column
            field="applicationType"
            header="Application Type"
            body={(row: any) => (
              <Badge
                value={row.applicationType}
                severity={
                  row.applicationType.includes('New') ? 'success' : 'info'
                }
              />
            )}
          />
          <Column field="totalSeats" header="Total Seats Requested" />
          <Column
            field="baseFee"
            header="Base Fee (₹)"
            body={(row: any) => `₹ ${row.baseFee.toLocaleString()}`}
          />
          <Column
            field="extraSeatFee"
            header="Extra Seat Fee (₹)"
            body={(row: any) => `₹ ${row.extraSeatFee.toLocaleString()}`}
          />
          <Column
            field="totalFee"
            header="Total Course Fee (₹)"
            body={(row: any) => (
              <strong className="text-primary">
                ₹ {row.totalFee.toLocaleString()}
              </strong>
            )}
          />
        </DataTable>

        <Divider />

        <div className="flex justify-content-between align-items-center bg-gray-100 p-4 border-round mt-4">
          <div>
            <span className="text-xl text-gray-700">Grand Total Payable:</span>
          </div>
          <div>
            <span className="text-3xl font-bold text-green-600">
              ₹ {grandTotal.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex justify-content-end gap-3 mt-5">
          <Button
            label="Back to Form"
            severity="secondary"
            outlined
            icon="pi pi-arrow-left"
            onClick={() => navigate(-1)}
          />
          <Button
            label="Proceed to Payment Gateway"
            icon="pi pi-check"
            onClick={() => alert('Redirecting to PG...')}
          />
        </div>
      </div>
    </FormPage>
  );
}
