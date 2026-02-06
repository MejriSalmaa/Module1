import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface QuickStatsProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subValue?: string;
  progress?: number;
  progressLabel?: string;
  color?: string;
}

export function QuickStats({
  icon: Icon,
  label,
  value,
  subValue,
  progress,
  progressLabel,
  color = 'bg-primary',
}: QuickStatsProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
            <Icon className="h-5 w-5" style={{ color: color.replace('bg-', '') }} />
          </div>
          {progress !== undefined && (
            <div className="text-right">
              <p className="text-2xl font-bold">{progress}%</p>
              {progressLabel && (
                <p className="text-xs text-muted-foreground">{progressLabel}</p>
              )}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subValue && (
            <p className="text-xs text-muted-foreground">{subValue}</p>
          )}
        </div>
        {progress !== undefined && (
          <Progress value={progress} className="mt-3 h-1" />
        )}
      </CardContent>
    </Card>
  );
}
