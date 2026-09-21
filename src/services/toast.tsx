import type { Toast } from 'primereact/toast';
import type { RefObject } from 'react';

let toastRef: RefObject<Toast | null>;

function setToastRef(ref: RefObject<Toast | null>) {
  toastRef = ref;
}

function success(message: string) {
  toastRef?.current?.show({ severity: 'success', detail: message });
}

function error(message: string | string[], title?: string) {
  if (!toastRef || !toastRef.current) {
    return;
  }

  if (!Array.isArray(message)) {
    toastRef.current.show({
      severity: 'error',
      summary: title,
      detail: message,
    });
    return;
  }

  toastRef.current.show({
    severity: 'error',
    summary: title,
    content: () => (
      <div>
        {message.map(item => (
          <div key={item}>{item}</div>
        ))}
      </div>
    ),
  });
}

function info(message: string, title?: string) {
  toastRef?.current?.show({
    severity: 'info',
    summary: title,
    detail: message,
  });
}

function warn(message: string, title?: string) {
  toastRef?.current?.show({
    severity: 'warn',
    summary: title,
    detail: message,
  });
}

export default { setToastRef, success, error, info, warn, warning: warn };
