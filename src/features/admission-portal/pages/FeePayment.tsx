import { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { FormCard, FormPage } from 'shared/new-components';
import { getAdmissionFeeStatus, payAdmissionFee } from '../api';
import type { AdmissionFeeStatus } from '../types';

interface FeePaymentProps {
  token: string;
}

export default function FeePayment({ token }: FeePaymentProps) {
  const toast = useRef<Toast>(null);
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
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: err.message || 'Failed to load fee status',
        });
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
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Fee paid successfully. Welcome email has been sent.',
      });
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Payment Failed',
        detail: err.message || 'Failed to process payment',
      });
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
        <FormCard title="Error" icon="pi-exclamation-triangle">
          <div className="p-6 text-center text-red-600">
            <p>{error}</p>
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
      <Toast ref={toast} position="top-right" />

      <FormCard title="Payment Details" icon="pi-money-bill">
        <div className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between">
              <span className="text-gray-600">Student Name:</span>
              <span className="font-medium text-gray-900">
                {status?.studentName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Programme:</span>
              <span className="font-medium text-gray-900">
                {status?.programmeName}
              </span>
            </div>
          </div>

          {!status?.hasSubjectsSelected ? (
            <div className="p-6 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200 text-center">
              <i className="pi pi-exclamation-triangle text-2xl mb-3 block"></i>
              <h3 className="font-bold mb-1">Subjects Not Selected</h3>
              <p className="text-sm">
                You must complete your subject selection before you can pay the
                college fee.
              </p>
            </div>
          ) : status.isFeePaid ? (
            <div className="p-8 bg-green-50 text-green-800 rounded-lg border border-green-200 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <i className="pi pi-check text-3xl text-green-600"></i>
              </div>
              <h3 className="font-bold text-xl mb-2">Admission Confirmed!</h3>
              <p className="text-sm mb-4">
                Your college fee has been successfully paid.
              </p>
              <div className="bg-white p-4 rounded-lg border border-green-100 w-full max-w-sm text-left">
                <p className="text-sm mb-2">
                  <i className="pi pi-envelope mr-2"></i>
                  <strong>Check your email!</strong>
                </p>
                <p className="text-xs text-green-700">
                  We've sent your student login credentials to your email
                  address. You can use these to access the full UMS portal.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <div className="text-center p-8 border border-gray-200 rounded-lg w-full bg-white">
                <p className="text-gray-500 mb-2">Total Amount Payable</p>
                <h2 className="text-4xl font-bold text-gray-900">₹25,000</h2>
                <p className="text-xs text-gray-400 mt-2">
                  Annual Tuition Fee (Semester 1)
                </p>
              </div>
              <Button
                label={submitting ? 'Processing...' : 'Pay Fee Now'}
                icon={
                  submitting ? 'pi pi-spin pi-spinner' : 'pi pi-credit-card'
                }
                className="w-full sm:w-auto p-button-lg shadow-md"
                onClick={handlePay}
                disabled={submitting}
              />
            </div>
          )}
        </div>
      </FormCard>
    </FormPage>
  );
}
