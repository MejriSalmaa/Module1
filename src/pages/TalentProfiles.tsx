import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { ScoreCard } from '@/components/ScoreCard';
import { mockTalentProfiles } from '@/data/mockData';
import { TalentProfile } from '@/types';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Filter, MapPin, Clock, Award, Star, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function TalentProfiles() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [selectedTalent, setSelectedTalent] = useState<TalentProfile | null>(null);

  const filteredTalents = mockTalentProfiles.filter((talent) => {
    const matchesSearch =
      talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.skills.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAvailability =
      availabilityFilter === 'all' || talent.availability === availabilityFilter;
    return matchesSearch && matchesAvailability;
  });

  const columns = [
    {
      key: 'name',
      header: 'Talent',
      render: (item: TalentProfile) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-medium">{item.name.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.title}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (item: TalentProfile) => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{item.location}</span>
        </div>
      ),
    },
    {
      key: 'skills',
      header: 'Top Skills',
      render: (item: TalentProfile) => (
        <div className="flex flex-wrap gap-1">
          {item.skills.slice(0, 3).map((skill) => (
            <span
              key={skill.name}
              className="px-2 py-0.5 bg-muted rounded text-xs text-foreground"
            >
              {skill.name}
            </span>
          ))}
          {item.skills.length > 3 && (
            <span className="px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground">
              +{item.skills.length - 3}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'experience',
      header: 'Experience',
      render: (item: TalentProfile) => <span>{item.experience} years</span>,
    },
    {
      key: 'dailyRate',
      header: 'Daily Rate',
      render: (item: TalentProfile) => (
        <span className="font-medium">
          {item.dailyRate.amount} {item.dailyRate.currency}
        </span>
      ),
    },
    {
      key: 'availability',
      header: 'Availability',
      render: (item: TalentProfile) => <StatusBadge status={item.availability} />,
    },
    {
      key: 'matchingScore',
      header: 'Match Score',
      render: (item: TalentProfile) =>
        item.matchingScore ? (
          <ScoreCard score={item.matchingScore} showLabel={false} size="sm" />
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: 'actions',
      header: '',
      render: (item: TalentProfile) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedTalent(item)}>
          <ExternalLink className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <MainLayout
      title="Talent Profiles"
      subtitle={
        user?.role === 'admin'
          ? 'Manage and review talent pool'
          : 'Browse recommended talents for your projects'
      }
    >
      <div className="space-y-6 animate-fade-in">
        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search talents, skills..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Availability</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="partially-available">Partially Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Talents Table */}
        <DataTable
          columns={columns}
          data={filteredTalents}
          emptyMessage="No talents found"
        />

        {/* Talent Detail Dialog */}
        <Dialog open={!!selectedTalent} onOpenChange={() => setSelectedTalent(null)}>
          <DialogContent className="max-w-2xl">
            {selectedTalent && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium text-lg">
                        {selectedTalent.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p>{selectedTalent.name}</p>
                      <p className="text-sm font-normal text-muted-foreground">
                        {selectedTalent.title}
                      </p>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Quick Info */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedTalent.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedTalent.timezone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedTalent.experience} years experience</span>
                    </div>
                  </div>

                  {/* Match Score */}
                  {selectedTalent.matchingScore && (
                    <Card className="bg-accent/30 border-accent">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Matching Score</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Based on skills, experience, and availability
                            </p>
                          </div>
                          <ScoreCard score={selectedTalent.matchingScore} size="lg" />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Skills */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTalent.skills.map((skill) => (
                        <span
                          key={skill.name}
                          className="px-3 py-1 bg-muted rounded-full text-sm flex items-center gap-1.5"
                        >
                          {skill.name}
                          <span className="text-xs text-muted-foreground capitalize">
                            ({skill.level})
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Strengths */}
                  {selectedTalent.strengths && selectedTalent.strengths.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Key Strengths</h4>
                      <ul className="space-y-1">
                        {selectedTalent.strengths.map((strength) => (
                          <li
                            key={strength}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <Star className="h-3.5 w-3.5 text-success" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Rates */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Daily Rate</p>
                        <p className="text-xl font-bold">
                          {selectedTalent.dailyRate.amount} {selectedTalent.dailyRate.currency}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Hourly Rate</p>
                        <p className="text-xl font-bold">
                          {selectedTalent.hourlyRate.amount} {selectedTalent.hourlyRate.currency}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    {user?.role === 'client' && (
                      <Button className="flex-1">Request This Talent</Button>
                    )}
                    {user?.role === 'admin' && (
                      <>
                        <Button variant="outline" className="flex-1">
                          View Assessments
                        </Button>
                        <Button className="flex-1">Add to Shortlist</Button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
