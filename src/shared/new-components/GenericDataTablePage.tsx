import FormPage from './FormPage';
import FormCard from './FormCard';

interface GenericDataTablePageProps {
  title: string;
  description: string;
}

export default function GenericDataTablePage({
  title,
  description,
}: GenericDataTablePageProps) {
  return (
    <FormPage title={title} description={description}>
      <FormCard>
        <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center">
          <i className="pi pi-hammer text-4xl mb-4 text-gray-300"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Under Construction
          </h3>
          <p>
            The <strong>{title}</strong> page is currently being developed.
          </p>
        </div>
      </FormCard>
    </FormPage>
  );
}
