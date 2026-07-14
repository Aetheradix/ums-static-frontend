import { useState } from 'react';
import { ToastService } from 'services';
import { Button } from 'shared/components/buttons';
import { TextBox, DropDownList } from 'shared/components/forms';
import { FormCard, FormGrid, FormPage } from 'shared/new-components';
import { grvUrls } from '../../urls';
import '../../Grievance.css';

export default function UserRoleManagement() {
  const [activeTab, setActiveTab] = useState('create');

  // Form states
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('Department Officer');
  const [selectedDept, setSelectedDept] = useState(
    'School of Computer Science & IT (SCSIT)'
  );

  const [mapUser, setMapUser] = useState('Dr. Rakesh Verma');
  const [mapRole, setMapRole] = useState('Department Officer');
  const [mapDept, setMapDept] = useState(
    'School of Computer Science & IT (SCSIT)'
  );

  const [resetUser, setResetUser] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const rolesList = [
    { name: 'Student', value: 'Student' },
    { name: 'Teacher', value: 'Teacher' },
    { name: 'Department Officer', value: 'Department Officer' },
    { name: 'Head of Department (HoD)', value: 'HoD' },
    { name: 'Grievance Cell Officer', value: 'Grievance Cell' },
    { name: 'Registrar', value: 'Registrar' },
    { name: 'Admin', value: 'Admin' },
  ];

  const deptList = [
    {
      name: 'School of Computer Science & IT (SCSIT)',
      value: 'School of Computer Science & IT (SCSIT)',
    },
    { name: 'School of Commerce', value: 'School of Commerce' },
    { name: 'School of Law', value: 'School of Law' },
    {
      name: 'Finance & Accounts Division',
      value: 'Finance & Accounts Division',
    },
    { name: 'Estate & Warden Section', value: 'Estate & Warden Section' },
    { name: 'Administration Office', value: 'Administration Office' },
  ];

  const usersList = [
    {
      id: 'U001',
      username: 'rverma',
      fullname: 'Dr. Rakesh Verma',
      email: 'rverma@davv.edu',
      role: 'Department Officer',
      dept: 'SCSIT',
    },
    {
      id: 'U002',
      username: 'agupta',
      fullname: 'Prof. Alok Gupta',
      email: 'agupta@davv.edu',
      role: 'HoD',
      dept: 'SCSIT',
    },
    {
      id: 'U003',
      username: 'sgupta',
      fullname: 'CA Sunil Gupta',
      email: 'sgupta@davv.edu',
      role: 'Department Officer',
      dept: 'Finance',
    },
    {
      id: 'U004',
      username: 'akumar',
      fullname: 'Dr. Anil Kumar',
      email: 'akumar@davv.edu',
      role: 'Registrar',
      dept: 'Registrar Office',
    },
  ];

  const handleCreateUser = () => {
    if (!username || !fullname || !email) {
      ToastService.error('Please fill username, full name and email address.');
      return;
    }
    ToastService.success(
      `User Account for ${fullname} created successfully. Welcome kit sent to email.`
    );
    setUsername('');
    setFullname('');
    setEmail('');
  };

  const handleMapRole = () => {
    ToastService.success(
      `Role mapped: ${mapUser} set to ${mapRole} under ${mapDept}.`
    );
  };

  const handleResetPassword = () => {
    if (!resetUser || !newPassword) {
      ToastService.error('Please enter username and new password.');
      return;
    }
    ToastService.success(`Password for user ${resetUser} reset successfully.`);
    setResetUser('');
    setNewPassword('');
  };

  return (
    <FormPage
      title="User & Role Mapping Console"
      description="DAVV Indore — Establish login accounts, map eOffice roles, and link departments."
      breadcrumbs={[
        { label: 'Home', to: '/home' },
        { label: 'Grievance Management', to: grvUrls.portal },
        { label: 'Admin Portal', to: grvUrls.admin.portal },
        { label: 'User Role Management' },
      ]}
    >
      <div className="flex gap-2 border-b border-slate-200 mb-4 bg-white p-2 rounded-t-lg">
        {[
          { label: 'Create User', key: 'create', icon: 'pi-user-plus' },
          {
            label: 'Role & Dept Mapping',
            key: 'mapping',
            icon: 'pi-sliders-h',
          },
          { label: 'Reset Password', key: 'reset', icon: 'pi-key' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === tab.key
                ? 'bg-red-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <i className={`pi ${tab.icon} text-[10px]`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'create' && (
        <div className="space-y-4">
          <FormCard title="Register New ERP User">
            <FormGrid columns={3}>
              <TextBox
                label="System Username / LDAP ID *"
                placeholder="e.g. rverma"
                value={username}
                onChange={setUsername}
              />
              <TextBox
                label="Complainant / Officer Full Name *"
                placeholder="e.g. Dr. Rakesh Verma"
                value={fullname}
                onChange={setFullname}
              />
              <TextBox
                label="University Email *"
                placeholder="e.g. rverma@davv.edu"
                value={email}
                onChange={setEmail}
              />
              <DropDownList
                label="Default Role Assignment"
                data={rolesList}
                textField="name"
                optionValue="value"
                value={selectedRole}
                onChange={val => setSelectedRole(val as string)}
              />
              <DropDownList
                label="Default Department"
                data={deptList}
                textField="name"
                optionValue="value"
                value={selectedDept}
                onChange={val => setSelectedDept(val as string)}
              />
              <div className="flex items-end">
                <Button
                  label="Create Account"
                  variant="primary"
                  onClick={handleCreateUser}
                />
              </div>
            </FormGrid>
          </FormCard>

          <FormCard title="Registered University Officers Summary">
            <table className="grv-table w-full text-xs">
              <thead>
                <tr>
                  <th className="w-24">User ID</th>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Assigned Role</th>
                  <th>Department Section</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map(u => (
                  <tr key={u.id}>
                    <td className="font-mono font-bold">{u.id}</td>
                    <td className="font-mono text-blue-600">{u.username}</td>
                    <td className="font-bold text-slate-700">{u.fullname}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="grv-status-pill assigned">{u.role}</span>
                    </td>
                    <td className="font-bold text-slate-600">{u.dept}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </FormCard>
        </div>
      )}

      {activeTab === 'mapping' && (
        <FormCard title="Role and Department Desk Mapping">
          <FormGrid columns={3}>
            <DropDownList
              label="Select User Account"
              data={usersList.map(u => ({
                name: u.fullname,
                value: u.fullname,
              }))}
              textField="name"
              optionValue="value"
              value={mapUser}
              onChange={val => setMapUser(val as string)}
            />
            <DropDownList
              label="Set Role Mapping"
              data={rolesList}
              textField="name"
              optionValue="value"
              value={mapRole}
              onChange={val => setMapRole(val as string)}
            />
            <DropDownList
              label="Bind Department Section"
              data={deptList}
              textField="name"
              optionValue="value"
              value={mapDept}
              onChange={val => setMapDept(val as string)}
            />
          </FormGrid>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              label="Save Mapping Rule"
              variant="primary"
              onClick={handleMapRole}
            />
          </div>
        </FormCard>
      )}

      {activeTab === 'reset' && (
        <FormCard title="Security Credentials Reset Desk">
          <p className="text-xs text-slate-500 mb-4">
            Perform administrative password overrides. Restoring passwords
            generates a temp key sent to registered mobile.
          </p>
          <FormGrid columns={3}>
            <TextBox
              label="System Username / Email *"
              placeholder="e.g. rverma"
              value={resetUser}
              onChange={setResetUser}
            />
            <TextBox
              label="Override Password *"
              placeholder="Set secure password"
              value={newPassword}
              onChange={setNewPassword}
            />
            <div className="flex items-end">
              <Button
                label="Reset Credentials"
                variant="danger"
                onClick={handleResetPassword}
              />
            </div>
          </FormGrid>
        </FormCard>
      )}
    </FormPage>
  );
}
