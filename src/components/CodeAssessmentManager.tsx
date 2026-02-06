import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  GitBranch, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Code2,
  Play,
  Lock,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeAssessment {
  id: string;
  title: string;
  description: string;
  talentName: string;
  talentId: string;
  status: 'not-started' | 'in-progress' | 'submitted' | 'reviewed';
  repoUrl?: string;
  deadline: string;
  timeRemaining?: string;
  startedAt?: string;
  submittedAt?: string;
  score?: number;
  feedback?: string;
}

interface CodeAssessmentManagerProps {
  assessments: CodeAssessment[];
  viewMode: 'talent' | 'admin';
}

export function CodeAssessmentManager({ assessments, viewMode }: CodeAssessmentManagerProps) {
  const [selectedAssessment, setSelectedAssessment] = useState<CodeAssessment | null>(null);

  const getStatusColor = (status: CodeAssessment['status']) => {
    switch (status) {
      case 'not-started':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'reviewed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  const getStatusIcon = (status: CodeAssessment['status']) => {
    switch (status) {
      case 'not-started':
        return <Clock className="h-4 w-4" />;
      case 'in-progress':
        return <Play className="h-4 w-4" />;
      case 'submitted':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'reviewed':
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  const handleStartAssessment = async (assessment: CodeAssessment) => {
    // Simulate creating GitHub repo
    console.log('Creating private GitHub repository for:', assessment.id);
    // In real implementation, this would call an API to create the repo
    alert('GitHub repository created! You will receive an email with access details.');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assessments.map((assessment) => (
          <Card 
            key={assessment.id}
            className={cn(
              'transition-all hover:shadow-lg cursor-pointer',
              assessment.status === 'in-progress' && 'border-primary'
            )}
            onClick={() => setSelectedAssessment(assessment)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{assessment.title}</CardTitle>
                <Badge className={getStatusColor(assessment.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(assessment.status)}
                    <span className="capitalize">{assessment.status.replace('-', ' ')}</span>
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {assessment.description}
              </p>

              {viewMode === 'admin' && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Talent:</span>
                  <span className="font-medium ml-1">{assessment.talentName}</span>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Deadline</span>
                  <span className="font-medium">{assessment.deadline}</span>
                </div>
                
                {assessment.timeRemaining && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                    <span className="text-amber-600 font-medium">{assessment.timeRemaining}</span>
                  </div>
                )}

                {assessment.status === 'in-progress' && (
                  <div className="space-y-1">
                    <Progress value={45} className="h-1.5" />
                    <p className="text-xs text-muted-foreground">45% time elapsed</p>
                  </div>
                )}

                {assessment.score !== undefined && (
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Score</span>
                    <span className="text-lg font-bold text-primary">{assessment.score}/100</span>
                  </div>
                )}
              </div>

              {assessment.status === 'not-started' && viewMode === 'talent' && (
                <Button 
                  className="w-full" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartAssessment(assessment);
                  }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Assessment
                </Button>
              )}

              {assessment.status === 'in-progress' && assessment.repoUrl && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(assessment.repoUrl, '_blank');
                  }}
                >
                  <GitBranch className="h-4 w-4 mr-2" />
                  Open Repository
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              )}

              {assessment.status === 'submitted' && (
                <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/20 p-2 rounded">
                  <Lock className="h-4 w-4" />
                  <span>Repository locked - Awaiting review</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Assessment Detail Dialog */}
      {selectedAssessment && (
        <Dialog open={!!selectedAssessment} onOpenChange={() => setSelectedAssessment(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                {selectedAssessment.title}
              </DialogTitle>
              <DialogDescription>
                {viewMode === 'admin' && `Assessment for ${selectedAssessment.talentName}`}
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="flex-1">
              <div className="space-y-6 pr-4">
                {/* Status Banner */}
                <Card className={cn(
                  'border-2',
                  selectedAssessment.status === 'in-progress' && 'bg-blue-50 dark:bg-blue-950/20 border-blue-200',
                  selectedAssessment.status === 'submitted' && 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200',
                  selectedAssessment.status === 'reviewed' && 'bg-green-50 dark:bg-green-950/20 border-green-200'
                )}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(selectedAssessment.status)}
                        <div>
                          <p className="font-medium capitalize">{selectedAssessment.status.replace('-', ' ')}</p>
                          {selectedAssessment.timeRemaining && (
                            <p className="text-sm text-muted-foreground">{selectedAssessment.timeRemaining} remaining</p>
                          )}
                        </div>
                      </div>
                      <Badge className={getStatusColor(selectedAssessment.status)} variant="outline">
                        Deadline: {selectedAssessment.deadline}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Assessment Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{selectedAssessment.description}</p>
                  </CardContent>
                </Card>

                {/* Instructions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Instructions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-sm flex-shrink-0">1</div>
                      <p className="text-sm">A private GitHub repository will be created automatically when you start</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-sm flex-shrink-0">2</div>
                      <p className="text-sm">You have 8 hours from the start time to complete the challenge</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-sm flex-shrink-0">3</div>
                      <p className="text-sm">Commit your code regularly - your git history will be reviewed</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-sm flex-shrink-0">4</div>
                      <p className="text-sm">The repository will be automatically locked after the deadline</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-sm flex-shrink-0">5</div>
                      <p className="text-sm">Include tests, documentation, and a README</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Repository Info */}
                {selectedAssessment.repoUrl && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <GitBranch className="h-4 w-4" />
                        Repository Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Repository URL</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="flex-1 p-2 bg-muted rounded text-xs">
                            {selectedAssessment.repoUrl}
                          </code>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(selectedAssessment.repoUrl, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {selectedAssessment.startedAt && (
                        <div>
                          <Label className="text-xs text-muted-foreground">Started At</Label>
                          <p className="text-sm mt-1">{selectedAssessment.startedAt}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Review Results (Admin or Reviewed Status) */}
                {selectedAssessment.status === 'reviewed' && selectedAssessment.score !== undefined && (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-base">Review Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                        <span className="font-medium">Final Score</span>
                        <span className="text-3xl font-bold text-primary">{selectedAssessment.score}/100</span>
                      </div>
                      {selectedAssessment.feedback && (
                        <div>
                          <Label className="text-sm font-medium">Feedback</Label>
                          <p className="text-sm text-muted-foreground mt-2">{selectedAssessment.feedback}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              {selectedAssessment.status === 'not-started' && viewMode === 'talent' && (
                <Button onClick={() => handleStartAssessment(selectedAssessment)} size="lg">
                  <Play className="h-4 w-4 mr-2" />
                  Start Assessment
                </Button>
              )}
              {selectedAssessment.status === 'submitted' && viewMode === 'admin' && (
                <Button size="lg">
                  <Code2 className="h-4 w-4 mr-2" />
                  Review Code
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={cn('text-sm font-medium', className)}>{children}</label>;
}
