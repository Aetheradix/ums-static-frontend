import { useState } from 'react';
import { FormPage, FormCard } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { TextBox } from 'shared/components/forms';
import { useHostel } from '../../context';

export default function ConfigSettings() {
  const { triggerNotification } = useHostel();

  // Mock Settings State
  const [settings, setSettings] = useState({
    gatePassAutoApproveEnabled: false,
    maxLeaveDaysPerSemester: 15,
    lateCheckInTime: '21:30',
    maintenanceSLAHours: 48,
    lowStockAlertThreshold: 10,
    enableMealScanner: true,
    allowStudentRoomChangeRequests: true,
  });

  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      triggerNotification(
        'System configurations updated successfully.',
        'success'
      );
    }, 800);
  };

  return (
    <FormPage
      title="Global Configurations"
      description="Manage application-wide settings and business rules for the hostel module."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Hostel Management', to: '/hostel-management/admin' },
        { label: 'Reports', to: '/hostel-management/reports/admin-dashboard' },
        { label: 'Configurations' },
      ]}
    >
      <div className="flex gap-4 mb-6">
        <Button
          label={saving ? 'Saving...' : 'Save Changes'}
          variant="primary"
          onClick={handleSave}
          disabled={saving}
          icon="save"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormCard title="Access & Security Rules" icon="security">
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.gatePassAutoApproveEnabled}
                onChange={e =>
                  setSettings({
                    ...settings,
                    gatePassAutoApproveEnabled: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                  Auto-Approve Short Gate Passes
                </div>
                <div className="text-xs text-slate-500">
                  Automatically approve gate passes for durations under 4 hours.
                </div>
              </div>
            </label>

            <div>
              <TextBox
                label="Late Check-in Time threshold"
                type="time"
                value={settings.lateCheckInTime}
                onChange={v => setSettings({ ...settings, lateCheckInTime: v })}
              />
              <p className="text-xs text-slate-500 mt-1">
                Students returning after this time will be marked as late.
              </p>
            </div>

            <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowStudentRoomChangeRequests}
                onChange={e =>
                  setSettings({
                    ...settings,
                    allowStudentRoomChangeRequests: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                  Allow Room Change Requests
                </div>
                <div className="text-xs text-slate-500">
                  Enable students to initiate room change workflows from their
                  portal.
                </div>
              </div>
            </label>
          </div>
        </FormCard>

        <FormCard title="Operational Rules" icon="settings_suggest">
          <div className="space-y-4">
            <div>
              <TextBox
                label="Max Leave Days (Per Semester)"
                type="number"
                value={settings.maxLeaveDaysPerSemester.toString()}
                onChange={v =>
                  setSettings({
                    ...settings,
                    maxLeaveDaysPerSemester: parseInt(v) || 0,
                  })
                }
              />
              <p className="text-xs text-slate-500 mt-1">
                Warning triggered if a student exceeds this limit.
              </p>
            </div>

            <div>
              <TextBox
                label="Maintenance SLA (Hours)"
                type="number"
                value={settings.maintenanceSLAHours.toString()}
                onChange={v =>
                  setSettings({
                    ...settings,
                    maintenanceSLAHours: parseInt(v) || 0,
                  })
                }
              />
              <p className="text-xs text-slate-500 mt-1">
                Requests pending beyond this duration are escalated.
              </p>
            </div>
          </div>
        </FormCard>

        <FormCard title="Inventory & Mess" icon="inventory">
          <div className="space-y-4">
            <div>
              <TextBox
                label="Global Low Stock Threshold (%)"
                type="number"
                value={settings.lowStockAlertThreshold.toString()}
                onChange={v =>
                  setSettings({
                    ...settings,
                    lowStockAlertThreshold: parseInt(v) || 0,
                  })
                }
              />
              <p className="text-xs text-slate-500 mt-1">
                Alert when item balance falls below this percentage of maximum
                capacity.
              </p>
            </div>

            <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableMealScanner}
                onChange={e =>
                  setSettings({
                    ...settings,
                    enableMealScanner: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                  Enable Mess Barcode Scanner Integration
                </div>
                <div className="text-xs text-slate-500">
                  Enforces ID scanning for meal attendance tracking.
                </div>
              </div>
            </label>
          </div>
        </FormCard>
      </div>
    </FormPage>
  );
}
