import {
  genders,
  castes,
  nationalities,
  residencyStatuses,
  occupations,
  designations,
  addressTypes,
} from './master-lookups';
import {
  academicYears,
  programmes,
  degreeLevels,
  specialisations,
  programmeModes,
} from './academic-lookups';
import {
  states,
  divisions,
  districts,
  tehsils,
  blocks,
} from './location-hierarchy';
import { collegeCategories, collegeTypes, allColleges } from './college-data';
import { sampleApplication } from './sample-application';
import type { MasterLookups } from '../types';

export {
  genders,
  castes,
  nationalities,
  residencyStatuses,
  occupations,
  designations,
  addressTypes,
  academicYears,
  programmes,
  degreeLevels,
  specialisations,
  programmeModes,
  states,
  divisions,
  districts,
  tehsils,
  blocks,
  collegeCategories,
  collegeTypes,
  allColleges,
  sampleApplication,
};

export function getAllLookups(): MasterLookups {
  return {
    genders,
    castes,
    nationalities,
    residencyStatuses,
    occupations,
    designations,
    addressTypes,
    academicYears,
    programmes,
    degreeLevels,
    specialisations,
    programmeModes,
    states,
    divisions,
    districts,
    tehsils,
    blocks,
    collegeCategories,
    collegeTypes,
    allColleges,
  };
}
