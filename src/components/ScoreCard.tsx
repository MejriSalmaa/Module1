import { cn } from '@/lib/utils';

interface ScoreCardProps {
  score: number;
  maxScore?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 90) return 'text-success';
  if (score >= 75) return 'text-success/80';
  if (score >= 60) return 'text-warning';
  return 'text-destructive';
}

function getScoreBgColor(score: number): string {
  if (score >= 90) return 'bg-success/10';
  if (score >= 75) return 'bg-success/10';
  if (score >= 60) return 'bg-warning/10';
  return 'bg-destructive/10';
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Average';
  return 'Low';
}

export function ScoreCard({ score, maxScore = 100, showLabel = true, size = 'md', className }: ScoreCardProps) {
  const percentage = Math.round((score / maxScore) * 100);
  
  const sizeClasses = {
    sm: 'text-lg font-semibold',
    md: 'text-2xl font-bold',
    lg: 'text-3xl font-bold',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-lg px-3 py-1.5',
          getScoreBgColor(percentage),
          getScoreColor(percentage),
          sizeClasses[size]
        )}
      >
        {percentage}%
      </div>
      {showLabel && (
        <span className={cn('text-sm', getScoreColor(percentage))}>
          {getScoreLabel(percentage)}
        </span>
      )}
    </div>
  );
}

interface ScoreProgressProps {
  score: number;
  maxScore?: number;
  className?: string;
}

export function ScoreProgress({ score, maxScore = 100, className }: ScoreProgressProps) {
  const percentage = Math.round((score / maxScore) * 100);

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-foreground">{percentage}%</span>
        <span className="text-sm text-muted-foreground">{getScoreLabel(percentage)}</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className={cn('h-2 rounded-full transition-all', getScoreBgColor(percentage).replace('/10', ''))}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
