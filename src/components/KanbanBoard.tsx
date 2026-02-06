import { useMemo } from 'react';
import { Application, PipelineStage } from '@/types';
import { StatusBadge } from './StatusBadge';
import { ScoreCard } from './ScoreCard';
import { cn } from '@/lib/utils';
import { Calendar, User } from 'lucide-react';

interface KanbanBoardProps {
  applications: Application[];
  onCardClick?: (application: Application) => void;
  className?: string;
}

const stages: { key: PipelineStage; label: string; color: string }[] = [
  { key: 'applied', label: 'Applied', color: 'bg-muted' },
  { key: 'screening', label: 'Screening', color: 'bg-info/10' },
  { key: 'assessed', label: 'Assessed', color: 'bg-primary/10' },
  { key: 'interview-scheduled', label: 'Interview', color: 'bg-warning/10' },
  { key: 'results', label: 'Results', color: 'bg-info/10' },
  { key: 'accepted', label: 'Accepted', color: 'bg-success/10' },
  { key: 'rejected', label: 'Rejected', color: 'bg-destructive/10' },
];

export function KanbanBoard({ applications, onCardClick, className }: KanbanBoardProps) {
  const groupedApplications = useMemo(() => {
    const groups: Record<PipelineStage, Application[]> = {
      applied: [],
      screening: [],
      assessed: [],
      'interview-scheduled': [],
      results: [],
      accepted: [],
      rejected: [],
    };

    applications.forEach((app) => {
      if (groups[app.stage]) {
        groups[app.stage].push(app);
      }
    });

    return groups;
  }, [applications]);

  return (
    <div className={cn('flex gap-4 overflow-x-auto pb-4 scrollbar-thin', className)}>
      {stages.map((stage) => (
        <div key={stage.key} className="flex-shrink-0 w-72">
          <div className={cn('rounded-t-lg px-4 py-3 border-b', stage.color)}>
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm text-foreground">{stage.label}</h3>
              <span className="text-xs font-medium bg-background/80 px-2 py-0.5 rounded-full">
                {groupedApplications[stage.key].length}
              </span>
            </div>
          </div>
          <div className={cn('pipeline-stage rounded-b-lg min-h-[400px]', stage.color.replace('/10', '/5'))}>
            {groupedApplications[stage.key].map((app) => (
              <div
                key={app.id}
                className="pipeline-card"
                onClick={() => onCardClick?.(app)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{app.talentName}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                        {app.jobTitle}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <ScoreCard score={app.matchingScore} showLabel={false} size="sm" />
                  {app.interviewDate && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(app.interviewDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {groupedApplications[stage.key].length === 0 && (
              <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
                No applications
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
