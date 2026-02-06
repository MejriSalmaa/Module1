import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { ScoreProgress } from '@/components/ScoreCard';
import { CodeAssessmentManager } from '@/components/CodeAssessmentManager';
import { mockAssessments } from '@/data/mockData';
import { Assessment } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Clock, Code, Brain, MessageSquare, ExternalLink, Github, Timer } from 'lucide-react';

const assessmentTypeConfig = {
  technical: { icon: Code, label: 'Technical', color: 'text-primary' },
  'soft-skill': { icon: MessageSquare, label: 'Soft Skills', color: 'text-info' },
  'code-challenge': { icon: Github, label: 'Code Challenge', color: 'text-warning' },
};

export default function Assessments() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

  // Mock code assessment data
  const mockCodeAssessments = [
    {
      id: 'code-1',
      title: 'E-commerce API Challenge',
      description: 'Build a RESTful API for an e-commerce platform with authentication, product management, and order processing.',
      talentName: 'Alex Rivera',
      talentId: 'talent-1',
      status: 'in-progress' as const,
      repoUrl: 'https://github.com/talenthub/alex-rivera-ecommerce-api',
      deadline: 'Feb 8, 2026 18:00',
      timeRemaining: '2h 30m',
      startedAt: 'Feb 8, 2026 10:00',
    },
    {
      id: 'code-2',
      title: 'React Dashboard Builder',
      description: 'Create a customizable dashboard with drag-and-drop widgets, real-time data updates, and responsive design.',
      talentName: 'Maria Santos',
      talentId: 'talent-2',
      status: 'submitted' as const,
      repoUrl: 'https://github.com/talenthub/maria-santos-dashboard',
      deadline: 'Feb 7, 2026 18:00',
      submittedAt: 'Feb 7, 2026 17:45',
    },
    {
      id: 'code-3',
      title: 'DevOps Infrastructure Setup',
      description: 'Set up a complete CI/CD pipeline with Docker, Kubernetes, and automated testing for a microservices architecture.',
      talentName: 'James Wilson',
      talentId: 'talent-3',
      status: 'reviewed' as const,
      repoUrl: 'https://github.com/talenthub/james-wilson-devops',
      deadline: 'Feb 5, 2026 18:00',
      submittedAt: 'Feb 5, 2026 16:30',
      score: 91,
      feedback: 'Excellent infrastructure setup with comprehensive documentation. Strong security practices and automated testing implementation.'
    },
    {
      id: 'code-4',
      title: 'Real-time Chat Application',
      description: 'Build a real-time chat with WebSocket support, user authentication, message history, and file sharing.',
      talentName: 'Sophie Martin',
      talentId: 'talent-4',
      status: 'not-started' as const,
      deadline: 'Feb 12, 2026 18:00',
    },
  ];

  // Filter based on role
  let assessments = mockAssessments;
  if (user?.role === 'talent') {
    assessments = assessments.filter((a) => a.talentId === 'talent-1');
  }

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || assessment.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || assessment.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate time remaining for in-progress code challenges
  const getTimeRemaining = (deadline?: string) => {
    if (!deadline) return null;
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m remaining`;
  };

  const columns = [
    {
      key: 'title',
      header: 'Assessment',
      render: (item: Assessment) => {
        const config = assessmentTypeConfig[item.type];
        return (
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-muted ${config.color}`}>
              <config.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">{config.label}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Assessment) => <StatusBadge status={item.status} />,
    },
    {
      key: 'score',
      header: 'Score',
      render: (item: Assessment) =>
        item.score !== undefined ? (
          <div className="w-32">
            <ScoreProgress score={item.score} maxScore={item.maxScore} />
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    ...(user?.role === 'admin'
      ? [
          {
            key: 'talentId',
            header: 'Talent',
            render: (item: Assessment) => (
              <span className="text-sm">{item.talentId}</span>
            ),
          },
        ]
      : []),
    {
      key: 'deadline',
      header: 'Deadline',
      render: (item: Assessment) => {
        if (item.status === 'completed' && item.completedAt) {
          return (
            <span className="text-sm text-muted-foreground">
              Completed {new Date(item.completedAt).toLocaleDateString()}
            </span>
          );
        }
        if (item.deadline) {
          const timeRemaining = getTimeRemaining(item.deadline);
          return (
            <span className={`text-sm flex items-center gap-1.5 ${timeRemaining === 'Expired' ? 'text-destructive' : 'text-warning'}`}>
              <Timer className="h-3.5 w-3.5" />
              {timeRemaining}
            </span>
          );
        }
        return <span className="text-muted-foreground">—</span>;
      },
    },
    {
      key: 'actions',
      header: '',
      render: (item: Assessment) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedAssessment(item)}>
          <ExternalLink className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <MainLayout
      title="Assessments"
      subtitle={
        user?.role === 'talent'
          ? 'Complete assessments to showcase your skills'
          : 'Review and manage talent assessments'
      }
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats Cards for Talent */}
        {user?.role === 'talent' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {assessments.filter((a) => a.status === 'completed').length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {assessments.filter((a) => a.status === 'in-progress').length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {assessments.filter((a) => a.status === 'pending').length}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assessments..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="soft-skill">Soft Skills</SelectItem>
              <SelectItem value="code-challenge">Code Challenge</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabbed Assessment Views */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Assessments</TabsTrigger>
            <TabsTrigger value="code">
              <Github className="h-4 w-4 mr-2" />
              Code Challenges
            </TabsTrigger>
            <TabsTrigger value="other">Technical & Soft Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <DataTable
              columns={columns}
              data={filteredAssessments}
              emptyMessage="No assessments found"
            />
          </TabsContent>

          <TabsContent value="code" className="mt-6">
            <CodeAssessmentManager 
              assessments={mockCodeAssessments} 
              viewMode={user?.role === 'admin' ? 'admin' : 'talent'} 
            />
          </TabsContent>

          <TabsContent value="other" className="mt-6">
            <DataTable
              columns={columns}
              data={filteredAssessments.filter(a => a.type !== 'code-challenge')}
              emptyMessage="No technical or soft skill assessments found"
            />
          </TabsContent>
        </Tabs>

        {/* Assessment Detail Dialog */}
        <Dialog open={!!selectedAssessment} onOpenChange={() => setSelectedAssessment(null)}>
          <DialogContent className="max-w-lg">
            {selectedAssessment && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedAssessment.title}</DialogTitle>
                  <DialogDescription className="flex items-center gap-3 mt-2">
                    <span className="capitalize">{selectedAssessment.type.replace('-', ' ')}</span>
                    <StatusBadge status={selectedAssessment.status} />
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  <p className="text-sm text-muted-foreground">
                    {selectedAssessment.description}
                  </p>

                  {selectedAssessment.score !== undefined && (
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm font-medium mb-2">Your Score</p>
                        <ScoreProgress
                          score={selectedAssessment.score}
                          maxScore={selectedAssessment.maxScore}
                        />
                      </CardContent>
                    </Card>
                  )}

                  {selectedAssessment.type === 'code-challenge' && selectedAssessment.repoUrl && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Github className="h-5 w-5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Repository</p>
                            <a
                              href={selectedAssessment.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              {selectedAssessment.repoUrl}
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Actions based on status */}
                  {user?.role === 'talent' && selectedAssessment.status === 'pending' && (
                    <Button className="w-full">Start Assessment</Button>
                  )}
                  {user?.role === 'talent' && selectedAssessment.status === 'in-progress' && (
                    <Button className="w-full">Continue Assessment</Button>
                  )}
                  {user?.role === 'admin' && selectedAssessment.status === 'completed' && (
                    <Button className="w-full">Review Submission</Button>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
