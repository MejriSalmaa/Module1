import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface InsightCardProps {
  title: string;
  insight: string;
  type: 'success' | 'warning' | 'info' | 'urgent';
  icon: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function InsightCard({ title, insight, type, icon: Icon, action }: InsightCardProps) {
  const typeStyles = {
    success: 'border-green-200 bg-green-50 dark:bg-green-950/20',
    warning: 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20',
    info: 'border-blue-200 bg-blue-50 dark:bg-blue-950/20',
    urgent: 'border-red-200 bg-red-50 dark:bg-red-950/20',
  };

  const badgeStyles = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <Card className={`${typeStyles[type]} border-2 transition-all hover:shadow-md`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-white dark:bg-gray-800/50">
              <Icon className="h-4 w-4" />
            </div>
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </div>
          <Badge className={badgeStyles[type]} variant="secondary">
            {type === 'urgent' ? 'Action Required' : type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">{insight}</p>
        {action && (
          <button
            onClick={action.onClick}
            className="text-xs font-medium text-primary hover:underline"
          >
            {action.label} →
          </button>
        )}
      </CardContent>
    </Card>
  );
}
