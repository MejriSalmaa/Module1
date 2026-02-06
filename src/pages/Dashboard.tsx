import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { MetricCard } from '@/components/MetricCard';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { ScoreCard } from '@/components/ScoreCard';
import { InsightCard } from '@/components/InsightCard';
import { MatchingChart } from '@/components/MatchingChart';
import { ActivityFeed, CheckCircle2, AlertCircle, UserPlus, FileText as FileTextIcon, Calendar as CalendarIcon } from '@/components/ActivityFeed';
import { QuickStats } from '@/components/QuickStats';
import { getDashboardStats, mockJobOffers, mockTalentRequests, mockApplications, mockAssessments } from '@/data/mockData';
import { Briefcase, Users, Calendar, Target, Clock, CheckCircle, FileText, TrendingUp, Zap, Award, Brain, Sparkles, Send, UserCheck, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function ClientDashboard() {
  const stats = getDashboardStats('client');
  const recentJobs = mockJobOffers.filter(j => j.clientId === 'client-1').slice(0, 3);

  const aiInsights = [
    {
      title: 'High Match Rate',
      insight: '3 pre-qualified talents match your Backend Engineer role at 92%+ accuracy. Review shortlist now to accelerate hiring.',
      type: 'success' as const,
      icon: Brain,
      action: { label: 'View Matches', onClick: () => {} }
    },
    {
      title: 'Budget Optimization',
      insight: 'Your DevOps budget is 15% above market rate. Consider adjusting to €700-850/day for better talent pool access.',
      type: 'info' as const,
      icon: TrendingUp,
      action: { label: 'Adjust Budget', onClick: () => {} }
    },
    {
      title: 'Urgent Action Required',
      insight: 'Frontend Developer job expires in 3 days. 5 qualified candidates are waiting for validation.',
      type: 'urgent' as const,
      icon: Zap,
      action: { label: 'Validate Now', onClick: () => {} }
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'success' as const,
      icon: CheckCircle2,
      title: 'Application Received',
      description: 'Alex Rivera applied to Senior Frontend Developer',
      time: '2 minutes ago',
      badge: 'Match 94%'
    },
    {
      id: '2',
      type: 'info' as const,
      icon: UserPlus,
      title: 'Talent Shortlist Ready',
      description: '3 developers matched for Backend Engineer role',
      time: '1 hour ago',
      badge: 'New'
    },
    {
      id: '3',
      type: 'pending' as const,
      icon: CalendarIcon,
      title: 'Interview Scheduled',
      description: 'Maria Santos - Feb 8, 2026 at 10:00 AM',
      time: '3 hours ago'
    },
    {
      id: '4',
      type: 'info' as const,
      icon: FileTextIcon,
      title: 'Assessment Completed',
      description: 'James Wilson completed DevOps technical test',
      time: '5 hours ago',
      badge: 'Score: 91/100'
    },
  ];

  const matchingData = [
    {
      label: 'Active Jobs Filled',
      value: 8,
      maxValue: 12,
      trend: { direction: 'up' as const, percentage: 15 },
      color: 'bg-green-500'
    },
    {
      label: 'Avg. Time to Hire',
      value: 12,
      maxValue: 21,
      trend: { direction: 'down' as const, percentage: 8 },
      color: 'bg-blue-500'
    },
    {
      label: 'Match Success Rate',
      value: 87,
      maxValue: 100,
      trend: { direction: 'up' as const, percentage: 12 },
      color: 'bg-purple-500'
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Job Offers"
          value={stats.activeJobs}
          icon={Briefcase}
          trend={{ value: 12, label: 'vs last month' }}
        />
        <MetricCard
          title="Matched Talents"
          value={stats.matchedTalents}
          icon={Users}
          trend={{ value: 25, label: 'vs last month' }}
        />
        <QuickStats
          icon={TrendingUp}
          label="Avg. Match Score"
          value="89%"
          subValue="+5% this week"
          progress={89}
          color="bg-green-500"
        />
        <QuickStats
          icon={Activity}
          label="Response Rate"
          value="94%"
          subValue="12 hrs avg. response"
          progress={94}
          color="bg-blue-500"
        />
      </div>

      {/* AI-Powered Insights */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">AI-Powered Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiInsights.map((insight, index) => (
            <InsightCard key={index} {...insight} />
          ))}
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <ActivityFeed activities={recentActivity} maxHeight="450px" />
        </div>

        {/* Performance Metrics */}
        <div>
          <MatchingChart title="Hiring Performance" data={matchingData} />
        </div>
      </div>

      {/* Recent Job Offers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Your Job Offers</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/jobs">View all →</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { key: 'title', header: 'Title' },
              { key: 'role', header: 'Role', render: (item) => <span className="capitalize">{item.role}</span> },
              { key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
              { key: 'startDate', header: 'Start Date' },
            ]}
            data={recentJobs}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function AdminDashboard() {
  const stats = getDashboardStats('admin');
  const pendingJobs = mockJobOffers.filter(j => j.status === 'submitted').slice(0, 3);
  const recentRequests = mockTalentRequests.slice(0, 3);

  const adminInsights = [
    {
      title: 'Validation Backlog',
      insight: '7 job offers pending validation. 3 marked as urgent by strategic clients.',
      type: 'urgent' as const,
      icon: AlertCircle,
      action: { label: 'Review Queue', onClick: () => {} }
    },
    {
      title: 'Matching Success',
      insight: 'Your matching algorithm achieved 94% accuracy this week. 23 successful placements.',
      type: 'success' as const,
      icon: Award,
      action: { label: 'View Report', onClick: () => {} }
    },
    {
      title: 'Quality Alert',
      insight: '2 talent profiles need assessment updates. Skills verification expires soon.',
      type: 'warning' as const,
      icon: Brain,
      action: { label: 'Review Profiles', onClick: () => {} }
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'pending' as const,
      icon: FileTextIcon,
      title: 'New Job Validation',
      description: 'TechCorp submitted DevOps Specialist position',
      time: '15 minutes ago',
      badge: 'Urgent'
    },
    {
      id: '2',
      type: 'success' as const,
      icon: CheckCircle2,
      title: 'Match Approved',
      description: 'Shortlist approved for Backend Engineer role',
      time: '1 hour ago',
      badge: '3 talents'
    },
    {
      id: '3',
      type: 'info' as const,
      icon: UserPlus,
      title: 'New Talent Registration',
      description: 'Junior Developer completed profile & assessment',
      time: '2 hours ago',
      badge: 'Score: 85'
    },
    {
      id: '4',
      type: 'alert' as const,
      icon: AlertCircle,
      title: 'Client Request',
      description: 'StartupXYZ needs immediate React developer',
      time: '3 hours ago',
      badge: 'Priority'
    },
  ];

  const performanceData = [
    {
      label: 'Validation Rate',
      value: 45,
      maxValue: 50,
      trend: { direction: 'up' as const, percentage: 10 },
      color: 'bg-green-500'
    },
    {
      label: 'Match Accuracy',
      value: 94,
      maxValue: 100,
      trend: { direction: 'up' as const, percentage: 6 },
      color: 'bg-blue-500'
    },
    {
      label: 'Client Satisfaction',
      value: 92,
      maxValue: 100,
      trend: { direction: 'up' as const, percentage: 4 },
      color: 'bg-purple-500'
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Pending Validations"
          value={stats.pendingValidations}
          icon={FileText}
        />
        <MetricCard
          title="Active Requests"
          value={stats.activeRequests}
          icon={Target}
        />
        <MetricCard
          title="Total Talents"
          value={stats.totalTalents}
          icon={Users}
          trend={{ value: 8, label: 'this month' }}
        />
        <QuickStats
          icon={Award}
          label="Match Success"
          value="94%"
          subValue="This month"
          progress={94}
          color="bg-green-500"
        />
      </div>

      {/* AI Insights for Admin */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Platform Intelligence</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {adminInsights.map((insight, index) => (
            <InsightCard key={index} {...insight} />
          ))}
        </div>
      </div>

   
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <ActivityFeed activities={recentActivity} maxHeight="450px" />
        </div>

        {/* Performance Metrics */}
        <div>
          <MatchingChart title="Platform Performance" data={performanceData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Validations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Pending Job Validations</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/jobs">View all →</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={[
                { key: 'title', header: 'Title' },
                { key: 'clientName', header: 'Client' },
                { key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
              ]}
              data={pendingJobs}
            />
          </CardContent>
        </Card>

        {/* Recent Talent Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Talent Requests</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/requests">View all →</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={[
                { key: 'title', header: 'Title' },
                { key: 'urgency', header: 'Urgency', render: (item) => <StatusBadge status={item.urgency} /> },
                { key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
              ]}
              data={recentRequests}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TalentDashboard() {
  const stats = getDashboardStats('talent');
  const myApplications = mockApplications.filter(a => a.talentId === 'talent-1').slice(0, 3);
  const myAssessments = mockAssessments.filter(a => a.talentId === 'talent-1').slice(0, 3);

  const talentInsights = [
    {
      title: 'High Match Opportunities',
      insight: '5 new job offers match your profile at 90%+. Apply now to increase your chances.',
      type: 'success' as const,
      icon: Target,
      action: { label: 'View Jobs', onClick: () => {} }
    },
    {
      title: 'Profile Strength',
      insight: 'Your profile is 95% complete. Add certifications to reach top 10% of candidates.',
      type: 'info' as const,
      icon: Award,
      action: { label: 'Update Profile', onClick: () => {} }
    },
    {
      title: 'Assessment Due',
      insight: 'Complete your React assessment within 6 hours to qualify for Frontend role.',
      type: 'urgent' as const,
      icon: Clock,
      action: { label: 'Start Assessment', onClick: () => {} }
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'success' as const,
      icon: CheckCircle2,
      title: 'Application Shortlisted',
      description: 'You made it to the final round for Senior Frontend role',
      time: '30 minutes ago',
      badge: 'Match 94%'
    },
    {
      id: '2',
      type: 'info' as const,
      icon: CalendarIcon,
      title: 'Interview Scheduled',
      description: 'TechCorp Inc. - Feb 10, 2026 at 2:00 PM',
      time: '2 hours ago',
      badge: 'Confirmed'
    },
    {
      id: '3',
      type: 'success' as const,
      icon: FileTextIcon,
      title: 'Assessment Passed',
      description: 'TypeScript proficiency test completed with score 92/100',
      time: '1 day ago',
      badge: 'Excellent'
    },
    {
      id: '4',
      type: 'info' as const,
      icon: UserPlus,
      title: 'New Job Match',
      description: 'Full-Stack Developer at DataFlow Systems',
      time: '2 days ago',
      badge: 'Match 87%'
    },
  ];

  const progressData = [
    {
      label: 'Profile Completion',
      value: 95,
      maxValue: 100,
      color: 'bg-green-500'
    },
    {
      label: 'Assessment Score',
      value: 88,
      maxValue: 100,
      color: 'bg-blue-500'
    },
    {
      label: 'Response Rate',
      value: 92,
      maxValue: 100,
      color: 'bg-purple-500'
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Applied Jobs"
          value={stats.appliedJobs}
          icon={Briefcase}
        />
        <MetricCard
          title="Upcoming Interviews"
          value={stats.upcomingInterviews}
          icon={Calendar}
        />
        <QuickStats
          icon={Target}
          label="Average Match"
          value="89%"
          subValue="Across all jobs"
          progress={89}
          color="bg-green-500"
        />
        <QuickStats
          icon={Sparkles}
          label="Profile Views"
          value="47"
          subValue="+12 this week"
          progress={75}
          color="bg-blue-500"
        />
      </div>

      {/* Personalized Insights */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Your Career Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {talentInsights.map((insight, index) => (
            <InsightCard key={index} {...insight} />
          ))}
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <ActivityFeed activities={recentActivity} maxHeight="450px" />
        </div>

        {/* Your Progress */}
        <div>
          <MatchingChart title="Your Progress" data={progressData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Applications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">My Applications</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/pipeline">View all →</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={[
                { key: 'jobTitle', header: 'Job' },
                { key: 'stage', header: 'Stage', render: (item) => <StatusBadge status={item.stage} /> },
                { key: 'matchingScore', header: 'Score', render: (item) => <ScoreCard score={item.matchingScore} showLabel={false} size="sm" /> },
              ]}
              data={myApplications}
            />
          </CardContent>
        </Card>

        {/* My Assessments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">My Assessments</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/assessments">View all →</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={[
                { key: 'title', header: 'Assessment' },
                { key: 'type', header: 'Type', render: (item) => <span className="capitalize">{item.type}</span> },
                { key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
              ]}
              data={myAssessments}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  const getSubtitle = () => {
    switch (user?.role) {
      case 'client':
        return 'Manage your job offers and find the best talent';
      case 'admin':
        return 'Validate job offers and manage talent matching';
      case 'talent':
        return 'Track your applications and assessments';
      default:
        return '';
    }
  };

  return (
    <MainLayout title={`Welcome, ${user?.name?.split(' ')[0] || 'User'}`} subtitle={getSubtitle()}>
      {user?.role === 'client' && <ClientDashboard />}
      {user?.role === 'admin' && <AdminDashboard />}
      {user?.role === 'talent' && <TalentDashboard />}
    </MainLayout>
  );
}
