import SubjectSelection from 'features/admission-portal/pages/SubjectSelection';

type Props = {
  token?: string;
};

export default function AdmissionsSubjectSelection({ token }: Props) {
  return <SubjectSelection token={token ?? 'mock-token'} />;
}
