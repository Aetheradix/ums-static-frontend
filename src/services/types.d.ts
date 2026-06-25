declare namespace Events {
  type ApiEvent =
    | '@event/api-not-ok'
    | '@event/api-error'
    | '@event/api-validation-error'
    | '@event/api-unauthorized';

  type Event = ApiEvent;
}

declare namespace Api {
  type EventMessage = {
    title: string;
    messages: string[];
    requiresLogin?: boolean;
  };

  type TypedValidationError = {
    identifier: string;
    errorMessage: string;
  };

  type TypedError = {
    type: string;
    title?: string;
    code: 'not_found' | 'validation_failure' | 'conflict' | 'unauthorized';
    detail: string;
    errors?: TypedValidationError[];
  };

  interface ValidationError {
    field: string;
    text: string;
  }

  interface ApiResult<T = unknown> {
    error: boolean;
    data?: T;
  }
}
