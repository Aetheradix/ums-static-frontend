import { useState } from 'react';
import { Button } from 'shared/components/buttons';
import { NumberBox } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { mockSystemConfig } from '../../data';
import { InfoBanner } from '../../components';

export default function SystemConfig() {
  const [config, setConfig] = useState({ ...mockSystemConfig });
  const [saved, setSaved] = useState(false);

  const save = () => {
    Object.assign(mockSystemConfig, config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <FormPage title="System Configuration" description="Global system settings">
      <InfoBanner
        title="About System Configuration"
        message="Adjust global settings for the examination platform, including default pass percentages, file size limits, and automated proctoring sensitivities."
      />
      <FormCard title="Exam Defaults">
        <FormGrid>
          <NumberBox
            label="Default Pass %"
            value={config.defaultPassPct}
            onChange={v => setConfig({ ...config, defaultPassPct: v ?? 0 })}
            min={1}
            max={100}
          />
          <NumberBox
            label="Minimum Attendance %"
            value={config.minAttendancePct}
            onChange={v => setConfig({ ...config, minAttendancePct: v ?? 0 })}
            min={0}
            max={100}
          />
          <NumberBox
            label="Max Backlogs Allowed"
            value={config.maxBacklogs}
            onChange={v => setConfig({ ...config, maxBacklogs: v ?? 0 })}
            min={0}
            max={20}
          />
        </FormGrid>
      </FormCard>
      <FormCard title="Submission Settings">
        <FormGrid>
          <NumberBox
            label="Max File Size (MB)"
            value={config.maxFileSizeMB}
            onChange={v => setConfig({ ...config, maxFileSizeMB: v ?? 0 })}
            min={1}
            max={100}
          />
          <NumberBox
            label="Auto-Save Interval (sec)"
            value={config.autoSaveIntervalSec}
            onChange={v =>
              setConfig({ ...config, autoSaveIntervalSec: v ?? 0 })
            }
            min={5}
            max={300}
          />
          <NumberBox
            label="Tab Switch Limit"
            value={config.tabSwitchLimit}
            onChange={v => setConfig({ ...config, tabSwitchLimit: v ?? 0 })}
            min={0}
            max={10}
          />
          <NumberBox
            label="Revaluation Window (days)"
            value={config.revaluationWindowDays}
            onChange={v =>
              setConfig({ ...config, revaluationWindowDays: v ?? 0 })
            }
            min={1}
            max={60}
          />
          <NumberBox
            label="Grace Period (min)"
            value={config.gracePeriodMinutes}
            onChange={v => setConfig({ ...config, gracePeriodMinutes: v ?? 0 })}
            min={0}
            max={30}
          />
        </FormGrid>
      </FormCard>
      <div className="flex justify-end mt-4">
        <Button
          label={saved ? 'Saved ✓' : 'Save Configuration'}
          icon={saved ? 'check' : 'save'}
          onClick={save}
          disabled={saved}
        />
      </div>
    </FormPage>
  );
}
