import type { FieldValues, Path, UseFormWatch } from 'react-hook-form';

export const STREAM_REQUIRED_CLASSES = [11, 12];

export const hasStream = (classId?: number): boolean => {
  if (!classId) return false;
  return STREAM_REQUIRED_CLASSES.some(val => classId === val);
};

export const useStreamVisibility = <T extends FieldValues>(
  watch: UseFormWatch<T>,
  fieldName: Path<T>
) => {
  const selectedClass = watch(fieldName);
  return hasStream(selectedClass?.id);
};
