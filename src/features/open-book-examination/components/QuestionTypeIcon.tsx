import type { QuestionType } from '../data';

const iconMap: Record<QuestionType, string> = {
  mcq: 'radio_button_checked',
  true_false: 'toggle_on',
  fill_blanks: 'edit_note',
  short_answer: 'short_text',
  long_answer: 'article',
  case_study: 'work_history',
  coding: 'code',
  matching: 'comparison',
  assertion_reason: 'psychology',
};

interface Props {
  type: QuestionType;
  className?: string;
}

export default function QuestionTypeIcon({ type, className = '' }: Props) {
  return (
    <span
      className={`material-symbols-outlined text-lg ${className}`}
      title={type.replace('_', ' ')}
    >
      {iconMap[type] || 'help'}
    </span>
  );
}
