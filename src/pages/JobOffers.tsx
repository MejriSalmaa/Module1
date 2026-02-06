import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { JobPostingWizard } from '@/components/JobPostingWizard';
import { mockJobOffers } from '@/data/mockData';
import { JobOffer } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Filter, ExternalLink } from 'lucide-react';

export default function JobOffers() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Filter jobs based on role
  let jobs = mockJobOffers;
  if (user?.role === 'client') {
    jobs = jobs.filter((j) => j.clientId === 'client-1');
  }

  // Apply filters
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getSubtitle = () => {
    switch (user?.role) {
      case 'client':
        return 'Create and manage your job postings';
      case 'admin':
        return 'Review and validate job offers from clients';
      case 'talent':
        return 'Browse available opportunities';
      default:
        return '';
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Job Title',
      render: (item: JobOffer) => (
        <div>
          <p className="font-medium">{item.title}</p>
          <p className="text-xs text-muted-foreground capitalize">{item.role}</p>
        </div>
      ),
    },
    ...(user?.role !== 'client'
      ? [
          {
            key: 'clientName',
            header: 'Client',
            render: (item: JobOffer) => item.clientName,
          },
        ]
      : []),
    {
      key: 'seniorityLevel',
      header: 'Seniority',
      render: (item: JobOffer) => <span className="capitalize">{item.seniorityLevel}</span>,
    },
    {
      key: 'workMode',
      header: 'Work Mode',
      render: (item: JobOffer) => <span className="capitalize">{item.workMode}</span>,
    },
    {
      key: 'budgetRange',
      header: 'Daily Rate',
      render: (item: JobOffer) => (
        <span className="text-sm">
          {item.budgetRange.min}–{item.budgetRange.max} {item.budgetRange.currency}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: JobOffer) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={item.status} />
          {item.tags?.includes('urgent') && (
            <StatusBadge status="urgent" />
          )}
        </div>
      ),
    },
    {
      key: 'startDate',
      header: 'Start Date',
    },
    {
      key: 'actions',
      header: '',
      render: (item: JobOffer) => (
        <Button variant="ghost" size="sm">
          <ExternalLink className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <MainLayout title="Job Offers" subtitle={getSubtitle()}>
      <div className="space-y-6 animate-fade-in">
        {/* Filters & Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="validated">Validated</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {user?.role === 'client' && (
            <Button onClick={() => setIsWizardOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          )}
        </div>

        {/* Job Posting Wizard */}
        <JobPostingWizard open={isWizardOpen} onOpenChange={setIsWizardOpen} />

        {/* Jobs Table */}
        <DataTable
          columns={columns}
          data={filteredJobs}
          emptyMessage="No job offers found"
        />
      </div>
    </MainLayout>
  );
}
