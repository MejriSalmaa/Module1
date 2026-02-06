import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { mockTalentRequests, mockTalentProfiles } from '@/data/mockData';
import { TalentRequest } from '@/types';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScoreCard } from '@/components/ScoreCard';
import { Plus, Search, Filter, Users, Clock, MapPin, Star } from 'lucide-react';

export default function TalentRequests() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TalentRequest | null>(null);

  let requests = mockTalentRequests;
  if (user?.role === 'client') {
    requests = requests.filter((r) => r.clientId === 'client-1');
  }

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'title',
      header: 'Request',
      render: (item: TalentRequest) => (
        <div>
          <p className="font-medium">{item.title}</p>
          <p className="text-xs text-muted-foreground">{item.clientName}</p>
        </div>
      ),
    },
    {
      key: 'skills',
      header: 'Required Skills',
      render: (item: TalentRequest) => (
        <div className="flex flex-wrap gap-1">
          {item.skills.slice(0, 2).map((skill) => (
            <span
              key={skill.name}
              className="px-2 py-0.5 bg-muted rounded text-xs"
            >
              {skill.name}
            </span>
          ))}
          {item.skills.length > 2 && (
            <span className="px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground">
              +{item.skills.length - 2}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'urgency',
      header: 'Urgency',
      render: (item: TalentRequest) => <StatusBadge status={item.urgency} />,
    },
    {
      key: 'requestType',
      header: 'Type',
      render: (item: TalentRequest) => (
        <span className="capitalize text-sm">{item.requestType.replace('-', ' ')}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: TalentRequest) => <StatusBadge status={item.status} />,
    },
    {
      key: 'matchedTalents',
      header: 'Matches',
      render: (item: TalentRequest) => (
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{item.matchedTalents?.length || 0}</span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
    },
  ];

  return (
    <MainLayout
      title="Talent Requests"
      subtitle={
        user?.role === 'client'
          ? 'Request specific talent profiles for your projects'
          : 'Manage and fulfill client talent requests'
      }
    >
      <div className="space-y-6 animate-fade-in">
        {/* Filters & Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-review">In Review</SelectItem>
                <SelectItem value="matched">Matched</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {user?.role === 'client' && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Request Talent</DialogTitle>
                  <DialogDescription>
                    Describe your talent requirements for direct matching
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Request Title</Label>
                    <Input id="title" placeholder="e.g. React Developer for Q1 Project" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills">Required Skills</Label>
                    <Textarea
                      id="skills"
                      placeholder="List must-have skills..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="urgency">Urgency</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Request Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shortlist">Shortlist (3-5 profiles)</SelectItem>
                          <SelectItem value="single-profile">Single Best Match</SelectItem>
                          <SelectItem value="backup-profiles">With Backup Options</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="availability">Required Availability</Label>
                      <Input id="availability" placeholder="e.g. Immediate" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone Preference</Label>
                      <Input id="timezone" placeholder="e.g. CET +/- 2h" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Submit Request</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Requests Table */}
        <DataTable
          columns={columns}
          data={filteredRequests}
          onRowClick={(item) => setSelectedRequest(item as TalentRequest)}
          emptyMessage="No talent requests found"
        />

        {/* Request Detail Dialog with Matched Talents */}
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedRequest && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedRequest.title}</DialogTitle>
                  <DialogDescription className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {selectedRequest.availability}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {selectedRequest.timezone}
                    </span>
                    <StatusBadge status={selectedRequest.urgency} />
                    <StatusBadge status={selectedRequest.status} />
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Required Skills */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRequest.skills.map((skill) => (
                        <span
                          key={skill.name}
                          className="px-3 py-1 bg-muted rounded-full text-sm flex items-center gap-1.5"
                        >
                          {skill.name}
                          <StatusBadge status={skill.priority} />
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Matched Talents */}
                  {selectedRequest.matchedTalents && selectedRequest.matchedTalents.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-3">Matched Talents</h4>
                      <div className="space-y-3">
                        {selectedRequest.matchedTalents.map((talent) => (
                          <Card key={talent.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-primary font-medium">
                                      {talent.name.charAt(0)}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium">{talent.name}</p>
                                    <p className="text-sm text-muted-foreground">{talent.title}</p>
                                  </div>
                                </div>
                                {talent.matchingScore && (
                                  <ScoreCard score={talent.matchingScore} size="sm" />
                                )}
                              </div>
                              <div className="mt-3 flex flex-wrap gap-1">
                                {talent.skills.slice(0, 4).map((skill) => (
                                  <span
                                    key={skill.name}
                                    className="px-2 py-0.5 bg-muted rounded text-xs"
                                  >
                                    {skill.name}
                                  </span>
                                ))}
                              </div>
                              {talent.strengths && (
                                <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
                                  {talent.strengths.slice(0, 2).map((s) => (
                                    <span key={s} className="flex items-center gap-1">
                                      <Star className="h-3 w-3 text-success" />
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Admin Actions */}
                  {user?.role === 'admin' && selectedRequest.status !== 'completed' && (
                    <div className="flex gap-3 pt-4">
                      <Button variant="outline" className="flex-1">
                        Run Matching
                      </Button>
                      <Button className="flex-1">Approve & Send to Client</Button>
                    </div>
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
