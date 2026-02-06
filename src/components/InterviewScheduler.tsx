import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  MapPin,
  Users,
  Send,
  Check
} from 'lucide-react';
import { format } from 'date-fns';

interface InterviewSchedulerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateName: string;
  jobTitle: string;
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

export function InterviewScheduler({ 
  open, 
  onOpenChange, 
  candidateName, 
  jobTitle 
}: InterviewSchedulerProps) {
  const [step, setStep] = useState<'details' | 'calendar' | 'confirm'>('details');
  const [interviewType, setInterviewType] = useState<'video' | 'onsite'>('video');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [duration, setDuration] = useState<string>('60');
  const [location, setLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [interviewers, setInterviewers] = useState<string[]>(['']);

  const handleSchedule = () => {
    console.log('Scheduling interview:', {
      candidateName,
      jobTitle,
      type: interviewType,
      date: selectedDate,
      time: selectedTime,
      duration,
      location,
      notes,
      interviewers
    });
    
    // Reset and close
    setStep('details');
    onOpenChange(false);
    
    // Show success message
    alert('Interview scheduled successfully! Calendar invites will be sent to all participants.');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-primary" />
            Schedule Interview
          </DialogTitle>
          <DialogDescription>
            Schedule an interview with {candidateName} for {jobTitle}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Interview Details */}
        {step === 'details' && (
          <div className="space-y-6 py-4">
            <div>
              <Label>Interview Type *</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <Card
                  className={`cursor-pointer transition-all ${interviewType === 'video' ? 'border-primary bg-primary/5' : ''}`}
                  onClick={() => setInterviewType('video')}
                >
                  <CardContent className="pt-6 text-center">
                    <Video className={`h-8 w-8 mx-auto mb-2 ${interviewType === 'video' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <p className="font-medium">Video Call</p>
                    <p className="text-xs text-muted-foreground mt-1">Google Meet / Zoom</p>
                  </CardContent>
                </Card>
                <Card
                  className={`cursor-pointer transition-all ${interviewType === 'onsite' ? 'border-primary bg-primary/5' : ''}`}
                  onClick={() => setInterviewType('onsite')}
                >
                  <CardContent className="pt-6 text-center">
                    <MapPin className={`h-8 w-8 mx-auto mb-2 ${interviewType === 'onsite' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <p className="font-medium">On-site</p>
                    <p className="text-xs text-muted-foreground mt-1">In-person meeting</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {interviewType === 'onsite' && (
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="Enter office address or meeting room"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            )}

            <div>
              <Label htmlFor="duration">Duration *</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Additional Interviewers</Label>
              <div className="space-y-2 mt-2">
                {interviewers.map((interviewer, index) => (
                  <Input
                    key={index}
                    placeholder="Email address"
                    value={interviewer}
                    onChange={(e) => {
                      const newInterviewers = [...interviewers];
                      newInterviewers[index] = e.target.value;
                      setInterviewers(newInterviewers);
                    }}
                  />
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInterviewers([...interviewers, ''])}
                >
                  + Add Interviewer
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Interview Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any special instructions or topics to cover..."
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={() => setStep('calendar')}>
                Next: Choose Date & Time
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Calendar Selection */}
        {step === 'calendar' && (
          <div className="space-y-6 py-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="mb-2 block">Select Date *</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>

              <div>
                <Label className="mb-2 block">Select Time *</Label>
                <ScrollArea className="h-[280px] rounded-md border p-4">
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className="w-full"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {time}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {selectedDate && selectedTime && (
              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="h-4 w-4 text-blue-600" />
                    <p className="font-medium text-sm">Selected Date & Time</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}
                    <Badge variant="secondary" className="ml-2">{duration} min</Badge>
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep('details')}>
                Back
              </Button>
              <Button 
                onClick={() => setStep('confirm')}
                disabled={!selectedDate || !selectedTime}
              >
                Next: Review & Send
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 'confirm' && selectedDate && (
          <div className="space-y-6 py-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Interview Summary</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Candidate</p>
                      <p className="text-sm text-muted-foreground">{candidateName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Date & Time</p>
                      <p className="text-sm text-muted-foreground">
                        {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">{duration} minutes</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    {interviewType === 'video' ? (
                      <Video className="h-5 w-5 text-muted-foreground mt-0.5" />
                    ) : (
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {interviewType === 'video' ? 'Video Call' : 'Location'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {interviewType === 'video' 
                          ? 'Meeting link will be generated' 
                          : location || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  {interviewers.filter(e => e).length > 0 && (
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Additional Interviewers</p>
                        <div className="space-y-1 mt-1">
                          {interviewers.filter(e => e).map((email, idx) => (
                            <p key={idx} className="text-sm text-muted-foreground">{email}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {notes && (
                    <div className="pt-3 border-t">
                      <p className="text-sm font-medium mb-1">Notes</p>
                      <p className="text-sm text-muted-foreground">{notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-2">
                  <Send className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Ready to Send</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Calendar invites will be sent to all participants via email. 
                      {interviewType === 'video' && ' A video meeting link will be generated automatically.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep('calendar')}>
                Back
              </Button>
              <Button onClick={handleSchedule} size="lg">
                <Send className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Import ScrollArea from shadcn
import { ScrollArea } from '@/components/ui/scroll-area';
