import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Edit,
  Save,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CVUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProfileUpdate?: (data: ExtractedData) => void;
}

interface ExtractedData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  skills: string[];
  certifications: string[];
}

export function CVUploadDialog({ open, onOpenChange, onProfileUpdate }: CVUploadProps) {
  const [stage, setStage] = useState<'upload' | 'processing' | 'review'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<ExtractedData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
    },
    education: [],
    experience: [],
    skills: [],
    certifications: [],
  });
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type.startsWith('image/'))) {
      setFile(droppedFile);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const simulateOCR = async () => {
    setStage('processing');
    setProgress(0);

    // Simulate OCR processing with progress
    const intervals = [20, 40, 60, 80, 100];
    for (const target of intervals) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(target);
    }

    // Simulate extracted data
    setExtractedData({
      personalInfo: {
        name: 'Alex Rivera',
        email: 'alex.rivera@email.com',
        phone: '+34 612 345 678',
        location: 'Barcelona, Spain',
      },
      education: [
        {
          degree: 'MSc Computer Science',
          institution: 'Technical University of Barcelona',
          year: '2016-2018',
        },
        {
          degree: 'BSc Software Engineering',
          institution: 'University of Valencia',
          year: '2012-2016',
        },
      ],
      experience: [
        {
          title: 'Senior Frontend Developer',
          company: 'TechCorp Solutions',
          duration: '2020 - Present',
          description: 'Leading frontend development for enterprise SaaS platform. React, TypeScript, Next.js',
        },
        {
          title: 'Frontend Developer',
          company: 'StartupXYZ',
          duration: '2018 - 2020',
          description: 'Built responsive web applications using React and modern JavaScript.',
        },
      ],
      skills: [
        'React', 'TypeScript', 'Next.js', 'TailwindCSS', 'Node.js', 
        'GraphQL', 'PostgreSQL', 'Docker', 'AWS', 'Git'
      ],
      certifications: [
        'AWS Certified Developer',
        'React Professional Certificate',
        'Scrum Master Certified'
      ],
    });

    setStage('review');
  };

  const handleConfirm = () => {
    if (onProfileUpdate) {
      onProfileUpdate(extractedData);
    }
    onOpenChange(false);
    // Reset
    setStage('upload');
    setFile(null);
    setProgress(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Upload Your CV - AI-Powered Extraction
          </DialogTitle>
          <DialogDescription>
            Upload your CV in PDF or image format. Our AI will extract and structure your information.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {/* Upload Stage */}
          {stage === 'upload' && (
            <div className="space-y-6">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={cn(
                  'border-2 border-dashed rounded-lg p-12 text-center transition-colors',
                  file ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary'
                )}
              >
                {file ? (
                  <div className="flex flex-col items-center gap-4">
                    <FileText className="h-16 w-16 text-primary" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <Button variant="outline" onClick={() => setFile(null)}>
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <Upload className="h-16 w-16 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Drop your CV here or click to browse</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Supports PDF, PNG, JPG (Max 10MB)
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleFileChange}
                      className="max-w-xs"
                    />
                  </div>
                )}
              </div>

              {file && (
                <Button className="w-full" size="lg" onClick={simulateOCR}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Extract Information with AI
                </Button>
              )}

              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>What happens next?</strong><br />
                    1. Our AI scans your CV and extracts information<br />
                    2. You review and edit the extracted data<br />
                    3. Confirm to auto-fill your profile
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Processing Stage */}
          {stage === 'processing' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">Processing Your CV...</h3>
                <p className="text-muted-foreground">Our AI is extracting and structuring your information</p>
              </div>
              <div className="w-full max-w-md space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {progress < 40 && 'Reading document...'}
                    {progress >= 40 && progress < 70 && 'Extracting data...'}
                    {progress >= 70 && progress < 100 && 'Structuring information...'}
                    {progress === 100 && 'Complete!'}
                  </span>
                  <span>{progress}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Review Stage */}
          {stage === 'review' && (
            <ScrollArea className="h-[500px] pr-4">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="certs">Certifications</TabsTrigger>
                </TabsList>

                {/* Personal Info */}
                <TabsContent value="personal" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center justify-between">
                        Personal Information
                        <Badge variant="outline" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Extracted
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label>Full Name</Label>
                        <Input
                          value={extractedData.personalInfo.name}
                          onChange={(e) => setExtractedData({
                            ...extractedData,
                            personalInfo: { ...extractedData.personalInfo, name: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          value={extractedData.personalInfo.email}
                          onChange={(e) => setExtractedData({
                            ...extractedData,
                            personalInfo: { ...extractedData.personalInfo, email: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          value={extractedData.personalInfo.phone}
                          onChange={(e) => setExtractedData({
                            ...extractedData,
                            personalInfo: { ...extractedData.personalInfo, phone: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input
                          value={extractedData.personalInfo.location}
                          onChange={(e) => setExtractedData({
                            ...extractedData,
                            personalInfo: { ...extractedData.personalInfo, location: e.target.value }
                          })}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Education */}
                <TabsContent value="education" className="space-y-4">
                  {extractedData.education.map((edu, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6 space-y-3">
                        <div>
                          <Label>Degree</Label>
                          <Input value={edu.degree} />
                        </div>
                        <div>
                          <Label>Institution</Label>
                          <Input value={edu.institution} />
                        </div>
                        <div>
                          <Label>Year</Label>
                          <Input value={edu.year} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Experience */}
                <TabsContent value="experience" className="space-y-4">
                  {extractedData.experience.map((exp, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6 space-y-3">
                        <div>
                          <Label>Job Title</Label>
                          <Input value={exp.title} />
                        </div>
                        <div>
                          <Label>Company</Label>
                          <Input value={exp.company} />
                        </div>
                        <div>
                          <Label>Duration</Label>
                          <Input value={exp.duration} />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Input value={exp.description} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Skills */}
                <TabsContent value="skills">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-wrap gap-2">
                        {extractedData.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Certifications */}
                <TabsContent value="certs">
                  <Card>
                    <CardContent className="pt-6 space-y-2">
                      {extractedData.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 rounded bg-muted">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{cert}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </ScrollArea>
          )}
        </div>

        {/* Footer Actions */}
        {stage === 'review' && (
          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="outline" onClick={() => setStage('upload')}>
              Upload Different CV
            </Button>
            <Button onClick={handleConfirm} size="lg">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirm & Fill Profile
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
