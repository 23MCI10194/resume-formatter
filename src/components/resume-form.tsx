'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { ResumeDataSchema, type ResumeData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Trash2, PlusCircle, Download, RotateCcw, User, Briefcase, GraduationCap, Star, MapPin, FileQuestion, UserCheck } from 'lucide-react';

interface ResumeFormProps {
  initialData: ResumeData;
  onReset: () => void;
  onLoadFromStorage: (data: ResumeData) => void;
}

export default function ResumeForm({ initialData, onReset, onLoadFromStorage }: ResumeFormProps) {
  const form = useForm<ResumeData>({
    resolver: zodResolver(ResumeDataSchema),
    defaultValues: initialData,
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control: form.control,
    name: 'skills',
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control: form.control,
    name: 'education',
  });

  const { fields: employmentFields, append: appendEmployment, remove: removeEmployment } = useFieldArray({
    control: form.control,
    name: 'employmentHistory',
  });

  useEffect(() => {
    try {
        const savedData = localStorage.getItem('resumeFormData');
        if (savedData) {
            const parsedData = ResumeDataSchema.parse(JSON.parse(savedData));
             if (parsedData && parsedData.personalDetails.fullName) {
                form.reset(parsedData);
                onLoadFromStorage(parsedData);
                return;
            }
        }
    } catch (e) {
      // Fallback to initialData if localStorage is corrupt
      form.reset(initialData);
    }
    form.reset(initialData);
  }, []);

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem('resumeFormData', JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => window.print())} className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-2 no-print">
            <Button type="button" onClick={() => window.print()}>
              <Download /> Download as PDF
            </Button>
            <Button type="button" variant="outline" onClick={onReset}>
              <RotateCcw /> Start Over
            </Button>
        </div>
        
        <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3', 'item-4', 'item-5', 'item-6', 'item-7']} className="w-full">
            
            <AccordionItem value="item-1">
              <AccordionTrigger><User className="mr-2" /> Basic Information</AccordionTrigger>
              <AccordionContent>
                <Card className="printable-card">
                  <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="personalDetails.fullName" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="personalDetails.contactDetails.email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="personalDetails.contactDetails.phone" render={({ field }) => ( <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="+1 123-456-7890" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger><Star className="mr-2" /> Skills</AccordionTrigger>
              <AccordionContent>
                <Card className="printable-card">
                  <CardContent className="pt-6 space-y-4">
                    {skillFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-end p-3 rounded-md border">
                        <FormField control={form.control} name={`skills.${index}.skillName`} render={({ field }) => ( <FormItem className="flex-grow"><FormLabel>Skill</FormLabel><FormControl><Input placeholder="e.g. React" {...field} /></FormControl></FormItem> )} />
                        <FormField control={form.control} name={`skills.${index}.rating`} render={({ field }) => ( <FormItem><FormLabel>Rating (1-5)</FormLabel><Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}><FormControl><SelectTrigger><SelectValue placeholder="Rate" /></SelectTrigger></FormControl><SelectContent><SelectItem value="1">1</SelectItem><SelectItem value="2">2</SelectItem><SelectItem value="3">3</SelectItem><SelectItem value="4">4</SelectItem><SelectItem value="5">5</SelectItem></SelectContent></Select></FormItem> )} />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeSkill(index)} className="no-print"><Trash2 className="text-destructive" /></Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => appendSkill({ skillName: '', rating: 3 })} className="no-print"><PlusCircle className="mr-2 h-4 w-4" /> Add Skill</Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger><GraduationCap className="mr-2" /> Education</AccordionTrigger>
              <AccordionContent>
                <Card className="printable-card">
                  <CardContent className="pt-6 space-y-4">
                    {educationFields.map((field, index) => (
                      <div key={field.id} className="space-y-2 p-3 rounded-md border">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold">Education #{index + 1}</h4>
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeEducation(index)} className="no-print"><Trash2 className="text-destructive" /></Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => ( <FormItem><FormLabel>Degree</FormLabel><FormControl><Input placeholder="e.g. Bachelor of Science" {...field} /></FormControl></FormItem> )} />
                            <FormField control={form.control} name={`education.${index}.major`} render={({ field }) => ( <FormItem><FormLabel>Major</FormLabel><FormControl><Input placeholder="e.g. Computer Science" {...field} /></FormControl></FormItem> )} />
                            <FormField control={form.control} name={`education.${index}.university`} render={({ field }) => ( <FormItem><FormLabel>University</FormLabel><FormControl><Input placeholder="e.g. State University" {...field} /></FormControl></FormItem> )} />
                            <FormField control={form.control} name={`education.${index}.graduationDate`} render={({ field }) => ( <FormItem><FormLabel>Graduation Date</FormLabel><FormControl><Input placeholder="e.g. May 2020" {...field} /></FormControl></FormItem> )} />
                        </div>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => appendEducation({ degree: '', major: '', university: '', graduationDate: '' })} className="no-print"><PlusCircle className="mr-2 h-4 w-4" /> Add Education</Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger><Briefcase className="mr-2" /> Work History</AccordionTrigger>
              <AccordionContent>
                <Card className="printable-card">
                   <CardContent className="pt-6 space-y-4">
                     {employmentFields.map((field, index) => (
                        <div key={field.id} className="space-y-2 p-3 rounded-md border">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold">Experience #{index + 1}</h4>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeEmployment(index)} className="no-print"><Trash2 className="text-destructive" /></Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name={`employmentHistory.${index}.company`} render={({ field }) => ( <FormItem><FormLabel>Company</FormLabel><FormControl><Input placeholder="e.g. Tech Corp" {...field} /></FormControl></FormItem> )} />
                            <FormField control={form.control} name={`employmentHistory.${index}.role`} render={({ field }) => ( <FormItem><FormLabel>Role</FormLabel><FormControl><Input placeholder="e.g. Software Engineer" {...field} /></FormControl></FormItem> )} />
                            <FormField control={form.control} name={`employmentHistory.${index}.startDate`} render={({ field }) => ( <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input placeholder="e.g. June 2020" {...field} /></FormControl></FormItem> )} />
                            <FormField control={form.control} name={`employmentHistory.${index}.endDate`} render={({ field }) => ( <FormItem><FormLabel>End Date</FormLabel><FormControl><Input placeholder="e.g. Present" {...field} /></FormControl></FormItem> )} />
                          </div>
                        </div>
                      ))}
                     <Button type="button" variant="outline" size="sm" onClick={() => appendEmployment({ company: '', role: '', startDate: '', endDate: '' })} className="no-print"><PlusCircle className="mr-2 h-4 w-4" /> Add Experience</Button>
                   </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger><FileQuestion className="mr-2" /> Additional Details</AccordionTrigger>
              <AccordionContent>
                <Card className="printable-card">
                  <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="experience.totalExperience" render={({ field }) => ( <FormItem><FormLabel>Total Experience</FormLabel><FormControl><Input placeholder="e.g. 5 years" {...field} /></FormControl></FormItem> )} />
                    <FormField control={form.control} name="experience.relevantExperience" render={({ field }) => ( <FormItem><FormLabel>Relevant Experience</FormLabel><FormControl><Input placeholder="e.g. 3 years in web dev" {...field} /></FormControl></FormItem> )} />
                    <FormField control={form.control} name="location.currentLocation" render={({ field }) => ( <FormItem><FormLabel>Current Location</FormLabel><FormControl><Input placeholder="e.g. San Francisco, CA" {...field} /></FormControl></FormItem> )} />
                    <FormField control={form.control} name="location.preferredLocation" render={({ field }) => ( <FormItem><FormLabel>Preferred Location</FormLabel><FormControl><Input placeholder="e.g. Remote" {...field} /></FormControl></FormItem> )} />
                    <FormField control={form.control} name="additionalDetails.noticePeriod" render={({ field }) => ( <FormItem><FormLabel>Notice Period</FormLabel><FormControl><Input placeholder="e.g. 2 weeks" {...field} /></FormControl></FormItem> )} />
                    <FormField control={form.control} name="additionalDetails.currentOffer" render={({ field }) => ( <FormItem><FormLabel>Current Offer</FormLabel><FormControl><Input placeholder="e.g. N/A" {...field} /></FormControl></FormItem> )} />
                    <FormField control={form.control} name="additionalDetails.reasonForChange" render={({ field }) => ( <FormItem className="md:col-span-2"><FormLabel>Reason for Change</FormLabel><FormControl><Textarea placeholder="Seeking new challenges..." {...field} /></FormControl></FormItem> )} />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger><FileQuestion className="mr-2" /> Company Specific Questions</AccordionTrigger>
              <AccordionContent>
                 <Card className="printable-card">
                  <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-1 gap-4">
                    <FormField control={form.control} name="deloitteSpecific.isAuthorized" render={({ field }) => ( <FormItem><FormLabel>Are you legally authorized to work in the country for which you are applying?</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger></FormControl><SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem><SelectItem value="na">N/A</SelectItem></SelectContent></Select></FormItem> )} />
                    <FormField control={form.control} name="deloitteSpecific.previouslyEmployed" render={({ field }) => ( <FormItem><FormLabel>Have you ever been employed by this company before?</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger></FormControl><SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem><SelectItem value="na">N/A</SelectItem></SelectContent></Select></FormItem> )} />
                    <FormField control={form.control} name="deloitteSpecific.needsSponsorship" render={({ field }) => ( <FormItem><FormLabel>Do you require sponsorship for employment visa status?</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger></FormControl><SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem><SelectItem value="na">N/A</SelectItem></SelectContent></Select></FormItem> )} />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7">
              <AccordionTrigger><UserCheck className="mr-2" /> Recruiter Details</AccordionTrigger>
              <AccordionContent>
                 <Card className="printable-card">
                  <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="recruiterDetails.name" render={({ field }) => ( <FormItem><FormLabel>Recruiter Name</FormLabel><FormControl><Input placeholder="Jane Smith" {...field} /></FormControl></FormItem> )} />
                    <FormField control={form.control} name="recruiterDetails.email" render={({ field }) => ( <FormItem><FormLabel>Recruiter Email</FormLabel><FormControl><Input type="email" placeholder="jane.smith@recruiter.com" {...field} /></FormControl></FormItem> )} />
                    <FormField control={form.control} name="recruiterDetails.submissionDate" render={({ field }) => ( <FormItem><FormLabel>Submission Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem> )} />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
        </Accordion>
      </form>
    </Form>
  );
}
