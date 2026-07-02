import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { FormCard, FormPage } from 'shared/new-components';
import { ToastService } from 'services';
import { getAdmissionFeeStatus, payAdmissionFee } from '../api';
import type { AdmissionFeeStatus } from '../types';

interface FeePaymentProps {
  token: string;
}

export default function FeePayment({ token }: FeePaymentProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<AdmissionFeeStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStatus() {
      try {
        const data = await getAdmissionFeeStatus(token);
        setStatus(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load fee status');
        ToastService.error(err.message || 'Failed to load fee status');
      } finally {
        setLoading(false);
      }
    }
    loadStatus();
  }, [token]);

  const handlePay = async () => {
    setSubmitting(true);
    try {
      await payAdmissionFee(token);
      setStatus(prev => (prev ? { ...prev, isFeePaid: true } : prev));
      ToastService.success(
        'Fee paid successfully. Welcome email has been sent.'
      );
    } catch (err: any) {
      ToastService.error(err.message || 'Failed to process payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <FormPage
        title="College Fee Payment"
        description="Loading payment details..."
      >
        <div className="flex justify-center p-12">
          <ProgressSpinner />
        </div>
      </FormPage>
    );
  }

  if (error) {
    return (
      <FormPage title="College Fee Payment" description="Error loading details">
        <FormCard title="Error">
          <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg border border-red-200 shadow-sm flex flex-col items-center gap-3">
            <i className="pi pi-exclamation-triangle text-4xl"></i>
            <p className="font-semibold text-lg">{error}</p>
          </div>
        </FormCard>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="College Fee Payment"
      description="Pay your admission fee to confirm your enrollment."
    >
      <div className="max-w-4xl mx-auto">
        <FormCard>
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-6">
            <i className="pi pi-money-bill text-xl text-gray-700"></i>
            <h2 className="text-xl font-bold text-gray-800 m-0">
              Payment Details
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 p-5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-500 uppercase text-xs font-bold tracking-wider">
                  Student Name
                </span>
                <span className="font-bold text-gray-900 text-lg">
                  {status?.studentName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 uppercase text-xs font-bold tracking-wider">
                  Programme
                </span>
                <span className="font-bold text-blue-700">
                  {status?.programmeName}
                </span>
              </div>
            </div>

            {!status?.hasSubjectsSelected ? (
              <div className="p-8 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200 text-center shadow-sm">
                <i className="pi pi-exclamation-triangle text-4xl mb-4 text-yellow-600 block animate-bounce"></i>
                <h3 className="font-bold text-xl mb-2">
                  Subjects Not Selected
                </h3>
                <p className="text-yellow-700">
                  You must complete your subject selection before you can pay
                  the college fee.
                </p>
              </div>
            ) : status.isFeePaid ? (
              <div className="p-8 bg-green-50 text-green-800 rounded-lg border border-green-200 text-center flex flex-col items-center shadow-sm animate-fade-in">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-5 border-4 border-green-200 shadow-sm">
                  <i className="pi pi-check text-4xl text-green-600"></i>
                </div>
                <h3 className="font-bold text-2xl mb-3">
                  Admission Confirmed!
                </h3>
                <p className="mb-6 text-green-700">
                  Your college fee has been successfully paid.
                </p>
                <div className="bg-white p-5 rounded-lg border border-green-100 w-full max-w-sm text-left shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-green-800">
                    <i className="pi pi-envelope text-lg"></i>
                    <strong className="text-lg">Check your email!</strong>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    We've sent your student login credentials to your email
                    address. You can use these to access the full UMS portal.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6 mt-4">
                <div className="text-center p-8 border-2 border-blue-100 rounded-xl w-full max-w-md bg-gradient-to-b from-white to-blue-50 shadow-sm">
                  <p className="text-gray-500 mb-2 uppercase text-xs font-bold tracking-wider">
                    Total Amount Payable
                  </p>
                  <h2 className="text-5xl font-bold text-gray-900 my-4 tracking-tight">
                    ₹25,000
                  </h2>
                  <p className="text-sm text-blue-700 font-medium">
                    Annual Tuition Fee (Semester 1)
                  </p>
                </div>
                <Button
                  label={submitting ? 'Processing...' : 'Pay Fee Now'}
                  icon={
                    submitting ? 'pi pi-spin pi-spinner' : 'pi pi-credit-card'
                  }
                  className="w-full sm:w-auto p-button-lg shadow-md font-bold px-8"
                  onClick={handlePay}
                  disabled={submitting}
                  size="large"
                />
              </div>
            )}
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
