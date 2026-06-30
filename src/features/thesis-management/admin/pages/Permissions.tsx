import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage } from 'shared/new-components';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

interface RolePermission {
  role: string;
  read: boolean;
  create: boolean;
  edit: boolean;
  endorse: boolean;
  publish: boolean;
  audit: boolean;
  config: boolean;
}

const initialPermissions: RolePermission[] = [
  {
    role: 'Research Scholar',
    read: true,
    create: true,
    edit: true,
    endorse: false,
    publish: false,
    audit: false,
    config: false,
  },
  {
    role: 'Research Supervisor',
    read: true,
    create: false,
    edit: true,
    endorse: true,
    publish: false,
    audit: false,
    config: false,
  },
  {
    role: 'Head of Department',
    read: true,
    create: false,
    edit: false,
    endorse: true,
    publish: false,
    audit: false,
    config: false,
  },
  {
    role: 'Research Cell Officer',
    read: true,
    create: true,
    edit: true,
    endorse: true,
    publish: true,
    audit: true,
    config: false,
  },
  {
    role: 'System Administrator',
    read: true,
    create: true,
    edit: true,
    endorse: true,
    publish: true,
    audit: true,
    config: true,
  },
];

export default function Permissions() {
  const [matrix, setMatrix] = useState<RolePermission[]>(initialPermissions);

  const togglePermission = (
    roleIndex: number,
    field: keyof Omit<RolePermission, 'role'>
  ) => {
    setMatrix(prev =>
      prev.map((row, i) =>
        i === roleIndex ? { ...row, [field]: !row[field] } : row
      )
    );
  };

  const handleSave = () => {
    ToastService.success(
      'Role access permission matrices updated successfully.'
    );
  };

  return (
    <FormPage
      title="Permissions Control"
      description="Manage and configure role-based access rights mapping for research system operations."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Admin Portal', to: thesisUrls.admin.portal },
        { label: 'Permissions' },
      ]}
    >
      <FormCard title="Role Access Mappings">
        <div style={{ overflowX: 'auto' }}>
          <table className="dbt-table">
            <thead>
              <tr>
                <th>System Role</th>
                <th style={{ textAlign: 'center' }}>Read</th>
                <th style={{ textAlign: 'center' }}>Create</th>
                <th style={{ textAlign: 'center' }}>Edit / Revise</th>
                <th style={{ textAlign: 'center' }}>Endorse / Recommend</th>
                <th style={{ textAlign: 'center' }}>Publish / Assign DOI</th>
                <th style={{ textAlign: 'center' }}>View Audits</th>
                <th style={{ textAlign: 'center' }}>Configure Masters</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, idx) => (
                <tr key={row.role}>
                  <td style={{ fontWeight: 800 }}>{row.role}</td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={row.read}
                      onChange={() => togglePermission(idx, 'read')}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={row.create}
                      onChange={() => togglePermission(idx, 'create')}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={row.edit}
                      onChange={() => togglePermission(idx, 'edit')}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={row.endorse}
                      onChange={() => togglePermission(idx, 'endorse')}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={row.publish}
                      onChange={() => togglePermission(idx, 'publish')}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={row.audit}
                      onChange={() => togglePermission(idx, 'audit')}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={row.config}
                      onChange={() => togglePermission(idx, 'config')}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          style={{
            marginTop: '1.25rem',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            label="Save Authorization Rules"
            variant="primary"
            onClick={handleSave}
          />
        </div>
      </FormCard>
    </FormPage>
  );
}
