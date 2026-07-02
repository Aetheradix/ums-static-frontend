import FeePayment from 'features/admission-portal/pages/FeePayment';

type Props = {
  token?: string;
};

export default function AdmissionsFeePayment({ token }: Props) {
  return <FeePayment token={token ?? 'mock-token'} />;
}
