import Features from 'features';
import { Toast } from 'primereact/toast';
import { useEffect, useRef } from 'react';
import { PubSubService, ToastService } from 'services';

export default function App() {
  const toast = useRef<Toast>(null);

  useEffect(() => {
    ToastService.setToastRef(toast);

    const onApiError = (message: string) => {
      ToastService.error(message || 'An unexpected error occurred.');
    };

    const onApiValidationError = (errors: Api.ValidationError[]) => {
      ToastService.error(
        errors.map(e => e.text),
        'Validation Problem'
      );
    };

    const onApiNotOk = (message: Api.EventMessage) => {
      ToastService.error(message.messages, message.title);
    };

    PubSubService.subscribe('@event/api-error', onApiError);
    PubSubService.subscribe(
      '@event/api-validation-error',
      onApiValidationError
    );
    PubSubService.subscribe('@event/api-not-ok', onApiNotOk);

    return () => {
      PubSubService.unsubscribe('@event/api-error', onApiError);
      PubSubService.unsubscribe(
        '@event/api-validation-error',
        onApiValidationError
      );
      PubSubService.unsubscribe('@event/api-not-ok', onApiNotOk);
    };
  }, []);

  return (
    <>
      <Toast ref={toast} className="white-toast" />
      <Features />
    </>
  );
}
