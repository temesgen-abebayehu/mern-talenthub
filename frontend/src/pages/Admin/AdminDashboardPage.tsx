// src/pages/Admin/AdminDashboardPage.tsx
import { useState, useEffect } from 'react';
import { companyAPI } from '../../services/companyService';
import { jobAPI } from '../../services/jobService';
import StatsCard from '../../components/admin/StatsCard';
import PendingApprovalList from '../../components/admin/PendingApprovalList';
import RecentActivity from '../../components/admin/RecentActivity';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    pendingApprovals: 0,
    totalJobs: 0,
    activeJobs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [companiesRes, jobsRes] = await Promise.all([
        companyAPI.getAllCompanies(),
        jobAPI.getAll() // Get all jobs for counting
      ]);

      const pendingCompanies = companiesRes.data.filter((company: any) => company.status === 'pending');

      setStats({
        totalCompanies: companiesRes.data.length,
        pendingApprovals: pendingCompanies.length,
        totalJobs: jobsRes.data.jobs.length,
        activeJobs: jobsRes.data.jobs.filter((job: any) => job.status === 'active').length
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Companies"
          value={stats.totalCompanies}
          icon="🏢"
        />
        <StatsCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon="⏳"
        />
        <StatsCard
          title="Total Jobs"
          value={stats.totalJobs}
          icon="💼"
        />
        <StatsCard
          title="Active Jobs"
          value={stats.activeJobs}
          icon="✅"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Approvals */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Pending Company Approvals</h2>
          <PendingApprovalList />
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;