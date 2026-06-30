import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage, StatCard } from 'shared/new-components';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

export default function CellRepository() {
  return (
    <FormPage
      title="Repository Publishing"
      description="Publish approved thesis to Shodhganga / INFLIBNET and register Crossref DOI."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Research Cell', to: thesisUrls.cell.portal },
        { label: 'Repository' },
      ]}
    >
      <div className="dbt-stats-grid">
        <StatCard
          title="Total Published"
          value="0"
          icon="library_books"
          colorScheme="blue"
          subtitle="Shodhganga / INFLIBNET"
        />
        <StatCard
          title="DOIs Assigned"
          value="0"
          icon="link"
          colorScheme="green"
          subtitle="Crossref registered"
        />
        <StatCard
          title="Pending Upload"
          value="1"
          icon="upload"
          colorScheme="orange"
          subtitle="Awaiting DOI"
        />
        <StatCard
          title="Last API Status"
          value="⚠️ Timeout"
          icon="api"
          colorScheme="red"
          subtitle="Crossref API"
        />
      </div>

      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.2fr 1fr' }}
      >
        <FormCard title="Thesis Repository Queue">
          <div style={{ overflowX: 'auto' }}>
            <table className="dbt-table">
              <thead>
                <tr>
                  <th>Scholar</th>
                  <th>Thesis Title</th>
                  <th>Verdict</th>
                  <th>Repository</th>
                  <th>DOI</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 700 }}>Sunita Chouhan</td>
                  <td style={{ fontSize: '0.75rem', maxWidth: 200 }}>
                    Smart Healthcare IoT Architecture with Adaptive Edge
                    Intelligence
                  </td>
                  <td>
                    <span className="dbt-status-pill approved">Awarded</span>
                  </td>
                  <td>
                    <span className="dbt-status-pill draft">
                      Pending Upload
                    </span>
                  </td>
                  <td>
                    <span className="dbt-status-pill draft">Not Assigned</span>
                  </td>
                  <td>
                    <div
                      style={{
                        display: 'flex',
                        gap: 4,
                        flexDirection: 'column',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          ToastService.success(
                            'Uploading to Shodhganga / INFLIBNET...'
                          )
                        }
                        style={{
                          padding: '0.2rem 0.5rem',
                          border: '1px solid #22c55e',
                          background: '#f0fdf4',
                          color: '#16a34a',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: '0.688rem',
                          fontWeight: 600,
                        }}
                      >
                        Upload to Shodhganga
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          ToastService.success(
                            'DOI registration request sent to Crossref...'
                          )
                        }
                        style={{
                          padding: '0.2rem 0.5rem',
                          border: '1px solid #6366f1',
                          background: '#f5f3ff',
                          color: '#4f46e5',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: '0.688rem',
                          fontWeight: 600,
                        }}
                      >
                        Register DOI
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </FormCard>

        <FormCard title="Manual DOI Registration">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <TextBox label="Scholar Name" placeholder="Sunita Chouhan" />
            <TextBox
              label="Thesis Handle URL (Shodhganga)"
              placeholder="http://hdl.handle.net/10603/..."
            />
            <TextBox label="DOI Prefix" placeholder="10.1109/DAVV" />
            <TextBox
              label="DOI Suffix (auto or manual)"
              placeholder="2026.xxxxxx"
            />
            <div
              style={{
                padding: '0.75rem',
                background: '#fffbeb',
                borderRadius: 6,
                border: '1px solid #fde68a',
                fontSize: '0.688rem',
                color: '#92400e',
              }}
            >
              ⚠️ Last Crossref API call failed (Timeout). Retry or register
              manually via Crossref dashboard.
            </div>
            <Button
              label="Register DOI via Crossref API"
              variant="primary"
              onClick={() =>
                ToastService.success('DOI registration attempt initiated...')
              }
            />
            <Button
              label="Mark as Manually Registered"
              variant="outlined"
              onClick={() =>
                ToastService.success(
                  'Marked as manually registered. DOI saved.'
                )
              }
            />
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
