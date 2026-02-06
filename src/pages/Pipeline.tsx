import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { KanbanBoard } from '@/components/KanbanBoard';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { ScoreCard } from '@/components/ScoreCard';
import { InterviewScheduler } from '@/components/InterviewScheduler';
import { mockApplications } from '@/data/mockData';
import { Application } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Search, LayoutGrid, Table, Calendar, Clock, MessageSquare } from 'lucide-react';

export default function Pipeline() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [interviewSchedulerOpen, setInterviewSchedulerOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<{name: string; job: string} | null>(null);

  // Filter based on role
  let applications = mockApplications;
  if (user?.role === 'talent') {
    applications = applications.filter((a) => a.talentId === 'talent-1');
  }

  const filteredApplications = applications.filter((app) =>
    app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.talentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'talentName',
      header: 'Talent',
      render: (item: Application) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary text-sm font-medium">
              {item.talentName.charAt(0)}
            </span>
          </div>
          <span className="font-medium">{item.talentName}</span>
        </div>
      ),
    },
    {
      key: 'jobTitle',
      header: 'Position',
    },
    {
      key: 'stage',
      header: 'Stage',
      render: (item: Application) => <StatusBadge status={item.stage} />,
    },
    {
      key: 'matchingScore',
      header: 'Match Score',
      render: (item: Application) => (
        <ScoreCard score={item.matchingScore} showLabel={false} size="sm" />
      ),
    },
    {
      key: 'appliedAt',
      header: 'Applied',
    },
    {
      key: 'interviewDate',
      header: 'Interview',
      render: (item: Application) =>
        item.interviewDate ? (
          <span className="flex items-center gap-1.5 text-sm">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            {new Date(item.interviewDate).toLocaleDateString()}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
  ];

  return (
    <MainLayout
      title="Recruitment Pipeline"
      subtitle={
        user?.role === 'talent'
          ? 'Track the progress of your applications'
          : 'Manage candidates through the recruitment process'
      }
    >
      <div className="space-y-6 animate-fade-in">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('kanban')}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Kanban
            </Button>
            <Button
              variant={viewMode === 'table' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <Table className="h-4 w-4 mr-2" />
              Table
            </Button>
          </div>
        </div>

        {/* View */}
        {viewMode === 'kanban' ? (
          <KanbanBoard
            applications={filteredApplications}
            onCardClick={setSelectedApplication}
          />
        ) : (
        <DataTable
          columns={columns}
          data={filteredApplications}
          onRowClick={(item) => setSelectedApplication(item as Application)}
          emptyMessage="No applications in the pipeline"
        />
        )}

        {/* Application Detail Dialog */}
        <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="max-w-lg">
            {selectedApplication && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">
                        {selectedApplication.talentName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p>{selectedApplication.talentName}</p>
                      <p className="text-sm font-normal text-muted-foreground">
                        {selectedApplication.jobTitle}
                      </p>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Current Status */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Stage</p>
                      <StatusBadge status={selectedApplication.stage} />
                    </div>
                    <ScoreCard score={selectedApplication.matchingScore} size="md" />
                  </div>

                  {/* Timeline */}
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Applied on {selectedApplication.appliedAt}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span>Last updated {selectedApplication.lastUpdated}</span>
                      </div>
                      {selectedApplication.interviewDate && (
                        <div className="flex items-center gap-3 text-sm text-warning">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Interview on{' '}
                            {new Date(selectedApplication.interviewDate).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Notes */}
                  {selectedApplication.notes && (
                    <div>
                      <p className="text-sm font-medium mb-2">Notes</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedApplication.notes}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  {user?.role === 'admin' && (
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSelectedCandidate({
                            name: selectedApplication.talentName,
                            job: selectedApplication.jobTitle
                          });
                          setInterviewSchedulerOpen(true);
                        }}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Interview
                      </Button>
                      <Button>Move to Next Stage</Button>
                    </div>
                  )}
                  {user?.role === 'talent' && selectedApplication.interviewDate && (
                    <Button className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Add to Calendar
                    </Button>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Interview Scheduler */}
        {selectedCandidate && (
          <InterviewScheduler 
            open={interviewSchedulerOpen}
            onOpenChange={setInterviewSchedulerOpen}
            candidateName={selectedCandidate.name}
            jobTitle={selectedCandidate.job}
          />
        )}
      </div>
    </MainLayout>
  );
}
