import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormPage, FormCard, FormPopup } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { cfsUrls } from '../../urls';
import { mockCategories, mockSubCategories, mockContent } from '../../mockdata';
import type {
  ContentItem,
  ContentType,
  ContentPriority,
  ContentVisibility,
} from '../../types';
import { ToastService } from 'services';

export default function ContentForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const existingItem = isEdit
    ? mockContent.find(c => c.id === Number(id))
    : undefined;

  const [formData, setFormData] = useState<Partial<ContentItem>>(
    existingItem || {
      title: '',
      publishingCategoryId: mockCategories[0].id,
      subCategoryId: mockSubCategories[0].id,
      organizationalUnitId: 10, // Default for mock
      contentType: 'Notice' as ContentType,
      description: '',
      visibility: 'Public' as ContentVisibility,
      priority: 'Normal' as ContentPriority,
      startDate: new Date().toISOString().split('T')[0],
      tags: [],
      attachments: [],
      remarks: '',
    }
  );

  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockOUs = [
    { id: 10, name: 'Admission Branch' },
    { id: 12, name: 'Examination Wing' },
    { id: 15, name: 'Hostel Administration Office' },
    { id: 2, name: 'Vice Chancellor Office' },
  ];

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const currentTags = formData.tags || [];
      if (!currentTags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...currentTags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter(t => t !== tag),
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
        type: f.name.split('.').pop()?.toUpperCase() || 'FILE',
      }));

      const currentAttachments = formData.attachments || [];
      if (currentAttachments.length + newFiles.length > 5) {
        ToastService.error('Maximum 5 attachments allowed.');
        return;
      }

      setFormData({
        ...formData,
        attachments: [...currentAttachments, ...newFiles],
      });
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    const newAttachments = [...(formData.attachments || [])];
    newAttachments.splice(index, 1);
    setFormData({ ...formData, attachments: newAttachments });
  };

  const handleSaveDraft = () => {
    ToastService.success('Draft saved successfully.');
    navigate(cfsUrls.ouAdmin.myContent);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.description?.trim()) {
      ToastService.error('Please fill in all mandatory fields.');
      return;
    }
    ToastService.success(
      isEdit
        ? 'Content updated and resubmitted.'
        : 'Content submitted for review.'
    );
    navigate(cfsUrls.ouAdmin.myContent);
  };

  return (
    <FormPage
      title={isEdit ? 'Edit Content' : 'Add Content'}
      description="Create or modify a federation content post for workflow approval."
      breadcrumbs={[
        { label: 'CFS', to: cfsUrls.root },
        { label: 'My Content', to: cfsUrls.ouAdmin.myContent },
        { label: isEdit ? 'Edit' : 'Add' },
      ]}
      headerAction={
        <Button
          label="Preview"
          icon="pi pi-eye"
          variant="outlined"
          onClick={() => setShowPreview(true)}
        />
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Section 1: Classification */}
        <FormCard title="1. Classification & Basic Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter content title"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Organizational Unit *
              </label>
              <select
                value={formData.organizationalUnitId}
                onChange={e =>
                  setFormData({
                    ...formData,
                    organizationalUnitId: Number(e.target.value),
                  })
                }
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled // Auto-filled for OU Admin conceptually
              >
                {mockOUs.map(ou => (
                  <option key={ou.id} value={ou.id}>
                    {ou.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Visibility *
              </label>
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={formData.visibility === 'Public'}
                    onChange={() =>
                      setFormData({ ...formData, visibility: 'Public' })
                    }
                    className="text-blue-600"
                  />
                  <span className="text-sm">Public</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={formData.visibility === 'Internal'}
                    onChange={() =>
                      setFormData({ ...formData, visibility: 'Internal' })
                    }
                    className="text-blue-600"
                  />
                  <span className="text-sm">Internal (Login Required)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={formData.visibility === 'Restricted'}
                    onChange={() =>
                      setFormData({ ...formData, visibility: 'Restricted' })
                    }
                    className="text-blue-600"
                  />
                  <span className="text-sm">Restricted</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Publishing Category *
              </label>
              <select
                value={formData.publishingCategoryId}
                onChange={e =>
                  setFormData({
                    ...formData,
                    publishingCategoryId: Number(e.target.value),
                  })
                }
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {mockCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Sub-Category
              </label>
              <select
                value={formData.subCategoryId}
                onChange={e =>
                  setFormData({
                    ...formData,
                    subCategoryId: Number(e.target.value),
                  })
                }
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">None</option>
                {mockSubCategories
                  .filter(sub => sub.parentId === formData.publishingCategoryId)
                  .map(sub => (
                    <option key={sub.id} value={sub.id}>
                      {sub.title}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Content Type *
              </label>
              <select
                value={formData.contentType}
                onChange={e =>
                  setFormData({
                    ...formData,
                    contentType: e.target.value as ContentType,
                  })
                }
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Notice">Notice</option>
                <option value="Circular">Circular</option>
                <option value="News">News</option>
                <option value="Event">Event</option>
                <option value="Announcement">Announcement</option>
                <option value="Policy">Policy</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={e =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as ContentPriority,
                  })
                }
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Tags (Press Enter to add)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type and press Enter (Max 10 tags)"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {(formData.tags || []).map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </FormCard>

        {/* Section 2: Editor */}
        <FormCard title="2. Content Editor">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Description (Rich Text Supported) *
            </label>

            {/* Mock Rich Text Toolbar */}
            <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex gap-2 border-b-0">
              <button
                type="button"
                className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                title="Bold"
              >
                <i className="pi pi-bold"></i>
              </button>
              <button
                type="button"
                className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                title="Italic"
              >
                <i className="pi pi-italic"></i>
              </button>
              <button
                type="button"
                className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                title="Underline"
              >
                <i className="pi pi-underline"></i>
              </button>
              <div className="w-px bg-gray-300 mx-1 h-6 self-center"></div>
              <button
                type="button"
                className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                title="Align Left"
              >
                <i className="pi pi-align-left"></i>
              </button>
              <button
                type="button"
                className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                title="Align Center"
              >
                <i className="pi pi-align-center"></i>
              </button>
              <div className="w-px bg-gray-300 mx-1 h-6 self-center"></div>
              <button
                type="button"
                className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                title="List"
              >
                <i className="pi pi-list"></i>
              </button>
              <button
                type="button"
                className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                title="Link"
              >
                <i className="pi pi-link"></i>
              </button>
            </div>
            <textarea
              required
              rows={12}
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter description HTML/Markdown body..."
              className="w-full p-4 border border-gray-300 rounded-b-lg focus:ring-0 focus:outline-none focus:border-blue-500 font-mono text-sm resize-y"
            />
          </div>
        </FormCard>

        {/* Section 3: Date Configuration */}
        <FormCard title="3. Date Configuration">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Effective Date
              </label>
              <input
                type="date"
                value={formData.effectiveDate || ''}
                onChange={e =>
                  setFormData({ ...formData, effectiveDate: e.target.value })
                }
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={e =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate || ''}
                onChange={e =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Expiry Date
              </label>
              <input
                type="date"
                value={formData.expiryDate || ''}
                onChange={e =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500">
                Auto-archives content after this date.
              </span>
            </div>
          </div>
        </FormCard>

        {/* Section 4: Attachments */}
        <FormCard title="4. Attachments">
          <div className="flex flex-col gap-4">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <i className="pi pi-cloud-upload text-3xl text-gray-400 mb-2"></i>
              <p className="text-gray-700 font-medium">
                Click to upload or drag and drop files here
              </p>
              <p className="text-gray-500 text-sm mt-1">
                PDF, DOC, DOCX, PNG, JPG (Max 5 files, 10MB each)
              </p>
              <input
                type="file"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
              />
            </div>

            {formData.attachments && formData.attachments.length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                <h4 className="text-sm font-semibold text-gray-700">
                  Uploaded Files ({formData.attachments.length}/5)
                </h4>
                {formData.attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <i className="pi pi-file text-blue-500 text-xl" />
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {file.size} • {file.type}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                    >
                      <i className="pi pi-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FormCard>

        {/* Section 5: Additional Configuration */}
        <FormCard title="5. Additional Configuration">
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Remarks (Internal Notes for Reviewers)
            </label>
            <textarea
              rows={3}
              value={formData.remarks || ''}
              onChange={e =>
                setFormData({ ...formData, remarks: e.target.value })
              }
              placeholder="Add any specific context or instructions for the reviewing committee..."
              className="w-full mt-2 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </FormCard>

        <div className="flex justify-end gap-3 mt-4 mb-8">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => navigate(cfsUrls.ouAdmin.myContent)}
          />
          <Button
            label="Save as Draft"
            variant="outlined"
            onClick={handleSaveDraft}
          />
          <Button
            label={isEdit ? 'Update & Resubmit' : 'Submit for Review'}
            variant="primary"
            type="submit"
          />
        </div>
      </form>

      {/* Preview Modal */}
      <FormPopup
        visible={showPreview}
        onHide={() => setShowPreview(false)}
        title="Content Preview"
        size="lg"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {formData.title || 'Untitled Content'}
          </h2>
          <div
            className="prose max-w-none text-gray-700 bg-gray-50 p-6 rounded-lg border border-gray-150"
            dangerouslySetInnerHTML={{
              __html:
                formData.description ||
                '<p class="text-gray-400 italic">No description provided...</p>',
            }}
          />
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <Button
            label="Close Preview"
            variant="outlined"
            onClick={() => setShowPreview(false)}
          />
        </div>
      </FormPopup>
    </FormPage>
  );
}
