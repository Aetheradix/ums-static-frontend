import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { FormCard, FormPage, FormPopup } from 'shared/new-components';
import { certificates } from '../../mocks';
import { tdmUrls } from '../../urls';

type PopupState = { mode: 'closed' } | { mode: 'view'; item: any };

export default function MyCertificatesPage() {
  const [data] = useState(
    certificates.filter(c => c.participantId === 'EMP-1042')
  );
  const [popup, setPopup] = useState<PopupState>({ mode: 'closed' });
  const close = () => setPopup({ mode: 'closed' });

  return (
    <FormPage
      title="My Certificates"
      description="View, download and verify your training certificates."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Trainer Development', to: tdmUrls.portal },
        { label: 'Faculty Portal', to: tdmUrls.faculty.portal },
        { label: 'Certificates' },
      ]}
    >
      <FormCard>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data.map(cert => (
            <div
              key={cert.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                borderTop: '1px solid #e5e7eb',
                paddingTop: '1.5rem',
              }}
            >
              <div
                style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}
              >
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#111827',
                      margin: '0 0 0.25rem 0',
                    }}
                  >
                    {cert.trainingTitle}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.813rem',
                      color: '#6b7280',
                      margin: 0,
                    }}
                  >
                    Certificate of {cert.type}
                  </p>
                </div>
                <i
                  className="pi pi-workspace_premium"
                  style={{ fontSize: '2rem', color: '#f59e0b' }}
                />
              </div>

              <div
                style={{
                  background: '#f9fafb',
                  padding: '0.75rem',
                  borderRadius: 8,
                  fontSize: '0.813rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span style={{ color: '#6b7280' }}>Cert No:</span>
                  <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>
                    {cert.certificateNo}
                  </span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: '#6b7280' }}>Issue Date:</span>
                  <span style={{ fontWeight: 600 }}>{cert.issueDate}</span>
                  <div style={{ flex: 1 }}></div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button
                      size="small"
                      icon="eye"
                      variant="outlined"
                      label="Preview"
                      onClick={() => setPopup({ mode: 'view', item: cert })}
                    />
                    <Button
                      size="small"
                      icon="download"
                      variant="primary"
                      label="Download PDF"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </FormCard>

      <FormPopup
        visible={popup.mode !== 'closed'}
        onHide={close}
        title="Certificate Preview"
        size="lg"
      >
        {popup.mode === 'view' && (
          <div className="flex justify-center items-center p-4 bg-gray-50 border border-gray-200 rounded-lg min-h-[400px]">
            <div className="bg-white shadow-xl w-[800px] h-[550px] border-[10px] border-indigo-900 p-12 flex flex-col items-center justify-center text-center transform scale-75 origin-center">
              <h1 className="text-4xl font-serif font-bold text-indigo-900 mb-2">
                Certificate of {popup.item.type}
              </h1>
              <div className="w-24 h-1 bg-amber-500 mb-8"></div>
              <p className="text-xl italic text-gray-600 mb-6">
                This is to certify that
              </p>
              <h2 className="text-5xl font-serif text-gray-800 mb-6 border-b-2 border-gray-200 px-12 pb-2">
                {popup.item.participantName}
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                has successfully completed the training programme
              </p>
              <h3 className="text-3xl font-semibold text-indigo-800 mb-12">
                {popup.item.trainingTitle}
              </h3>
              <div className="flex justify-between w-full mt-auto px-12 border-t pt-8 text-sm font-semibold">
                <div className="text-center">
                  <div>{popup.item.issueDate}</div>
                  <div className="border-t border-black mt-2 pt-1">Date</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-700 font-cursive italic text-xl -mt-4">
                    Authorized Signatory
                  </div>
                  <div className="border-t border-black mt-2 pt-1">
                    Authorized Signature
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </FormPopup>
    </FormPage>
  );
}
