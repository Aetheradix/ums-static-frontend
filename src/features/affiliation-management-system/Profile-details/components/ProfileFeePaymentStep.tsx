import { useState } from 'react';
import type { Control, FormState, Path } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { Button } from 'shared/components/buttons';
import { Grid } from 'shared/components/grid';
import {
  FormCard,
  PaymentDialog,
  ReceiptDialog,
  StatusBadge,
} from 'shared/new-components';
import { courseOptions, FEE_MASTER } from './courseFees';
import type { ProfileDetailsFormData } from './form.hook';

interface ProfileFeePaymentStepProps {
  register: (name: Path<ProfileDetailsFormData>) => {
    control: Control<ProfileDetailsFormData>;
    name: Path<ProfileDetailsFormData>;
  };
  control: Control<ProfileDetailsFormData>;
  formState: FormState<ProfileDetailsFormData>;
}

export default function ProfileFeePaymentStep({
  control,
}: ProfileFeePaymentStepProps) {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<{
    transactionId: string;
    date: string;
  } | null>(null);
  const isPaid = paymentInfo !== null;

  const existingCoursesWatch = useWatch({ control, name: 'existingCourses' });

  const feeData = (existingCoursesWatch || []).map((courseItem: any) => {
    const courseId = courseItem.courseName;
    const courseName =
      courseOptions.find(o => o.id === courseId)?.name ||
      courseId ||
      'Unknown Course';
    const fee = FEE_MASTER[courseId as string] || 0;
    return { courseName, fee, isPaid };
  });

  const totalFee = feeData.reduce(
    (acc: number, curr: any) => acc + curr.fee,
    0
  );

  return (
    <>
      <FormCard
        title="COURSE FEES & PAYMENT"
        subtitle="Review the affiliation fee for each registered course and pay to complete your application."
        icon="money-bill"
      >
        {feeData.length === 0 ? (
          <div className="p-6 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
            <i className="pi pi-book text-2xl mb-2 block" />
            No courses registered yet. Add courses in the Course Registration
            step to see the fee summary here.
          </div>
        ) : (
          <>
            <Grid
              data={feeData}
              columns={[
                {
                  header: 'COURSE / SUBJECT',
                  cell: (item: any) => item.courseName,
                },
                {
                  header: 'FEE (₹)',
                  cell: (item: any) =>
                    new Intl.NumberFormat('en-IN').format(item.fee),
                },
                {
                  header: 'PAYMENT STATUS',
                  cell: (item: any) => (
                    <StatusBadge
                      label={item.isPaid ? 'Paid' : 'Pending'}
                      variant={item.isPaid ? 'approved' : 'pending'}
                    />
                  ),
                },
              ]}
              pagination={false}
            />
            <div className="flex justify-end items-center mt-6 p-4 bg-gray-50 border rounded font-semibold text-lg">
              <span className="mr-4">Total Amount:</span>
              <span className="text-blue-700">
                ₹ {new Intl.NumberFormat('en-IN').format(totalFee)}
              </span>
            </div>

            {isPaid ? (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="pi pi-check text-green-600 text-lg" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-green-800">
                      Affiliation Fee Paid Successfully
                    </h4>
                    <p className="text-xs text-green-700 mt-0.5">
                      Transaction ID:{' '}
                      <span className="font-mono font-semibold">
                        {paymentInfo?.transactionId}
                      </span>{' '}
                      · Paid on {paymentInfo?.date}
                    </p>
                  </div>
                </div>
                <Button
                  label="View Receipt"
                  icon="file"
                  variant="outlined"
                  onClick={() => setIsReceiptOpen(true)}
                />
              </div>
            ) : (
              <div className="mt-4 flex justify-end">
                <Button
                  label="Proceed to Payment"
                  icon="credit-card"
                  variant="primary"
                  disabled={totalFee === 0}
                  onClick={() => setIsPaymentOpen(true)}
                />
              </div>
            )}
          </>
        )}
      </FormCard>

      <PaymentDialog
        visible={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={totalFee}
        title="Affiliation Fee Payment"
        description="Pay the course-wise affiliation fee to submit your application."
        onSuccess={transactionId => {
          setPaymentInfo({
            transactionId,
            date: new Date().toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
          });
          setIsPaymentOpen(false);
          setIsReceiptOpen(true);
        }}
      />

      <ReceiptDialog
        visible={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        transactionId={paymentInfo?.transactionId || ''}
        amount={totalFee}
        date={paymentInfo?.date || ''}
        title="Payment Successful"
      />
    </>
  );
}
