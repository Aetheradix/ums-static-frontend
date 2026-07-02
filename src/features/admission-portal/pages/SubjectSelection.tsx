import { useEffect, useState, useCallback } from 'react';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Badge } from 'primereact/badge';
import { FormPage, FormCard } from 'shared/new-components';
import { ToastService } from 'services';
import type { SubjectSelectionInfo, SubjectDto } from '../types';
import SelectSemester from 'features/components/SelectSemester';
import {
  getSubjectSelectionInfo,
  getSubjectsBySemester,
  submitSubjectSelection,
} from '../api';

// Static semester list — mirrors the master dictionary on the backend
const SEMESTER_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  id: `Semester ${i + 1}`,
  text: `Semester ${i + 1}`,
}));

export default function SubjectSelection({ token }: { token: string }) {
  const [info, setInfo] = useState<SubjectSelectionInfo | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<SubjectDto[]>([]);
  const [selectedPssIds, setSelectedPssIds] = useState<number[]>([]);

  const [loadingInfo, setLoadingInfo] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ── Load programme info on mount ────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setLoadingInfo(true);
      try {
        const infoData = await getSubjectSelectionInfo(token);
        if (cancelled) return;
        setInfo(infoData);
      } catch {
        if (cancelled) return;
        ToastService.error(
          'Failed to load programme information. Please refresh.'
        );
      } finally {
        if (!cancelled) setLoadingInfo(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [token]);

  // ── Load subjects whenever semester changes ─────────────────────────────
  const loadSubjects = useCallback(
    async (semesterName: string) => {
      setLoadingSubjects(true);
      try {
        const data = await getSubjectsBySemester(token, semesterName);
        const arr = Array.isArray(data) ? data : [];
        setSubjects(arr);
        setSelectedPssIds(arr.filter(s => s.isSelected).map(s => s.pssId));
      } catch {
        ToastService.error(
          'Failed to load subjects for the selected semester.'
        );
      } finally {
        setLoadingSubjects(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (selectedSemester) {
      loadSubjects(selectedSemester);
    }
  }, [selectedSemester, loadSubjects]);

  // ── Toggle subject selection ────────────────────────────────────────────
  const toggleSubject = (pssId: number) => {
    setSelectedPssIds(prev =>
      prev.includes(pssId) ? prev.filter(id => id !== pssId) : [...prev, pssId]
    );
  };

  // ── Submit selection ────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!selectedSemester) {
      ToastService.error('Please select a semester first.');
      return;
    }

    setSubmitting(true);
    try {
      await submitSubjectSelection(token, {
        email: '', // extracted from token on backend
        semesterName: selectedSemester,
        selectedPssIds,
      });
      ToastService.success(
        'Your subject selection has been saved successfully.'
      );
      // Refresh to sync isSelected flags from DB
      await loadSubjects(selectedSemester);
    } catch (e) {
      ToastService.error(
        e instanceof Error
          ? e.message
          : 'Could not save selection. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Group subjects by category ──────────────────────────────────────────
  const safeSubjects = Array.isArray(subjects) ? subjects : [];
  const categoryGroups = safeSubjects.reduce<Record<string, SubjectDto[]>>(
    (acc, subj) => {
      (acc[subj.categoryName] ??= []).push(subj);
      return acc;
    },
    {}
  );

  const totalSelectedCredits = safeSubjects
    .filter(s => selectedPssIds.includes(s.pssId))
    .reduce((sum, s) => sum + s.totalCredits, 0);

  // ── Full-page spinner while bootstrapping ───────────────────────────────
  if (loadingInfo) {
    return (
      <FormPage
        title="Subject Selection"
        description="Loading your programme details…"
      >
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <ProgressSpinner
            style={{ width: '48px', height: '48px' }}
            strokeWidth="4"
          />
          <p className="mt-4 text-gray-500 font-medium">
            Fetching programme information…
          </p>
        </div>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Subject Selection"
      description={
        info
          ? `${info.programmeName}  ·  ${info.specialisationName}`
          : 'Select your subjects for each semester'
      }
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <FormCard>
          {/* ── Semester selector bar ─────────────────────────── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
              <label className="font-bold text-gray-700 whitespace-nowrap">
                Select Semester:
              </label>
              <SelectSemester
                id="semester-dropdown"
                name="semester"
                data={SEMESTER_OPTIONS}
                loading={loadingSubjects}
                value={selectedSemester}
                onChange={(val: string | number | null) =>
                  setSelectedSemester(val as string)
                }
                disabled={loadingSubjects || submitting}
                defaultOptionText="Choose a semester"
                required={true}
              />
            </div>

            {selectedSemester && (
              <div className="flex items-center gap-4 p-3 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-600 text-white rounded flex items-center justify-center font-bold text-2xl shadow-sm">
                  {totalSelectedCredits}
                </div>
                <div className="flex flex-col">
                  <span className="text-blue-900 font-bold uppercase tracking-wider text-xs">
                    Total Selected
                  </span>
                  <span className="text-blue-700 font-medium text-sm">
                    Credits
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ── Subject list ──────────────────────────────────── */}
          {selectedSemester && (
            <div className="mt-6">
              {/* Panel header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <i className="pi pi-book text-2xl text-blue-600" />
                  <span className="text-2xl font-bold text-gray-800 tracking-tight">
                    {selectedSemester}
                  </span>
                  {!loadingSubjects && (
                    <Badge
                      value={`${subjects.length} subjects`}
                      severity="info"
                      className="ml-2 font-medium"
                    />
                  )}
                </div>
                <Button
                  label="Save Selection"
                  icon="pi pi-check"
                  loading={submitting}
                  disabled={submitting || loadingSubjects}
                  onClick={handleSubmit}
                  size="large"
                  severity="success"
                  className="shadow-md font-bold px-6"
                />
              </div>

              {/* Content */}
              {loadingSubjects ? (
                <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border border-gray-100">
                  <ProgressSpinner
                    style={{ width: '36px', height: '36px' }}
                    strokeWidth="4"
                  />
                  <p className="mt-4 text-gray-500 font-medium">
                    Loading subjects for {selectedSemester}…
                  </p>
                </div>
              ) : Object.keys(categoryGroups).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <i className="pi pi-inbox text-5xl text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium text-lg">
                    No subjects found for this semester.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {Object.entries(categoryGroups).map(
                    ([category, catSubjects]) => (
                      <div key={category} className="bg-white">
                        <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-2">
                          <h4 className="text-lg font-bold text-gray-800 m-0 uppercase tracking-wide">
                            {category}
                          </h4>
                          <Badge
                            value={catSubjects.length.toString()}
                            severity="secondary"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          {catSubjects.map(subj => {
                            const isChecked = selectedPssIds.includes(
                              subj.pssId
                            );
                            return (
                              <div
                                key={subj.pssId}
                                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                                  isChecked
                                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                                    : 'border-gray-200 bg-white hover:border-blue-300'
                                }`}
                                onClick={() => toggleSubject(subj.pssId)}
                                role="checkbox"
                                aria-checked={isChecked}
                                tabIndex={0}
                                onKeyDown={e =>
                                  e.key === ' ' && toggleSubject(subj.pssId)
                                }
                              >
                                <div className="mr-4 mt-0.5">
                                  <Checkbox
                                    checked={isChecked}
                                    onChange={() => toggleSubject(subj.pssId)}
                                    inputId={`subject-${subj.pssId}`}
                                    onClick={e => e.stopPropagation()}
                                  />
                                </div>
                                <div className="flex flex-col flex-grow min-w-0">
                                  <label
                                    htmlFor={`subject-${subj.pssId}`}
                                    className={`font-semibold truncate cursor-pointer ${isChecked ? 'text-blue-900' : 'text-gray-800'}`}
                                    onClick={e => e.stopPropagation()}
                                    title={subj.subjectName}
                                  >
                                    {subj.subjectName}
                                  </label>
                                  <span className="text-xs text-gray-500 font-mono mt-1">
                                    {subj.subjectCode}
                                  </span>
                                </div>
                                <div className="ml-3 flex flex-col items-center justify-center shrink-0 w-12 h-12 bg-white rounded-lg border border-gray-100 shadow-sm">
                                  <span
                                    className={`font-bold text-lg leading-none ${isChecked ? 'text-blue-600' : 'text-gray-700'}`}
                                  >
                                    {subj.totalCredits}
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                                    cr
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </FormCard>
      </div>
    </FormPage>
  );
}
