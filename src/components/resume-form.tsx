'use client';

import { useForm, useFieldArray, Controller, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { ResumeDataSchema, type ResumeData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form } from '@/components/ui/form';
import { Printer, RotateCcw, FileText, Loader2 } from 'lucide-react';
import ImageUploader from './image-uploader';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { saveAs } from 'file-saver';
import { generateWordDocument } from '@/app/actions/download-word';
import { useToast } from '@/hooks/use-toast';

interface ResumeFormProps {
  initialData: ResumeData;
  onReset: () => void;
}

const FormInput = ({ name, control }: { name: any, control: any }) => (
    <Controller
        control={control}
        name={name}
        render={({ field }) => (
            <Input {...field} value={field.value || ''} className="h-full w-full bg-transparent border-none rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm printable-input" />
        )}
    />
);

const FormTextarea = ({ name, control, rows = 3 }: { name: any, control: any, rows?: number }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { field } = useController({ name, control });

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [field.value]);

  return (
    <>
      <Textarea
        {...field}
        ref={textareaRef}
        value={field.value || ''}
        className="w-full bg-transparent border-none rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm printable-input resize-none overflow-hidden print-hide"
        rows={rows}
        onChange={(e) => {
          field.onChange(e);
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${e.target.scrollHeight}px`;
          }
        }}
      />
      <div className="hidden print-show whitespace-pre-wrap text-sm printable-input">{field.value}</div>
    </>
  );
};


const FormSelect = ({ name, control, options }: { name: any, control: any, options: string[] }) => (
    <Controller
        control={control}
        name={name}
        render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || 'N/A'}>
                <SelectTrigger className="h-full w-full bg-transparent border-none rounded-none focus:ring-0 focus:ring-offset-0 focus:shadow-none text-sm printable-input">
                    <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                    {options.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                </SelectContent>
            </Select>
        )}
    />
);

const FormImageUploader = ({ name, control }: { name: any, control: any }) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value } }) => (
      <ImageUploader value={value} onChange={onChange} />
    )}
  />
);

const FormProject = ({ control, index }: { control: any, index: number }) => {
  return (
    <div className="grid grid-cols-[150px_1fr] items-center">
      <span className="font-bold p-2">Project Name:</span>
      <FormInput name={`professionalExperience.projects.${index}.projectName`} control={control} />

      <span className="font-bold p-2">Client:</span>
      <FormInput name={`professionalExperience.projects.${index}.client`} control={control} />

      <span className="font-bold p-2">Duration:</span>
      <FormInput name={`professionalExperience.projects.${index}.duration`} control={control} />

      <span className="font-bold p-2 self-start mt-2">Roles & Responsibilities:</span>
      <FormTextarea name={`professionalExperience.projects.${index}.rolesAndResponsibilities`} control={control} rows={2} />

      <span className="font-bold p-2 self-start mt-2">Details:</span>
      <FormTextarea name={`professionalExperience.projects.${index}.details`} control={control} rows={4} />
    </div>
  );
};


export default function ResumeForm({ initialData, onReset }: ResumeFormProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const form = useForm<ResumeData>({
    resolver: zodResolver(ResumeDataSchema),
    defaultValues: initialData,
  });
  
  const { control, watch } = form;
  const printRef = useRef<HTMLDivElement>(null);

  const { fields: skillFields } = useFieldArray({ control, name: "skillsRating" });
  const { fields: projectFields } = useFieldArray({ control, name: "professionalExperience.projects" });

  useEffect(() => {
    form.reset(initialData);
  }, [initialData, form]);

  const watchedValues = watch();
  useEffect(() => {
    localStorage.setItem('resumeFormData', JSON.stringify(watchedValues));
  }, [watchedValues]);
  
  const handlePrint = () => {
    window.print();
  }
  
  const handleWordDownload = async () => {
    if (!printRef.current) return;
    setIsDownloading(true);

    try {
      // Clone the printable element to modify it without affecting the displayed form
      const printableElement = printRef.current.cloneNode(true) as HTMLDivElement;

      // Replace input fields with their values for DOCX export
      printableElement.querySelectorAll('input, textarea').forEach(el => {
          const input = el as HTMLInputElement | HTMLTextAreaElement;
          const value = input.value || ' ';
          const span = document.createElement('span');
          span.textContent = value;
          span.className = input.className;
          input.parentNode?.replaceChild(span, input);
      });
      
      // Replace select fields with their values for DOCX export
      printableElement.querySelectorAll('[role="combobox"]').forEach(el => {
          const trigger = el as HTMLElement;
          const value = trigger.querySelector('span')?.textContent || ' ';
          const span = document.createElement('span');
          span.textContent = value;
          span.className = trigger.className;
          trigger.parentNode?.replaceChild(span, trigger);
      });

      // Remove the non-printable image upload areas
      printableElement.querySelectorAll('.no-export').forEach(el => el.remove());

      const base64 = await generateWordDocument(printableElement.outerHTML);
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      
      saveAs(blob, `${initialData.basicInfo.candidateName || 'resume'}-details.docx`);
      
    } catch(error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "There was a problem generating the Word document. Please try again.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Form {...form}>
        <div className="space-y-4 bg-white p-4 sm:p-6 rounded-lg shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 no-print">
                <div className="flex gap-2">
                    <Button type="button" onClick={handlePrint}>
                      <Printer className="mr-2 h-4 w-4" /> Print / Download PDF
                    </Button>
                    <Button type="button" onClick={handleWordDownload} disabled={isDownloading}>
                      {isDownloading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FileText className="mr-2 h-4 w-4" />
                      )}
                      Download as Word
                    </Button>
                    <Button type="button" variant="outline" onClick={onReset}>
                      <RotateCcw className="mr-2 h-4 w-4" /> Start Over
                    </Button>
                </div>
            </div>

            <div ref={printRef} className={"printable-area printable-card bg-white p-2"}>
              <div className="relative">
                <table 
                    className="w-full border-collapse border-2 border-black printable-table"
                >
                    <tbody>
                      {/* Basic Information Header */}
                      <tr>
                        <td colSpan={6} className="printable-section-header">Basic Information</td>
                        <td className="border border-black align-top p-1 bg-[#F5BCA9] no-export">
                           <FormImageUploader name="basicInfo.passportPhotoDataUri" control={control} />
                        </td>
                      </tr>

                      {/* Row 1 */}
                      <tr>
                        <td className="font-bold border border-black p-2">Job Posting ID</td>
                        <td colSpan={2} className="border border-black"><FormInput name="basicInfo.jobPostingId" control={control} /></td>
                        <td className="font-bold border border-black p-2">Job Seeker ID</td>
                        <td colSpan={3} className="border border-black"><FormInput name="basicInfo.jobSeekerId" control={control} /></td>
                      </tr>

                       {/* Row 2 */}
                      <tr>
                        <td className="font-bold border border-black p-2">Vendor Name</td>
                        <td colSpan={2} className="border border-black"><FormInput name="basicInfo.vendorName" control={control} /></td>
                        <td className="font-bold border border-black p-2">Position Applied</td>
                        <td colSpan={3} className="border border-black"><FormInput name="basicInfo.positionApplied" control={control} /></td>
                      </tr>

                      {/* Row 3 */}
                       <tr>
                        <td className="font-bold border border-black p-2">Requisition Received Date</td>
                        <td colSpan={2} className="border border-black"><FormInput name="basicInfo.requisitionReceivedDate" control={control} /></td>
                        <td className="font-bold border border-black p-2">Contact No</td>
                        <td colSpan={3} className="border border-black"><FormInput name="basicInfo.contactNo" control={control} /></td>
                      </tr>
                      
                       {/* Row 4 */}
                       <tr>
                        <td className="font-bold border border-black p-2">Candidate Name as per PAN</td>
                        <td colSpan={2} className="border border-black"><FormInput name="basicInfo.candidateName" control={control} /></td>
                        <td className="font-bold border border-black p-2">Total Experience</td>
                        <td colSpan={3} className="border border-black"><FormInput name="basicInfo.totalExperience" control={control} /></td>
                      </tr>

                       {/* Row 5 */}
                       <tr>
                        <td className="font-bold border border-black p-2">Email</td>
                        <td colSpan={2} className="border border-black"><FormInput name="basicInfo.email" control={control} /></td>
                        <td className="font-bold border border-black p-2">Relevant Experience</td>
                        <td colSpan={3} className="border border-black"><FormInput name="basicInfo.relevantExperience" control={control} /></td>
                      </tr>

                      {/* Row 6 */}
                      <tr>
                        <td className="font-bold border border-black p-2">Current Location</td>
                        <td colSpan={2} className="border border-black"><FormInput name="basicInfo.currentLocation" control={control} /></td>
                        <td className="font-bold border border-black p-2">Relocation (Yes/No)</td>
                        <td colSpan={3} className="border border-black"><FormSelect name="basicInfo.relocation" control={control} options={['Yes', 'No', 'N/A']} /></td>
                      </tr>
                      
                      {/* Row 7 */}
                      <tr>
                        <td className="font-bold border border-black p-2">Preferred Location</td>
                        <td colSpan={2} className="border border-black"><FormInput name="basicInfo.preferredLocation" control={control} /></td>
                        <td className="font-bold border border-black p-2">Work from office/ Work from Home/Both</td>
                        <td colSpan={3} className="border border-black"><FormSelect name="basicInfo.workPreference" control={control} options={['Office', 'Home', 'Both', 'N/A']} /></td>
                      </tr>
                      
                      {/* Education and Employment Details Header */}
                      <tr>
                        <td colSpan={3} className="printable-section-header">Education Details</td>
                        <td colSpan={4} className="printable-section-header">Employment Details</td>
                      </tr>
                      
                      <tr>
                        {/* Education Details Sub-Header */}
                        <td className="border border-black text-center p-2 font-bold">Degree</td>
                        <td className="border border-black text-center p-2 font-bold">From</td>
                        <td className="border border-black text-center p-2 font-bold">To</td>

                        {/* Employment Details Sub-Header */}
                        <td colSpan={2} className="border border-black text-center p-2 font-bold">Employment Details</td>
                        <td className="border border-black text-center p-2 font-bold">From</td>
                        <td className="border border-black text-center p-2 font-bold">To</td>
                      </tr>
                      
                      <tr>
                          {/* Bachelors and Current Employer */}
                          <td className="border border-black"><div className='flex items-center'><span className='p-2 font-bold'>Bachelor's:</span><FormInput name="educationDetails.bachelors.degree" control={control} /></div></td>
                          <td className="border border-black"><FormInput name="educationDetails.bachelors.from" control={control} /></td>
                          <td className="border border-black"><FormInput name="educationDetails.bachelors.to" control={control} /></td>

                          <td colSpan={2} className="border border-black"><div className='flex items-center h-full'><span className='p-2 font-bold'>Current / Last Employer:</span><FormInput name="employmentDetails.currentEmployer" control={control} /></div></td>
                          <td className="border border-black"><FormInput name="employmentDetails.from" control={control} /></td>
                          <td className="border border-black"><FormInput name="employmentDetails.to" control={control} /></td>
                      </tr>

                      <tr>
                          {/* Masters and Role */}
                          <td className="border border-black"><div className='flex items-center'><span className='p-2 font-bold'>Master's:</span><FormInput name="educationDetails.masters.degree" control={control} /></div></td>
                          <td className="border border-black"><FormInput name="educationDetails.masters.from" control={control} /></td>
                          <td className="border border-black"><FormInput name="educationDetails.masters.to" control={control} /></td>

                          <td colSpan={4} className="border border-black"><div className='flex items-center'><span className='p-2 font-bold'>Role FTE/ Contract with Current or Last Employer:</span><FormInput name="employmentDetails.employmentType" control={control} /></div></td>
                      </tr>
                      
                      <tr>
                          {/* Certifications and Overseas Exp */}
                          <td colSpan={3} className="border border-black"><div className='flex items-center'><span className='p-2 font-bold'>Others (Any Certifications):</span><FormInput name="educationDetails.certifications" control={control} /></div></td>
                          <td colSpan={4} className="border border-black"><div className='flex items-center'><span className='p-2 font-bold'>Overseas Experience If Any (Yes/No):</span><FormSelect name="employmentDetails.overseasExperience" control={control} options={['Yes', 'No', 'N/A']} /></div></td>
                      </tr>

                      <tr>
                          {/* Contract Awareness and Notice Period */}
                          <td colSpan={3} className="border border-black"><div className='flex items-center'><span className='p-2 font-bold'>Awareness about Contract Role (Yes/No):</span><FormSelect name="educationDetails.awarenessAboutContractRole" control={control} options={['Yes', 'No', 'N/A']} /></div></td>
                          <td colSpan={4} className="border border-black"><div className='flex items-center'><span className='p-2 font-bold'>Notice period as per company policy / Serving notice period:</span><FormInput name="employmentDetails.noticePeriod" control={control} /></div></td>
                      </tr>

                       <tr>
                          {/* Holding Offers and Bench Profile */}
                          <td colSpan={3} className="border border-black"><div className='flex items-center'><span className='p-2 font-bold'>Holding any other offers (Yes/No):</span><FormSelect name="educationDetails.holdingOtherOffers" control={control} options={['Yes', 'No', 'N/A']} /></div></td>
                          <td colSpan={4} className="border border-black"><div className='flex items-center'><span className='p-2 font-bold'>Bench/ Market Profile:</span><FormInput name="employmentDetails.benchMarketProfile" control={control} /></div></td>
                      </tr>

                       <tr>
                          {/* Reason for Change and Shifts */}
                          <td colSpan={3} className="border border-black"><div className='flex items-center'><span className='p-2 font-bold'>Reason for Change:</span><FormInput name="educationDetails.reasonForChange" control={control} /></div></td>
                          <td colSpan={4} className="border border-black"><div className='flex items-center'><span className='p-2 font-bold'>Shifts (Yes/No):</span><FormSelect name="employmentDetails.shifts" control={control} options={['Yes', 'No', 'N/A']} /></div></td>
                      </tr>


                       {/* Skills Header */}
                      <tr>
                        <td colSpan={7} className="printable-section-header">Skills Rating (1-Poor & 5-Excellent)</td>
                      </tr>
                      <tr className="font-bold">
                        <td className="text-center border border-black p-2" colSpan={2}>Top 3 Skills (Relevant/ Others)</td>
                        <td className="text-center border border-black p-2">No of Projects Handled</td>
                        <td className="text-center border border-black p-2" colSpan={2}>Relevant Experience in Skills</td>
                        <td className="text-center border border-black p-2">Candidate Rating</td>
                        <td className="text-center border border-black p-2">Recruiter Rating</td>
                      </tr>
                      {skillFields.map((field, index) => (
                        <tr key={field.id}>
                            <td className="h-8 border border-black" colSpan={2}><FormInput name={`skillsRating.${index}.skill`} control={control} /></td>
                            <td className="border border-black"><FormInput name={`skillsRating.${index}.projectsHandled`} control={control} /></td>
                            <td className="border border-black" colSpan={2}><FormInput name={`skillsRating.${index}.relevantExperience`} control={control} /></td>
                            <td className="border border-black"><FormInput name={`skillsRating.${index}.candidateRating`} control={control} /></td>
                            <td className="border border-black">{index === 0 ? <FormInput name={`recruiterDetails.recruiterRating`} control={control} /> : ''}</td>
                        </tr>
                      ))}
                      <tr>
                        <td className="font-bold border border-black p-2" colSpan={3}><div className="flex items-center">Communication (Poor / Average / Excellent) <FormSelect name="otherInfo.communicationSkills" control={control} options={['Poor', 'Average', 'Excellent', 'N/A']} /></div></td>
                        <td className="font-bold border border-black p-2" colSpan={4}><div className="flex items-center">Listening Skills (Poor / Average / Excellent) <FormSelect name="otherInfo.listeningSkills" control={control} options={['Poor', 'Average', 'Excellent', 'N/A']} /></div></td>
                      </tr>
                      
                      {/* Other Info */}
                      <tr>
                        <td colSpan={7} className="printable-section-header">Other Information</td>
                      </tr>
                       <tr>
                        <td colSpan={2} className="font-bold border border-black p-2">Earlier worked with Deloitte (Yes/No)</td>
                        <td className="border border-black"><FormSelect name="otherInfo.earlierWorkedWithDeloitte" control={control} options={['Yes', 'No', 'N/A']} /></td>
                        <td colSpan={3} className="font-bold border border-black p-2">If Yes, Tenure (From/To)</td>
                        <td className="border border-black"><FormInput name="otherInfo.tenure" control={control}/></td>
                      </tr>
                       <tr>
                        <td colSpan={2} className="font-bold border border-black p-2">If Yes, Deloitte (FTE/Contract)</td>
                        <td className="border border-black"><FormInput name="otherInfo.deloitteFteContract" control={control}/></td>
                        <td colSpan={3} className="font-bold border border-black p-2">If Yes, Reason to Leave Deloitte</td>
                        <td className="border border-black"><FormInput name="otherInfo.reasonToLeaveDeloitte" control={control}/></td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="font-bold border border-black p-2">If Yes, Deloitte Entity</td>
                        <td className="border border-black"><FormInput name="otherInfo.deloitteEntity" control={control}/></td>
                        <td colSpan={3} className="font-bold border border-black p-2">Relevant documents for further process</td>
                        <td className="border border-black"></td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="font-bold border border-black p-2">Any plan for a long leave for next 6 months</td>
                        <td className="border border-black"><FormSelect name="otherInfo.longLeavePlan" control={control} options={['Yes', 'No', 'N/A']} /></td>
                        <td colSpan={3} className="font-bold border border-black p-2">Any other Input / Comments / Concerns:</td>
                        <td className="border border-black"><FormInput name="otherInfo.otherInput" control={control}/></td>
                      </tr>

                       {/* Recruiter Details */}
                      <tr>
                        <td colSpan={7} className="printable-section-header">Recruiter Details</td>
                      </tr>
                      <tr>
                        <td className="font-bold border border-black p-2" colSpan={2}>Deloitte Recruiter</td>
                        <td className="border border-black" colSpan={2}><FormInput name="recruiterDetails.deloitteRecruiter" control={control}/></td>
                        <td className="font-bold border border-black p-2" colSpan={2}>Vendor Recruiter Name</td>
                        <td className="border border-black"><FormInput name="recruiterDetails.vendorRecruiterName" control={control}/></td>
                      </tr>
                      <tr>
                        <td className="font-bold border border-black p-2" colSpan={2}>Deloitte CRM</td>
                        <td className="border border-black" colSpan={2}><FormInput name="recruiterDetails.deloitteCrm" control={control}/></td>
                        <td className="font-bold border border-black p-2" colSpan={2}>Vendor Coordinator</td>
                        <td className="border border-black"><FormInput name="recruiterDetails.vendorCoordinator" control={control}/></td>
                      </tr>

                      {/* Verification Details */}
                      <tr>
                        <td colSpan={7} className="printable-section-header">Verification Details</td>
                      </tr>
                      <tr>
                        <td colSpan={7} className="border border-black p-2 no-export">
                          <FormImageUploader name="verificationDetails.panCardDataUri" control={control} />
                        </td>
                      </tr>
                      
                      {/* Spacer Row */}
                      <tr>
                        <td colSpan={7} className="p-2"></td>
                      </tr>

                      {/* Professional Experience */}
                      <tr>
                        <td colSpan={7} className="printable-section-header">Professional Summary</td>
                      </tr>
                      <tr>
                        <td colSpan={7} className="border border-black p-2">
                           <FormTextarea name="professionalExperience.professionalSummary" control={control} rows={8} />
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={7} className="printable-section-header">Key Skills</td>
                      </tr>
                      <tr>
                        <td colSpan={7} className="border border-black p-2">
                            <FormTextarea name="professionalExperience.keySkills" control={control} rows={5} />
                        </td>
                      </tr>
                       <tr>
                        <td colSpan={7} className="printable-section-header">Development Tools</td>
                      </tr>
                      <tr>
                        <td colSpan={7} className="border border-black p-2">
                            <FormTextarea name="professionalExperience.developmentTools" control={control} rows={5} />
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={7} className="printable-section-header">Projects</td>
                      </tr>
                      <tr>
                        <td colSpan={7} className="border-t border-b border-black p-2">
                          <div className="space-y-2">
                            {projectFields.map((field, index) => (
                              <div key={field.id}>
                                <FormProject control={control} index={index} />
                                {index < projectFields.length - 1 && <Separator className="my-2 bg-black" />}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>

                    </tbody>
                </table>
              </div>
            </div>
        </div>
    </Form>
  );
}
