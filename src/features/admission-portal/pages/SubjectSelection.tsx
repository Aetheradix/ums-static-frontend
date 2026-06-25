import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Checkbox } from 'primereact/checkbox';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Badge } from 'primereact/badge';
import { FormPage } from 'shared/new-components';
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
  const toast = useRef<Toast>(null);

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
        toast.current?.show({
          severity: 'error',
          summary: 'Load Error',
          detail: 'Failed to load programme information. Please refresh.',
          life: 6000,
        });
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
        setSubjects(data);
        setSelectedPssIds(data.filter(s => s.isSelected).map(s => s.pssId));
      } catch {
        toast.current?.show({
          severity: 'error',
          summary: 'Load Error',
          detail: 'Failed to load subjects for the selected semester.',
          life: 5000,
        });
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
      toast.current?.show({
        severity: 'warn',
        summary: 'No Semester',
        detail: 'Please select a semester first.',
        life: 4000,
      });
      return;
    }

    setSubmitting(true);
    try {
      await submitSubjectSelection(token, {
        email: '', // extracted from token on backend
        semesterName: selectedSemester,
        selectedPssIds,
      });
      toast.current?.show({
        severity: 'success',
        summary: 'Saved',
        detail: 'Your subject selection has been saved successfully.',
        life: 4000,
      });
      // Refresh to sync isSelected flags from DB
      await loadSubjects(selectedSemester);
    } catch (e) {
      toast.current?.show({
        severity: 'error',
        summary: 'Save Failed',
        detail:
          e instanceof Error
            ? e.message
            : 'Could not save selection. Please try again.',
        life: 6000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Group subjects by category ──────────────────────────────────────────
  const categoryGroups = subjects.reduce<Record<string, SubjectDto[]>>(
    (acc, subj) => {
      (acc[subj.categoryName] ??= []).push(subj);
      return acc;
    },
    {}
  );

  const totalSelectedCredits = subjects
    .filter(s => selectedPssIds.includes(s.pssId))
    .reduce((sum, s) => sum + s.totalCredits, 0);

  // ── Full-page spinner while bootstrapping ───────────────────────────────
  if (loadingInfo) {
    return (
      <FormPage
        title="Subject Selection"
        description="Loading your programme details…"
      >
        <div className="ss-spinner-wrap">
          <ProgressSpinner
            style={{ width: '48px', height: '48px' }}
            strokeWidth="4"
          />
          <p className="ss-spinner-label">Fetching programme information…</p>
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
      <Toast ref={toast} position="top-right" />

      {/* ── Semester selector bar ─────────────────────────── */}
      <div className="ss-top-bar">
        <div className="ss-semester-select">
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
            defaultOptionText="Select a semester"
            required={true}
          />
        </div>

        {selectedSemester && (
          <div className="ss-credit-summary">
            <span className="ss-credit-count">{totalSelectedCredits}</span>
            <span className="ss-credit-label">Credits Selected</span>
          </div>
        )}
      </div>

      {/* ── Subject list ──────────────────────────────────── */}
      {selectedSemester && (
        <div className="ss-subjects-panel">
          {/* Panel header */}
          <div className="ss-panel-header">
            <div className="ss-panel-title">
              <i className="pi pi-book" />
              <span>{selectedSemester}</span>
              {!loadingSubjects && (
                <Badge
                  value={`${subjects.length} subjects`}
                  severity="secondary"
                />
              )}
            </div>
            <Button
              label="Save Selection"
              icon="pi pi-check"
              loading={submitting}
              disabled={submitting || loadingSubjects}
              onClick={handleSubmit}
              className="p-button-sm"
            />
          </div>

          {/* Content */}
          {loadingSubjects ? (
            <div className="ss-spinner-wrap">
              <ProgressSpinner
                style={{ width: '36px', height: '36px' }}
                strokeWidth="4"
              />
              <p className="ss-spinner-label">Loading subjects…</p>
            </div>
          ) : Object.keys(categoryGroups).length === 0 ? (
            <div className="ss-empty">
              <i className="pi pi-inbox" />
              <p>No subjects found for this semester.</p>
            </div>
          ) : (
            <div className="ss-categories">
              {Object.entries(categoryGroups).map(([category, catSubjects]) => (
                <div key={category} className="ss-category">
                  <h4 className="ss-category-title">{category}</h4>
                  <div className="ss-subject-grid">
                    {catSubjects.map(subj => {
                      const isChecked = selectedPssIds.includes(subj.pssId);
                      return (
                        <div
                          key={subj.pssId}
                          className={`ss-subject-card${isChecked ? ' ss-subject-card--selected' : ''}`}
                          onClick={() => toggleSubject(subj.pssId)}
                          role="checkbox"
                          aria-checked={isChecked}
                          tabIndex={0}
                          onKeyDown={e =>
                            e.key === ' ' && toggleSubject(subj.pssId)
                          }
                        >
                          <Checkbox
                            checked={isChecked}
                            onChange={() => toggleSubject(subj.pssId)}
                            inputId={`subject-${subj.pssId}`}
                            onClick={e => e.stopPropagation()}
                          />
                          <div className="ss-subject-info">
                            <label
                              htmlFor={`subject-${subj.pssId}`}
                              className="ss-subject-name"
                              onClick={e => e.stopPropagation()}
                            >
                              {subj.subjectName}
                            </label>
                            <span className="ss-subject-code">
                              {subj.subjectCode}
                            </span>
                          </div>
                          <div className="ss-subject-credits">
                            <span className="ss-credits-value">
                              {subj.totalCredits}
                            </span>
                            <span className="ss-credits-unit">cr</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </FormPage>
  );
}
