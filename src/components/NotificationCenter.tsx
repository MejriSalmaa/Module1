import { useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import{ Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Briefcase,
  Calendar,
  FileText,
  Users,
  X,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'application' | 'assessment' | 'interview' | 'decision' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'normal' | 'high';
}

interface NotificationCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'application',
    title: 'New Application Received',
    message: 'Alex Rivera applied to your Senior Frontend Developer position',
    timestamp: '2 minutes ago',
    read: false,
    actionUrl: '/pipeline',
    priority: 'high'
  },
  {
    id: '2',
    type: 'interview',
    title: 'Interview Scheduled',
    message: 'Interview with Maria Santos confirmed for Feb 10, 2026 at 2:00 PM',
    timestamp: '1 hour ago',
    read: false,
    actionUrl: '/pipeline',
    priority: 'high'
  },
  {
    id: '3',
    type: 'assessment',
    title: 'Assessment Completed',
    message: 'James Wilson completed the DevOps technical assessment with score 91/100',
    timestamp: '3 hours ago',
    read: true,
    actionUrl: '/assessments',
    priority: 'normal'
  },
  {
    id: '4',
    type: 'decision',
    title: 'Talent Shortlist Ready',
    message: '3 pre-qualified candidates matched for Backend Engineer role',
    timestamp: '5 hours ago',
    read: true,
    actionUrl: '/talents',
    priority: 'normal'
  },
  {
    id: '5',
    type: 'system',
    title: 'Job Offer Validated',
    message: 'Your DevOps Specialist job offer has been validated and is now live',
    timestamp: '1 day ago',
    read: true,
    actionUrl: '/jobs',
    priority: 'low'
  },
  {
    id: '6',
    type: 'application',
    title: 'Application Update',
    message: 'Sophie Martin moved to Interview stage for Junior Frontend role',
    timestamp: '1 day ago',
    read: true,
    actionUrl: '/pipeline',
    priority: 'normal'
  },
];

export function NotificationCenter({ open, onOpenChange }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'application':
        return <Briefcase className="h-5 w-5" />;
      case 'assessment':
        return <FileText className="h-5 w-5" />;
      case 'interview':
        return <Calendar className="h-5 w-5" />;
      case 'decision':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'system':
        return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'application':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950/20';
      case 'assessment':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-950/20';
      case 'interview':
        return 'text-green-600 bg-green-50 dark:bg-green-950/20';
      case 'decision':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-950/20';
      case 'system':
        return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-hidden flex flex-col">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="rounded-full">
                  {unreadCount}
                </Badge>
              )}
            </SheetTitle>
          </div>
          <SheetDescription>
            Stay updated with your talent hub activities
          </SheetDescription>
        </SheetHeader>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')} className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid w-full max-w-[200px] grid-cols-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2 rounded-full px-1.5 py-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>

          <TabsContent value={filter} className="flex-1 mt-0">
            <ScrollArea className="h-[calc(100vh-250px)]">
              <div className="space-y-2 pr-4">
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">
                      {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'p-4 rounded-lg border transition-all hover:shadow-md',
                        !notification.read && 'bg-primary/5 border-primary/20'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'p-2 rounded-lg flex-shrink-0',
                          getNotificationColor(notification.type)
                        )}>
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className={cn(
                              'text-sm font-medium',
                              !notification.read && 'text-primary'
                            )}>
                              {notification.title}
                            </p>
                            <div className="flex items-center gap-1">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {notification.timestamp}
                            </div>
                            {notification.actionUrl && (
                              <Button 
                                variant="link" 
                                size="sm" 
                                className="h-auto p-0 text-xs"
                                onClick={() => {
                                  onOpenChange(false);
                                  // Navigate to action URL
                                }}
                              >
                                View details →
                              </Button>
                            )}
                          </div>

                          {notification.priority === 'high' && (
                            <Badge 
                              variant="destructive" 
                              className="mt-2 text-xs"
                            >
                              <AlertCircle className="h-3 w-3 mr-1" />
                              High Priority
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="border-t pt-4 mt-auto">
          <Button variant="outline" className="w-full" onClick={() => setNotifications([])}>
            Clear All Notifications
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
