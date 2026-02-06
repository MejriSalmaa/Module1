import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Briefcase, 
  Users, 
  Calendar as CalendarIcon, 
  DollarSign, 
  Target, 
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface JobWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface JobFormData {
  title: string;
  role: string;
  seniorityLevel: string;
  skills: Array<{ name: string; priority: 'must-have' | 'nice-to-have' }>;
  projectDuration: string;
  startDate: Date | undefined;
  budgetMin: string;
  budgetMax: string;
  workMode: string;
  softSkills: string[];
  description: string;
}

const steps = [
  { id: 1, title: 'Basic Info', icon: Briefcase },
  { id: 2, title: 'Skills & Requirements', icon: Target },
  { id: 3, title: 'Engagement Details', icon: CalendarIcon },
  { id: 4, title: 'Budget & Terms', icon: DollarSign },
  { id: 5, title: 'Review', icon: CheckCircle2 },
];

export function JobPostingWizard({ open, onOpenChange }: JobWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    role: '',
    seniorityLevel: '',
    skills: [],
    projectDuration: '',
    startDate: undefined,
    budgetMin: '',
    budgetMax: '',
    workMode: '',
    softSkills: [],
    description: '',
  });
  const [newSkill, setNewSkill] = useState('');
  const [skillPriority, setSkillPriority] = useState<'must-have' | 'nice-to-have'>('must-have');
  const [newSoftSkill, setNewSoftSkill] = useState('');

  const progress = (currentStep / steps.length) * 100;

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, { name: newSkill, priority: skillPriority }],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  const addSoftSkill = () => {
    if (newSoftSkill.trim()) {
      setFormData({
        ...formData,
        softSkills: [...formData.softSkills, newSoftSkill],
      });
      setNewSoftSkill('');
    }
  };

  const removeSoftSkill = (index: number) => {
    setFormData({
      ...formData,
      softSkills: formData.softSkills.filter((_, i) => i !== index),
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Job posted:', formData);
    onOpenChange(false);
    // Reset form
    setCurrentStep(1);
    setFormData({
      title: '',
      role: '',
      seniorityLevel: '',
      skills: [],
      projectDuration: '',
      startDate: undefined,
      budgetMin: '',
      budgetMax: '',
      workMode: '',
      softSkills: [],
      description: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Post a New Job Offer</DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            {steps.map((step) => (
              <div
                key={step.id}
                className={cn(
                  'flex items-center gap-1',
                  currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <step.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{step.title}</span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="py-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Senior Frontend Developer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="role">Role Type *</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend Developer</SelectItem>
                    <SelectItem value="backend">Backend Developer</SelectItem>
                    <SelectItem value="fullstack">Full-Stack Developer</SelectItem>
                    <SelectItem value="devops">DevOps Engineer</SelectItem>
                    <SelectItem value="data">Data Engineer</SelectItem>
                    <SelectItem value="mobile">Mobile Developer</SelectItem>
                    <SelectItem value="qa">QA Engineer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="seniority">Seniority Level *</Label>
                <Select value={formData.seniorityLevel} onValueChange={(value) => setFormData({ ...formData, seniorityLevel: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select seniority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="intern">Intern</SelectItem>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="mid">Mid-Level</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="principal">Principal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, and ideal candidate..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 2: Skills & Requirements */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label>Technical Skills *</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add a skill (e.g. React, TypeScript)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Select value={skillPriority} onValueChange={(value: 'must-have' | 'nice-to-have') => setSkillPriority(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="must-have">Must-have</SelectItem>
                      <SelectItem value="nice-to-have">Nice-to-have</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={addSkill}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.skills.map((skill, index) => (
                    <Badge key={index} variant={skill.priority === 'must-have' ? 'default' : 'secondary'} className="gap-1">
                      {skill.name}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(index)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Soft Skills</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add soft skill (e.g. Communication, Leadership)"
                    value={newSoftSkill}
                    onChange={(e) => setNewSoftSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSoftSkill()}
                  />
                  <Button type="button" onClick={addSoftSkill}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.softSkills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {skill}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeSoftSkill(index)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Tip:</strong> Be specific with skills and mark must-haves carefully. 
                    This helps our AI match the most qualified candidates.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Engagement Details */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="duration">Project Duration *</Label>
                <Select value={formData.projectDuration} onValueChange={(value) => setFormData({ ...formData, projectDuration: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3 months">1-3 months</SelectItem>
                    <SelectItem value="3-6 months">3-6 months</SelectItem>
                    <SelectItem value="6-12 months">6-12 months</SelectItem>
                    <SelectItem value="12+ months">12+ months</SelectItem>
                    <SelectItem value="permanent">Permanent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => setFormData({ ...formData, startDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="workMode">Work Mode *</Label>
                <Select value={formData.workMode} onValueChange={(value) => setFormData({ ...formData, workMode: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 4: Budget & Terms */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <Label>Daily Rate Range (EUR) *</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Input
                      type="number"
                      placeholder="Min"
                      value={formData.budgetMin}
                      onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={formData.budgetMax}
                      onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200">
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    💰 <strong>Market Insight:</strong> Based on your requirements, the typical rate for a {formData.seniorityLevel} {formData.role} is €450-700/day.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 space-y-2">
                  <h4 className="font-medium text-sm">Estimated Project Cost</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{formData.projectDuration || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Daily Rate:</span>
                    <span>€{formData.budgetMin || '0'} - €{formData.budgetMax || '0'}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2 mt-2">
                    <span>Estimated Total:</span>
                    <span>€{((Number(formData.budgetMin) + Number(formData.budgetMax)) / 2 * 90).toLocaleString()} - €{((Number(formData.budgetMin) + Number(formData.budgetMax)) / 2 * 180).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Review Your Job Offer</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Job Title</Label>
                      <p className="font-medium">{formData.title || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Role</Label>
                      <p className="font-medium capitalize">{formData.role || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Seniority</Label>
                      <p className="font-medium capitalize">{formData.seniorityLevel || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Work Mode</Label>
                      <p className="font-medium capitalize">{formData.workMode || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Duration</Label>
                      <p className="font-medium">{formData.projectDuration || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Start Date</Label>
                      <p className="font-medium">
                        {formData.startDate ? format(formData.startDate, 'PPP') : 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Technical Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.skills.map((skill, index) => (
                        <Badge key={index} variant={skill.priority === 'must-have' ? 'default' : 'secondary'}>
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Soft Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.softSkills.map((skill, index) => (
                        <Badge key={index} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Budget Range</Label>
                    <p className="font-medium">€{formData.budgetMin} - €{formData.budgetMax} EUR/day</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Ready to Post</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your job offer will be submitted for admin validation. 
                        You'll receive notifications about matching candidates within 24-48 hours.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Submit Job Offer
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
