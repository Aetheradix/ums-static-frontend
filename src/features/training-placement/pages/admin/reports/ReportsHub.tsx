import { useState } from 'react';
import {
  FormCard,
  FormPage,
  GridPanel,
  Tabs,
  ProgressBar,
} from 'shared/new-components';
import { tpUrls } from '../../../urls';
import { Button } from 'primereact/button';
import type { TabViewTabChangeEvent } from 'primereact/tabview';

export default function ReportsHub() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSeason, setSelectedSeason] = useState('All');

  // Seed data for Season Report
  const allSeasonData = [
    {
      code: 'PL2025-JUN',
      name: 'Placement Season June 2025',
      companies: 15,
      applicants: 165,
    },
    {
      code: 'INT2024-SUM',
      name: 'Summer Internship 2024',
      companies: 8,
      applicants: 45,
    },
    {
      code: 'PL2024-JUN',
      name: 'Placement Season June 2024',
      companies: 12,
      applicants: 110,
    },
  ];

  // Seed data for Company Report
  const allCompanyData = [
    {
      company: 'Infosys Technologies Ltd',
      posts: 3,
      applicants: 120,
      seasonCode: 'PL2025-JUN',
    },
    {
      company: 'Tech Mahindra',
      posts: 1,
      applicants: 45,
      seasonCode: 'INT2024-SUM',
    },
    { company: 'TCS', posts: 2, applicants: 85, seasonCode: 'PL2025-JUN' },
    { company: 'Wipro', posts: 1, applicants: 30, seasonCode: 'PL2024-JUN' },
  ];

  // Seed data for Job Report
  const allJobData = [
    {
      company: 'Infosys Technologies Ltd',
      job: 'Software Development Engineer',
      applicants: 120,
      seasonCode: 'PL2025-JUN',
    },
    {
      company: 'Tech Mahindra',
      job: 'Summer Intern - Analytics',
      applicants: 45,
      seasonCode: 'INT2024-SUM',
    },
    {
      company: 'TCS',
      job: 'System Analyst',
      applicants: 55,
      seasonCode: 'PL2025-JUN',
    },
    {
      company: 'Wipro',
      job: 'Frontend Developer',
      applicants: 30,
      seasonCode: 'PL2024-JUN',
    },
  ];

  // Seed data for OU Report
  const allOuData = [
    {
      ou: 'Computer Science & Engineering',
      applicants: 140,
      seasonCode: 'PL2025-JUN',
    },
    { ou: 'Mechanical Engineering', applicants: 45, seasonCode: 'INT2024-SUM' },
    { ou: 'Electrical Engineering', applicants: 25, seasonCode: 'PL2025-JUN' },
    { ou: 'Business Administration', applicants: 40, seasonCode: 'PL2024-JUN' },
  ];

  // Seed data for Gender Report
  const allGenderData = [
    { gender: 'Male', applicants: 100, seasonCode: 'PL2025-JUN' },
    { gender: 'Female', applicants: 60, seasonCode: 'PL2025-JUN' },
    { gender: 'Transgender', applicants: 5, seasonCode: 'PL2025-JUN' },
    { gender: 'Male', applicants: 30, seasonCode: 'INT2024-SUM' },
    { gender: 'Female', applicants: 15, seasonCode: 'INT2024-SUM' },
    { gender: 'Male', applicants: 70, seasonCode: 'PL2024-JUN' },
    { gender: 'Female', applicants: 40, seasonCode: 'PL2024-JUN' },
  ];

  // Seed data for Category Report
  const allCategoryData = [
    { category: 'General', applicants: 80, seasonCode: 'PL2025-JUN' },
    { category: 'OBC', applicants: 50, seasonCode: 'PL2025-JUN' },
    { category: 'SC', applicants: 20, seasonCode: 'PL2025-JUN' },
    { category: 'ST', applicants: 10, seasonCode: 'PL2025-JUN' },
    { category: 'EWS', applicants: 5, seasonCode: 'PL2025-JUN' },
    { category: 'General', applicants: 25, seasonCode: 'INT2024-SUM' },
    { category: 'OBC', applicants: 15, seasonCode: 'INT2024-SUM' },
    { category: 'SC', applicants: 5, seasonCode: 'INT2024-SUM' },
    { category: 'General', applicants: 60, seasonCode: 'PL2024-JUN' },
    { category: 'OBC', applicants: 35, seasonCode: 'PL2024-JUN' },
    { category: 'SC', applicants: 15, seasonCode: 'PL2024-JUN' },
  ];

  // Filtered data logic
  const seasonData =
    selectedSeason === 'All'
      ? allSeasonData
      : allSeasonData.filter(s => s.code === selectedSeason);
  const companyData =
    selectedSeason === 'All'
      ? allCompanyData
      : allCompanyData.filter(c => c.seasonCode === selectedSeason);
  const jobData =
    selectedSeason === 'All'
      ? allJobData
      : allJobData.filter(j => j.seasonCode === selectedSeason);
  const ouData =
    selectedSeason === 'All'
      ? allOuData
      : allOuData.filter(o => o.seasonCode === selectedSeason);

  // Aggregate functions for demographic data which might have multiple entries per gender/category across seasons if 'All' is selected
  const aggregateData = (data: any[], key: string) => {
    const result: any[] = [];
    data.forEach(item => {
      const existing = result.find(r => r[key] === item[key]);
      if (existing) {
        existing.applicants += item.applicants;
      } else {
        result.push({ ...item });
      }
    });
    return result;
  };

  const filteredGenderData =
    selectedSeason === 'All'
      ? allGenderData
      : allGenderData.filter(g => g.seasonCode === selectedSeason);
  const genderData = aggregateData(filteredGenderData, 'gender');

  const filteredCategoryData =
    selectedSeason === 'All'
      ? allCategoryData
      : allCategoryData.filter(c => c.seasonCode === selectedSeason);
  const categoryData = aggregateData(filteredCategoryData, 'category');

  const handleExport = () => {
    alert(`Exporting report for season: ${selectedSeason} to Excel...`);
  };

  const seasonContent = (
    <GridPanel
      data={seasonData}
      dataKey="code"
      emptyMessage="No data found for this season."
      columns={
        [
          { field: 'code', header: 'Season Code' },
          { field: 'name', header: 'Season Name' },
          { field: 'companies', header: 'Number of Companies' },
          { field: 'applicants', header: 'Number of Applicants' },
        ] as never[]
      }
    />
  );

  const companyContent = (
    <GridPanel
      data={companyData}
      dataKey="company"
      emptyMessage="No data found for this season."
      columns={
        [
          { field: 'company', header: 'Company Name' },
          { field: 'posts', header: 'Number of Posts' },
          { field: 'applicants', header: 'Number of Applicants' },
        ] as never[]
      }
    />
  );

  const jobContent = (
    <GridPanel
      data={jobData}
      dataKey="job"
      emptyMessage="No data found for this season."
      columns={
        [
          { field: 'company', header: 'Company Name' },
          { field: 'job', header: 'Job Posted' },
          { field: 'applicants', header: 'Number of Applicants' },
        ] as never[]
      }
    />
  );

  const ouContent = (
    <GridPanel
      data={ouData}
      dataKey="ou"
      emptyMessage="No data found for this season."
      columns={
        [
          { field: 'ou', header: 'Organizational Unit (Department)' },
          { field: 'applicants', header: 'Number of Applicants' },
        ] as never[]
      }
    />
  );

  const genderContent = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <GridPanel
        data={genderData}
        dataKey="gender"
        emptyMessage="No data found for this season."
        columns={
          [
            { field: 'gender', header: 'Gender' },
            { field: 'applicants', header: 'Number of Applicants' },
          ] as never[]
        }
      />
      <div className="flex flex-col justify-center bg-gray-50 p-6 rounded-lg border">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">
          Applicants Distribution (Gender)
        </h4>
        <div className="flex flex-col gap-3">
          {genderData.map((g, idx) => {
            const total = genderData.reduce(
              (acc: number, curr: any) => acc + curr.applicants,
              0
            );
            const percentage =
              total === 0 ? 0 : Math.round((g.applicants / total) * 100);
            return (
              <div key={idx}>
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                  <span>{g.gender}</span>
                  <span>
                    {g.applicants} ({percentage}%)
                  </span>
                </div>
                <ProgressBar value={percentage} colorClass="bg-blue-600" />
              </div>
            );
          })}
          {genderData.length === 0 && (
            <p className="text-sm text-gray-500">No data to display.</p>
          )}
        </div>
      </div>
    </div>
  );

  const categoryContent = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <GridPanel
        data={categoryData}
        dataKey="category"
        emptyMessage="No data found for this season."
        columns={
          [
            { field: 'category', header: 'Category' },
            { field: 'applicants', header: 'Number of Applicants' },
          ] as never[]
        }
      />
      <div className="flex flex-col justify-center bg-gray-50 p-6 rounded-lg border">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">
          Applicants Distribution (Category)
        </h4>
        <div className="flex flex-col gap-3">
          {categoryData.map((c, idx) => {
            const total = categoryData.reduce(
              (acc: number, curr: any) => acc + curr.applicants,
              0
            );
            const percentage =
              total === 0 ? 0 : Math.round((c.applicants / total) * 100);
            return (
              <div key={idx}>
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                  <span>{c.category}</span>
                  <span>
                    {c.applicants} ({percentage}%)
                  </span>
                </div>
                <ProgressBar value={percentage} colorClass="bg-indigo-600" />
              </div>
            );
          })}
          {categoryData.length === 0 && (
            <p className="text-sm text-gray-500">No data to display.</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <FormPage
      title="Reports Hub"
      description="Consolidated analytical reports on placement drives, companies, and student applicants."
      breadcrumbs={[
        { label: 'Training & Placement', to: tpUrls.root },
        { label: 'Admin Portal', to: tpUrls.admin.portal },
        { label: 'Reports' },
      ]}
      headerAction={
        <div className="flex gap-2">
          <Button
            label="Export to Excel"
            icon="pi pi-file-excel"
            className="p-button-success"
            onClick={handleExport}
          />
          <Button
            label="Print Report"
            icon="pi pi-print"
            outlined
            onClick={() => window.print()}
          />
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <FormCard title="Report Filters">
          <div className="flex flex-wrap gap-4 p-2 items-center">
            <div className="flex flex-col gap-1 w-64">
              <label className="text-xs font-medium text-gray-600">
                Select Placement Season
              </label>
              <select
                value={selectedSeason}
                onChange={e => setSelectedSeason(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="All">All Seasons</option>
                <option value="PL2025-JUN">PL2025-JUN (June 2025)</option>
                <option value="INT2024-SUM">INT2024-SUM (Summer 2024)</option>
                <option value="PL2024-JUN">PL2024-JUN (June 2024)</option>
              </select>
            </div>
          </div>
        </FormCard>

        <FormCard>
          <Tabs
            activeIndex={activeIndex}
            onTabChange={(e: TabViewTabChangeEvent) => setActiveIndex(e.index)}
            tabs={[
              { title: 'Season Report', content: seasonContent },
              { title: 'Company Report', content: companyContent },
              { title: 'Job Report', content: jobContent },
              { title: 'OU (Dept) Report', content: ouContent },
              { title: 'Gender Report', content: genderContent },
              { title: 'Category Report', content: categoryContent },
            ]}
          />
        </FormCard>
      </div>
    </FormPage>
  );
}
