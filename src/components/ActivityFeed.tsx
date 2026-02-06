import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  UserPlus, 
  FileText,
  Calendar,
  MessageSquare,
  LucideIcon
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'success' | 'pending' | 'alert' | 'info';
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  badge?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  maxHeight?: string;
}

export function ActivityFeed({ activities, maxHeight = '400px' }: ActivityFeedProps) {
  const getIconColor = (type: Activity['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-50 dark:bg-green-950/20';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20';
      case 'alert':
        return 'text-red-600 bg-red-50 dark:bg-red-950/20';
      case 'info':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950/20';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea style={{ height: maxHeight }}>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex gap-3">
                <div className={`p-2 rounded-lg h-fit ${getIconColor(activity.type)}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                    {activity.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {activity.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export { CheckCircle2, Clock, AlertCircle, UserPlus, FileText, Calendar, MessageSquare };
