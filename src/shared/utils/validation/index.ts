import { joiResolver } from '@hookform/resolvers/joi';
import Joi, { type Reference, type ReferenceOptions } from 'joi';
import { expressions, keys, messages } from './config';

interface Root<TSchema> extends Omit<Joi.Root, 'ref'> {
  ref(key: keyof TSchema, options?: ReferenceOptions): Reference;
}

type Func<T> = (v: Root<T>) => Joi.PartialSchemaMap<T>;

const defaults = Joi.defaults(x => {
  return x.options({ messages });
});

function create<T>(v: Func<T>) {
  return Joi.compile(defaults.object<T>(v(Joi as Root<T>)).unknown(true));
}

const resolver = joiResolver;
export default { create, resolver };
export { expressions, keys };
