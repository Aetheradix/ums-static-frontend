import { PortalSelector } from 'shared/new-components';
import { learningUrls } from '../../urls';

export default function AssessmentPortal() {
  return (
    <PortalSelector
      moduleTitle="Assessment Management"
      moduleDescription="Design tests, create questions, evaluate student responses and publish marks."
      backPath={learningUrls.teacher.portal}
      backLabel="Teacher Portal"
      portals={[
        {
          title: 'Question Bank',
          description: 'Manage institutional question repositories and categories.',
          icon: 'menu_book',
          colorScheme: 'purple',
          path: `${learningUrls.teacher.assessment}/question-bank`,
        },
        {
          title: 'Quiz Management',
          description: 'Create and configure student quizzes and durations.',
          icon: 'quiz',
          colorScheme: 'orange',
          path: `${learningUrls.teacher.assessment}/quizzes`,
        },
        {
          title: 'Evaluate Assignments',
          description: 'Grade submitted student assignments and provide feedback.',
          icon: 'assignment_turned_in',
          colorScheme: 'green',
          path: `${learningUrls.teacher.assessment}/assignments`,
        },
        {
          title: 'Publish Results',
          description: 'Release test scores and student performance reviews.',
          icon: 'publish',
          colorScheme: 'blue',
          path: `${learningUrls.teacher.assessment}/publish`,
        },
      ]}
    />
  );
}
