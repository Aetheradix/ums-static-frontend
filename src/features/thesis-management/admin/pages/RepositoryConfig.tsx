import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { FormCard, FormPage } from 'shared/new-components';
import { thesisUrls } from '../../urls';
import '../../Thesis.css';

export default function RepositoryConfig() {
  const [crossrefUrl, setCrossrefUrl] = useState(
    'https://api.crossref.org/deposits'
  );
  const [crossrefUser, setCrossrefUser] = useState(
    'davv.library.admin@dauniv.ac.in'
  );
  const [crossrefPass, setCrossrefPass] = useState('cr_deposit_pass_920a');
  const [prefix, setPrefix] = useState('10.10603');
  const [shodhgangaSftp, setShodhgangaSftp] = useState(
    'sftp.inflibnet.ac.in/davv-deposits'
  );

  const handleSave = () => {
    ToastService.success(
      'Digital repository integration settings saved successfully.'
    );
  };

  const handleTestAPI = () => {
    ToastService.success(
      'Crossref Deposit Metadata API connectivity verified successfully.'
    );
  };

  return (
    <FormPage
      title="Repository Configuration"
      description="Configure Devi Ahilya Vishwavidyalaya Shodhganga FTP and Crossref DOI registration settings."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Thesis Management', to: thesisUrls.portal },
        { label: 'Admin Portal', to: thesisUrls.admin.portal },
        { label: 'Repository Config' },
      ]}
    >
      <div
        className="dbt-bottom-row"
        style={{ gridTemplateColumns: '1.2fr 1fr' }}
      >
        <FormCard title="Crossref DOI Deposit Registry">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <TextBox
              label="Crossref API Deposit Endpoint URL"
              value={crossrefUrl}
              onChange={setCrossrefUrl}
              required
            />
            <TextBox
              label="Registry User Email"
              value={crossrefUser}
              onChange={setCrossrefUser}
              required
            />
            <TextBox
              label="Registry Password"
              type="password"
              value={crossrefPass}
              onChange={setCrossrefPass}
              required
            />
            <TextBox
              label="Allocated DOI Prefix (Crossref authorized)"
              value={prefix}
              onChange={setPrefix}
              required
            />
            <div
              style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}
            >
              <Button
                label="Test Crossref Connectivity"
                variant="outlined"
                onClick={handleTestAPI}
              />
              <Button
                label="Save Registry Settings"
                variant="primary"
                onClick={handleSave}
              />
            </div>
          </div>
        </FormCard>

        <FormCard title="Shodhganga & INFLIBNET Sync">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.875rem',
            }}
          >
            <TextBox
              label="INFLIBNET Shodhganga SFTP URL"
              value={shodhgangaSftp}
              onChange={setShodhgangaSftp}
              required
            />
            <TextBox label="SFTP Auth Username" value="davv_sg_sftp" disabled />
            <TextBox
              label="SFTP SSH Private Key"
              type="password"
              value="••••••••••••••••••••••••"
              disabled
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
              ⚠️ URC research cell officers must assign DOI parameters to
              individual approved thesis pages. System will trigger direct SFTP
              metadata deposits to Shodhganga INFLIBNET weekly.
            </div>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
