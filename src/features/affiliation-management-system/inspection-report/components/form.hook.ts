import Joi from 'joi';
import { useAppForm } from 'shared/hooks/form';
import validation from 'shared/utils/validation';

export interface InspectionReportFormData {
  // Step 1: Inspection Details
  inspection_date: Date | null;
  course_name: string[];
  college_name: string;
  society_name: string;
  college_address: string;
  member1_info: string;
  member2_info: string;
  member3_info: string;

  // Step 2: Infrastructure & Facilities
  built_up_area: string;
  classrooms_count_size: string;
  teaching_accommodation: string;
  non_teaching_accommodation: string;
  other_halls_details: string;
  construction_quality: string;
  building_approach: string;
  overall_ambiance: string;
  building_ownership: string;
  rental_agreement_done: string;
  provision_own_building: string;
  timeframe_own_building: string;
  parking_staff: string;
  parking_students: string;
  parking_visitors: string;
  parking_details_remarks: string;
  sports_facility_owned_area: string;
  sports_statutory_req: string;
  physical_welfare_avail: string;
  outdoor_sports_mou: string;
  building_shared: string;
  exclusive_space_shared: string;
  area_adequate_norms: string;
  exam_security_measures: string;
  neighbour_complaints: string;
  neighbour_remarks: string;
  environment_observations: string;
  boys_hostel_rooms: string;
  girls_hostel_rooms: string;
  hostel_reading_room: string;
  hostel_recreation: string;
  sanitation_condition: string;
  quarters_verified: string;
  reservation_norms_followed: string;
  quarters_future_plans: string;

  // Step 3: Academic Staff
  teachers_req_rules: string;
  teachers_on_paper: string;
  teachers_actually_present: string;
  reason_teacher_non_availability: string;
  teachers_qualified: string;
  teacher_student_ratio_adequate: string;
  suggested_ratio_text: string;
  principal_selection_code28: string;
  teachers_selection_code28: string;
  prop_teachers_on_paper: string;
  prop_teachers_actually_present: string;
  prop_reason_non_availability: string;
  prop_teachers_qualified: string;
  interaction_observations: string;

  // Step 4: Academic Facilities
  library_room_area: string;
  books_owned_count: string;
  books_hired_count: string;
  journals_subscribed_count: string;
  journals_relevant: string;
  library_staff_count: string;
  library_frequency: string;
  books_relevant: string;
  book_accounts_maintained: string;
  book_accounts_audited: string;
  latest_computers: string;
  old_computers: string;
  printers_count: string;
  scanners_count: string;
  internet_facility_type: string;
  computer_trained_staff: string;
  computer_student_ratio: string;
  computers_working_count: string;
  down_time: string;
  licensed_software_names: string;
  packages_in_use: string;
  computers_future_plans: string;
  lab_avail_norms: string;
  lab_floor_space: string;
  lab_equipment_desc: string;
  workshop_details: string;
  hospital_availability: string;
  first_aid_avail: string;
  fire_fighting_avail: string;
  major_instruments_details: string;

  // Step 5: Compliance & Opinion
  aicte_conditions_fulfilled: string;
  statutory_approval_obtained: string;
  permission_session_year: string;
  statutory_compliance_status: string;
  proposed_courses_opinion: string;
  running_courses_opinion: string;
  unsubstantiated_point_a: string;
  unsubstantiated_point_b: string;
  unsubstantiated_point_c: string;
  positive_points: string;
  negative_points: string;
  overall_assessment: string;
  m1_signature_name: string;
  m1_designation_scale: string;
  m1_signature_file: File | string | null;
  m2_signature_name: string;
  m2_designation_scale: string;
  m2_signature_file: File | string | null;
  m3_signature_name: string;
  m3_designation_scale: string;
  m3_signature_file: File | string | null;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const imageFileValidator = (o: Joi.Root) =>
  o
    .any()
    .custom((value: unknown, helpers: Joi.CustomHelpers) => {
      if (value instanceof File) {
        if (!['image/jpeg', 'image/png'].includes(value.type)) {
          return helpers.error('any.invalid');
        }
        if (value.size > MAX_FILE_SIZE) {
          return helpers.error('any.invalid');
        }
      }
      return value;
    })
    .messages({
      'any.invalid': 'Invalid file (JPG/PNG only, maximum size 2MB)',
    });

const schema = validation.create<InspectionReportFormData>(o => ({
  // Step 1
  inspection_date: o.date().optional().allow(null),
  course_name: o.array().items(o.string()).optional().allow(null),
  college_name: o.string().optional().allow('', null),
  society_name: o.string().optional().allow('', null),
  college_address: o.string().optional().allow('', null),
  member1_info: o.string().optional().allow('', null),
  member2_info: o.string().optional().allow('', null),
  member3_info: o.string().allow('', null).optional(),

  // Step 2
  built_up_area: o.string().allow('', null).optional(),
  classrooms_count_size: o.string().allow('', null).optional(),
  teaching_accommodation: o.string().allow('', null).optional(),
  non_teaching_accommodation: o.string().allow('', null).optional(),
  other_halls_details: o.string().allow('', null).optional(),
  construction_quality: o.string().allow('', null).optional(),
  building_approach: o.string().allow('', null).optional(),
  overall_ambiance: o.string().allow('', null).optional(),
  building_ownership: o.string().allow('', null).optional(),
  rental_agreement_done: o.string().allow('', null).optional(),
  provision_own_building: o.string().allow('', null).optional(),
  timeframe_own_building: o.string().allow('', null).optional(),
  parking_staff: o.string().allow('', null).optional(),
  parking_students: o.string().allow('', null).optional(),
  parking_visitors: o.string().allow('', null).optional(),
  parking_details_remarks: o.string().allow('', null).optional(),
  sports_facility_owned_area: o.string().allow('', null).optional(),
  sports_statutory_req: o.string().allow('', null).optional(),
  physical_welfare_avail: o.string().allow('', null).optional(),
  outdoor_sports_mou: o.string().allow('', null).optional(),
  building_shared: o.string().allow('', null).optional(),
  exclusive_space_shared: o.string().allow('', null).optional(),
  area_adequate_norms: o.string().allow('', null).optional(),
  exam_security_measures: o.string().allow('', null).optional(),
  neighbour_complaints: o.string().allow('', null).optional(),
  neighbour_remarks: o.string().allow('', null).optional(),
  environment_observations: o.string().allow('', null).optional(),
  boys_hostel_rooms: o.string().allow('', null).optional(),
  girls_hostel_rooms: o.string().allow('', null).optional(),
  hostel_reading_room: o.string().allow('', null).optional(),
  hostel_recreation: o.string().allow('', null).optional(),
  sanitation_condition: o.string().allow('', null).optional(),
  quarters_verified: o.string().allow('', null).optional(),
  reservation_norms_followed: o.string().allow('', null).optional(),
  quarters_future_plans: o.string().allow('', null).optional(),

  // Step 3
  teachers_req_rules: o.string().allow('', null).optional(),
  teachers_on_paper: o.string().allow('', null).optional(),
  teachers_actually_present: o.string().allow('', null).optional(),
  reason_teacher_non_availability: o.string().allow('', null).optional(),
  teachers_qualified: o.string().allow('', null).optional(),
  teacher_student_ratio_adequate: o.string().allow('', null).optional(),
  suggested_ratio_text: o.string().allow('', null).optional(),
  principal_selection_code28: o.string().allow('', null).optional(),
  teachers_selection_code28: o.string().allow('', null).optional(),
  prop_teachers_on_paper: o.string().allow('', null).optional(),
  prop_teachers_actually_present: o.string().allow('', null).optional(),
  prop_reason_non_availability: o.string().allow('', null).optional(),
  prop_teachers_qualified: o.string().allow('', null).optional(),
  interaction_observations: o.string().allow('', null).optional(),

  // Step 4
  library_room_area: o.string().allow('', null).optional(),
  books_owned_count: o.string().allow('', null).optional(),
  books_hired_count: o.string().allow('', null).optional(),
  journals_subscribed_count: o.string().allow('', null).optional(),
  journals_relevant: o.string().allow('', null).optional(),
  library_staff_count: o.string().allow('', null).optional(),
  library_frequency: o.string().allow('', null).optional(),
  books_relevant: o.string().allow('', null).optional(),
  book_accounts_maintained: o.string().allow('', null).optional(),
  book_accounts_audited: o.string().allow('', null).optional(),
  latest_computers: o.string().allow('', null).optional(),
  old_computers: o.string().allow('', null).optional(),
  printers_count: o.string().allow('', null).optional(),
  scanners_count: o.string().allow('', null).optional(),
  internet_facility_type: o.string().allow('', null).optional(),
  computer_trained_staff: o.string().allow('', null).optional(),
  computer_student_ratio: o.string().allow('', null).optional(),
  computers_working_count: o.string().allow('', null).optional(),
  down_time: o.string().allow('', null).optional(),
  licensed_software_names: o.string().allow('', null).optional(),
  packages_in_use: o.string().allow('', null).optional(),
  computers_future_plans: o.string().allow('', null).optional(),
  lab_avail_norms: o.string().allow('', null).optional(),
  lab_floor_space: o.string().allow('', null).optional(),
  lab_equipment_desc: o.string().allow('', null).optional(),
  workshop_details: o.string().allow('', null).optional(),
  hospital_availability: o.string().allow('', null).optional(),
  first_aid_avail: o.string().allow('', null).optional(),
  fire_fighting_avail: o.string().allow('', null).optional(),
  major_instruments_details: o.string().allow('', null).optional(),

  // Step 5
  aicte_conditions_fulfilled: o.string().allow('', null).optional(),
  statutory_approval_obtained: o.string().allow('', null).optional(),
  permission_session_year: o.string().allow('', null).optional(),
  statutory_compliance_status: o.string().allow('', null).optional(),
  proposed_courses_opinion: o.string().allow('', null).optional(),
  running_courses_opinion: o.string().allow('', null).optional(),
  unsubstantiated_point_a: o.string().allow('', null).optional(),
  unsubstantiated_point_b: o.string().allow('', null).optional(),
  unsubstantiated_point_c: o.string().allow('', null).optional(),
  positive_points: o.string().allow('', null).optional(),
  negative_points: o.string().allow('', null).optional(),
  overall_assessment: o.string().optional().allow(''),
  m1_signature_name: o.string().optional().allow(''),
  m1_designation_scale: o.string().optional().allow(''),
  m1_signature_file: imageFileValidator(o).optional().allow(null),
  m2_signature_name: o.string().optional().allow(''),
  m2_designation_scale: o.string().optional().allow(''),
  m2_signature_file: imageFileValidator(o).optional().allow(null),
  m3_signature_name: o.string().allow('', null).optional(),
  m3_designation_scale: o.string().allow('', null).optional(),
  m3_signature_file: imageFileValidator(o).optional().allow(null),
}));

export const STEP_FIELDS = {
  0: [
    'inspection_date',
    'course_name',
    'college_name',
    'society_name',
    'college_address',
    'member1_info',
    'member2_info',
    'member3_info',
  ],
  1: [
    'built_up_area',
    'classrooms_count_size',
    'teaching_accommodation',
    'non_teaching_accommodation',
    'other_halls_details',
    'construction_quality',
    'building_approach',
    'overall_ambiance',
    'building_ownership',
    'rental_agreement_done',
    'provision_own_building',
    'timeframe_own_building',
    'parking_staff',
    'parking_students',
    'parking_visitors',
    'parking_details_remarks',
    'sports_facility_owned_area',
    'sports_statutory_req',
    'physical_welfare_avail',
    'outdoor_sports_mou',
    'building_shared',
    'exclusive_space_shared',
    'area_adequate_norms',
    'exam_security_measures',
    'neighbour_complaints',
    'neighbour_remarks',
    'environment_observations',
    'boys_hostel_rooms',
    'girls_hostel_rooms',
    'hostel_reading_room',
    'hostel_recreation',
    'sanitation_condition',
    'quarters_verified',
    'reservation_norms_followed',
    'quarters_future_plans',
  ],
  2: [
    'teachers_req_rules',
    'teachers_on_paper',
    'teachers_actually_present',
    'reason_teacher_non_availability',
    'teachers_qualified',
    'teacher_student_ratio_adequate',
    'suggested_ratio_text',
    'principal_selection_code28',
    'teachers_selection_code28',
    'prop_teachers_on_paper',
    'prop_teachers_actually_present',
    'prop_reason_non_availability',
    'prop_teachers_qualified',
    'interaction_observations',
  ],
  3: [
    'library_room_area',
    'books_owned_count',
    'books_hired_count',
    'journals_subscribed_count',
    'journals_relevant',
    'library_staff_count',
    'library_frequency',
    'books_relevant',
    'book_accounts_maintained',
    'book_accounts_audited',
    'latest_computers',
    'old_computers',
    'printers_count',
    'scanners_count',
    'internet_facility_type',
    'computer_trained_staff',
    'computer_student_ratio',
    'computers_working_count',
    'down_time',
    'licensed_software_names',
    'packages_in_use',
    'computers_future_plans',
    'lab_avail_norms',
    'lab_floor_space',
    'lab_equipment_desc',
    'workshop_details',
    'hospital_availability',
    'first_aid_avail',
    'fire_fighting_avail',
    'major_instruments_details',
  ],
  4: [
    'aicte_conditions_fulfilled',
    'statutory_approval_obtained',
    'permission_session_year',
    'statutory_compliance_status',
    'proposed_courses_opinion',
    'running_courses_opinion',
    'unsubstantiated_point_a',
    'unsubstantiated_point_b',
    'unsubstantiated_point_c',
    'positive_points',
    'negative_points',
    'overall_assessment',
    'm1_signature_name',
    'm1_designation_scale',
    'm1_signature_file',
    'm2_signature_name',
    'm2_designation_scale',
    'm2_signature_file',
    'm3_signature_name',
    'm3_designation_scale',
    'm3_signature_file',
  ],
};

export function useInspectionReportForm() {
  const methods = useAppForm<InspectionReportFormData>({
    resolver: validation.resolver(schema),
    mode: 'onChange',
    defaultValues: {
      inspection_date: null,
      building_ownership: 'Self-owned',
      parking_staff: 'Yes',
      parking_students: 'Yes',
      parking_visitors: 'Yes',
      building_shared: 'No',
    },
  });

  return methods;
}
