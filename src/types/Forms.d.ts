import type { DefaultValues, FieldValues } from 'react-hook-form';

declare global {
  declare namespace Forms {
    type SubmitFunc<TParam, TResult = void> = (
      data: TParam
    ) => Promise<TResult>;

    type FetchDataFunc<TForm extends FieldValues> =
      | DefaultValues<TForm>
      | (() => Promise<TForm>);
  }
}
