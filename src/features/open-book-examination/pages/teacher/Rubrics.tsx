import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { NumberBox, TextBox } from 'shared/components/forms';
import { FormPage, FormPopup, GridPanel } from 'shared/new-components';
import type { RubricCriterion } from '../../data';
import { mockQuestions, mockRubrics } from '../../data';
import { InfoBanner } from '../../components';

export default function Rubrics() {
  const [data, setData] = useState(mockRubrics);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '',
    questionId: mockQuestions[0]?.id || 1,
    criteria: [] as RubricCriterion[],
  });

  const openCreate = () => {
    setEditId(null);
    setForm({ name: '', questionId: mockQuestions[0]?.id || 1, criteria: [] });
    setShowForm(true);
  };

  const openEdit = (r: (typeof data)[0]) => {
    setEditId(r.id);
    setForm({
      name: r.name,
      questionId: r.questionId,
      criteria: [...r.criteria],
    });
    setShowForm(true);
  };

  const addCriterion = () => {
    setForm({
      ...form,
      criteria: [...form.criteria, { name: '', description: '', maxMarks: 5 }],
    });
  };

  const updateCriterion = (
    idx: number,
    field: keyof RubricCriterion,
    value: string | number
  ) => {
    const updated = [...form.criteria];
    (updated[idx] as any)[field] = value;
    setForm({ ...form, criteria: updated });
  };

  const removeCriterion = (idx: number) => {
    setForm({ ...form, criteria: form.criteria.filter((_, i) => i !== idx) });
  };

  const handleSave = () => {
    const total = form.criteria.reduce((s, c) => s + c.maxMarks, 0);
    if (editId) {
      const existing = data.find(r => r.id === editId);
      if (existing) {
        existing.name = form.name;
        existing.questionId = form.questionId;
        existing.criteria = form.criteria;
        existing.totalMarks = total;
      }
    } else {
      data.push({
        id: Math.max(...data.map(r => r.id)) + 1,
        name: form.name,
        questionId: form.questionId,
        criteria: form.criteria,
        totalMarks: total,
      });
    }
    setData([...data]);
    setShowForm(false);
  };

  return (
    <FormPage
      title="Rubrics Management"
      description="Define evaluation rubrics for questions"
    >
      <InfoBanner
        title="About Rubrics"
        message="Define detailed grading rubrics for subjective questions to ensure consistent, fair, and transparent evaluations."
      />
      <GridPanel
        data={data}
        columns={[
          { field: 'name', header: 'Name' },
          {
            field: 'questionId',
            header: 'Question',
            cell: row => {
              const q = mockQuestions.find(q => q.id === row.questionId);
              return (
                <span className="text-xs max-w-xs truncate block">
                  {q?.questionText}
                </span>
              );
            },
          },
          {
            field: 'criteria',
            header: 'Criteria',
            cell: row => (
              <span className="text-xs">{row.criteria.length} criteria</span>
            ),
          },
          { field: 'totalMarks', header: 'Total Marks' },
          {
            field: 'id',
            header: 'Actions',
            cell: row => (
              <Button
                icon="pencil"
                variant="text"
                onClick={() => openEdit(row)}
              />
            ),
          },
        ]}
        dataKey="id"
        pagination={{ rows: 10 }}
        searchBox
        toolbar={
          <Button label="Create Rubric" icon="add" onClick={openCreate} />
        }
      />
      {showForm && (
        <FormPopup
          visible
          onHide={() => setShowForm(false)}
          title={editId ? 'Edit Rubric' : 'Create Rubric'}
          size="lg"
        >
          <div className="space-y-4">
            <TextBox
              label="Rubric Name"
              value={form.name}
              onChange={v => setForm({ ...form, name: v })}
            />
            <div>
              <label className="block text-sm font-medium mb-1">
                Linked Question
              </label>
              <select
                className="w-full border rounded px-2 py-1.5 text-sm"
                value={form.questionId}
                onChange={e =>
                  setForm({ ...form, questionId: Number(e.target.value) })
                }
              >
                {mockQuestions.map(q => (
                  <option key={q.id} value={q.id}>
                    {q.questionText.substring(0, 60)}...
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Criteria</label>
                <Button
                  label="Add Criterion"
                  icon="add"
                  variant="outlined"
                  onClick={addCriterion}
                />
              </div>
              {form.criteria.map((c, i) => (
                <div key={i} className="border rounded p-3 mb-2">
                  <div className="flex justify-between mb-2">
                    <TextBox
                      value={c.name}
                      onChange={v => updateCriterion(i, 'name', v)}
                      placeholder="Criterion name"
                    />
                    <Button
                      icon="trash"
                      variant="text"
                      onClick={() => removeCriterion(i)}
                    />
                  </div>
                  <TextBox
                    value={c.description}
                    onChange={v => updateCriterion(i, 'description', v)}
                    placeholder="Description"
                  />
                  <NumberBox
                    label="Max Marks"
                    value={c.maxMarks}
                    onChange={v => updateCriterion(i, 'maxMarks', v ?? 0)}
                    min={1}
                    className="mt-2"
                  />
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-500">
              Total Marks: {form.criteria.reduce((s, c) => s + c.maxMarks, 0)}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                label="Cancel"
                variant="outlined"
                onClick={() => setShowForm(false)}
              />
              <Button label="Save Rubric" icon="save" onClick={handleSave} />
            </div>
          </div>
        </FormPopup>
      )}
    </FormPage>
  );
}
