import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { ScoreCard, ScoreProgress } from '@/components/ScoreCard';
import { CVUploadDialog } from '@/components/CVUploadDialog';
import { mockTalentProfiles, mockAssessments } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MapPin,
  Clock,
  Award,
  Briefcase,
  GraduationCap,
  Upload,
  FileText,
  Edit2,
  Save,
  X,
  Sparkles
} from 'lucide-react';

export default function TalentProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [cvUploadOpen, setCvUploadOpen] = useState(false);

  // Get mock profile for the current talent
  const profile = mockTalentProfiles.find((t) => t.id === 'talent-1') || mockTalentProfiles[0];
  const assessments = mockAssessments.filter((a) => a.talentId === 'talent-1');

  return (
    <MainLayout title="My Profile" subtitle="Manage your professional profile and skills">
      <div className="space-y-6 animate-fade-in">
        {/* CV Upload Action */}
        <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Quick Profile Setup with AI</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload your CV and let our AI extract and structure your information automatically
                  </p>
                </div>
              </div>
              <Button onClick={() => setCvUploadOpen(true)} size="lg">
                <Upload className="h-4 w-4 mr-2" />
                Upload CV
              </Button>
            </div>
          </CardContent>
        </Card>

        <CVUploadDialog 
          open={cvUploadOpen} 
          onOpenChange={setCvUploadOpen}
          onProfileUpdate={(data) => {
            console.log('Profile updated:', data);
            // Handle profile update
          }}
        />

        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar & Basic Info */}
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-2xl">
                    {profile.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{profile.name}</h2>
                  <p className="text-muted-foreground">{profile.title}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {profile.timezone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4" />
                      {profile.experience} years
                    </span>
                  </div>
                </div>
              </div>

              {/* Availability & Rate */}
              <div className="flex-1 flex flex-col md:flex-row gap-4 md:justify-end md:items-start">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Availability</p>
                  <StatusBadge status={profile.availability} />
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Daily Rate</p>
                  <p className="font-semibold">
                    {profile.dailyRate.amount} {profile.dailyRate.currency}
                  </p>
                </div>
                <Button onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile Details</TabsTrigger>
            <TabsTrigger value="skills">Skills & Experience</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="cv">CV Upload</TabsTrigger>
          </TabsList>

          {/* Profile Details Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      defaultValue={profile.name}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={profile.email}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      defaultValue={profile.title}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      defaultValue={profile.location}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      defaultValue={profile.timezone}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability</Label>
                    <Select defaultValue={profile.availability} disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="partially-available">Partially Available</SelectItem>
                        <SelectItem value="unavailable">Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dailyRate">Daily Rate (EUR)</Label>
                    <Input
                      id="dailyRate"
                      type="number"
                      defaultValue={profile.dailyRate.amount}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate (EUR)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      defaultValue={profile.hourlyRate.amount}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end pt-4">
                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.skills.map((skill) => (
                      <div key={skill.name} className="flex items-center justify-between">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-muted-foreground capitalize">
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                  {isEditing && (
                    <Button variant="outline" className="w-full mt-4">
                      Add Skill
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Education & Certifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Education</span>
                    </div>
                    <p>{profile.education}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Certifications</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="px-3 py-1 bg-accent rounded-full text-sm"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Custom Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Tags</CardTitle>
                <CardDescription>
                  Special qualifications and experiences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.customTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assessments Tab */}
          <TabsContent value="assessments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessments.map((assessment) => (
                <Card key={assessment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{assessment.title}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {assessment.type.replace('-', ' ')}
                        </p>
                      </div>
                      <StatusBadge status={assessment.status} />
                    </div>
                    {assessment.score !== undefined && (
                      <div className="mt-4">
                        <ScoreProgress
                          score={assessment.score}
                          maxScore={assessment.maxScore}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* CV Upload Tab */}
          <TabsContent value="cv" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>CV Upload with OCR</CardTitle>
                <CardDescription>
                  Upload your CV (PDF or Image) and we'll automatically extract your
                  information using OCR technology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop your CV here, or click to browse
                  </p>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Select File
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Supported formats: PDF, PNG, JPG (max 10MB)
                  </p>
                </div>

                <div className="mt-6 p-4 bg-accent/30 rounded-lg">
                  <h4 className="font-medium mb-2">How it works:</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Upload your CV document</li>
                    <li>Our OCR extracts personal info, education, experience, and skills</li>
                    <li>Review the auto-filled profile data</li>
                    <li>Edit and confirm the extracted information</li>
                    <li>Submit your structured profile</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
