'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef } from 'react';
import { ResumeDataSchema, type ResumeData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form } from '@/components/ui/form';
import { Printer, RotateCcw } from 'lucide-react';

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


export default function ResumeForm({ initialData, onReset }: ResumeFormProps) {
  const form = useForm<ResumeData>({
    resolver: zodResolver(ResumeDataSchema),
    defaultValues: initialData,
  });
  
  const { control, watch } = form;
  const printRef = useRef<HTMLDivElement>(null);

  const { fields: skillFields } = useFieldArray({ control, name: "skillsRating" });

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

  return (
    <Form {...form}>
        <div className="space-y-4 bg-white p-4 sm:p-6 rounded-lg shadow-lg">
            <div className="flex flex-col sm:flex-row gap-2 no-print">
                <Button type="button" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" /> Print / Download
                </Button>
                <Button type="button" variant="outline" onClick={onReset}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Start Over
                </Button>
            </div>

            <div ref={printRef} className="printable-area printable-card bg-white p-2">
              <table className="w-full border-collapse border-2 border-black printable-table">
                <tbody>
                  {/* Basic Information Header */}
                  <tr>
                    <td colSpan={6} className="printable-section-header">Basic Information</td>
                  </tr>

                  {/* Row 1 */}
                  <tr>
                    <td className="font-bold bg-header-peach w-[20%]">Job Posting ID</td>
                    <td className="w-[30%]"><FormInput name="basicInfo.jobPostingId" control={control} /></td>
                    <td className="font-bold bg-header-peach w-[20%]">Job Seeker ID</td>
                    <td className="w-[30%]" colSpan={3}><FormInput name="basicInfo.jobSeekerId" control={control} /></td>
                  </tr>

                   {/* Row 2 */}
                  <tr>
                    <td className="font-bold bg-header-peach">Vendor Name</td>
                    <td><FormInput name="basicInfo.vendorName" control={control} /></td>
                    <td className="font-bold bg-header-peach">Position Applied</td>
                    <td><FormInput name="basicInfo.positionApplied" control={control} /></td>
                    <td className="font-bold bg-header-peach">Skill Name</td>
                    <td><FormInput name="basicInfo.skillName" control={control} /></td>
                  </tr>

                  {/* Row 3 */}
                   <tr>
                    <td className="font-bold bg-header-peach">Requisition Received Date</td>
                    <td><FormInput name="basicInfo.requisitionReceivedDate" control={control} /></td>
                    <td className="font-bold bg-header-peach">Contact No</td>
                    <td colSpan={3}><FormInput name="basicInfo.contactNo" control={control} /></td>
                  </tr>
                  
                   {/* Row 4 */}
                   <tr>
                    <td className="font-bold bg-header-peach">Candidate Name as per PAN</td>
                    <td><FormInput name="basicInfo.candidateName" control={control} /></td>
                    <td className="font-bold bg-header-peach">Total Experience</td>
                    <td colSpan={3}><FormInput name="basicInfo.totalExperience" control={control} /></td>
                  </tr>

                   {/* Row 5 */}
                   <tr>
                    <td className="font-bold bg-header-peach">Email</td>
                    <td><FormInput name="basicInfo.email" control={control} /></td>
                    <td className="font-bold bg-header-peach">Relevant Experience</td>
                    <td colSpan={3}><FormInput name="basicInfo.relevantExperience" control={control} /></td>
                  </tr>

                  {/* Row 6 */}
                  <tr>
                    <td className="font-bold bg-header-peach">Current Location</td>
                    <td><FormInput name="basicInfo.currentLocation" control={control} /></td>
                    <td className="font-bold bg-header-peach">Relocation (Yes/No)</td>
                    <td colSpan={3}><FormSelect name="basicInfo.relocation" control={control} options={['Yes', 'No', 'N/A']} /></td>
                  </tr>
                  
                  {/* Row 7 */}
                  <tr>
                    <td className="font-bold bg-header-peach">Preferred Location</td>
                    <td><FormInput name="basicInfo.preferredLocation" control={control} /></td>
                    <td className="font-bold bg-header-peach">Work from office/ Work from Home/Both</td>
                    <td colSpan={3}><FormSelect name="basicInfo.workPreference" control={control} options={['Office', 'Home', 'Both', 'N/A']} /></td>
                  </tr>
                  
                  {/* Education / Employment Header */}
                  <tr>
                    <td colSpan={3} className="printable-section-header">Education Details</td>
                    <td colSpan={3} className="printable-section-header">Employment Details</td>
                  </tr>

                  <tr>
                    <td className='font-bold bg-header-peach text-center w-[16.66%]'>Degree</td>
                    <td className='font-bold bg-header-peach text-center w-[8.33%]'>From</td>
                    <td className='font-bold bg-header-peach text-center w-[8.33%]'>To</td>
                    <td className='font-bold bg-header-peach' colSpan={2}>Current / Last Employer:</td>
                    <td><FormInput name="employmentDetails.currentEmployer" control={control}/></td>
                  </tr>
                   <tr>
                    <td><FormInput name="educationDetails.bachelors.degree" control={control}/></td>
                    <td><FormInput name="educationDetails.bachelors.from" control={control}/></td>
                    <td><FormInput name="educationDetails.bachelors.to" control={control}/></td>
                    <td colSpan={2} className='font-bold bg-header-peach'>Role FTE/ Contract with Current or Last Employer</td>
                    <td><FormInput name="employmentDetails.employmentType" control={control}/></td>
                  </tr>
                  <tr>
                    <td><FormInput name="educationDetails.masters.degree" control={control}/></td>
                    <td><FormInput name="educationDetails.masters.from" control={control}/></td>
                    <td><FormInput name="educationDetails.masters.to" control={control}/></td>
                    <td className='font-bold bg-header-peach' colSpan={2}>Employment Details From</td>
                    <td><FormInput name="employmentDetails.from" control={control}/></td>
                  </tr>
                   <tr>
                    <td className='font-bold bg-header-peach'>Others (Any Certifications):</td>
                    <td colSpan={2}><FormInput name="educationDetails.certifications" control={control}/></td>
                    <td className='font-bold bg-header-peach' colSpan={2}>Employment Details To</td>
                    <td><FormInput name="employmentDetails.to" control={control}/></td>
                  </tr>
                   <tr>
                    <td className='font-bold bg-header-peach'>Awareness about Contract Role (Yes/No)</td>
                    <td colSpan={2}><FormSelect name="otherInfo.awarenessAboutContractRole" control={control} options={['Yes', 'No', 'N/A']} /></td>
                    <td className='font-bold bg-header-peach' colSpan={2}>Overseas Experience If Any (Yes/No)</td>
                    <td><FormSelect name="employmentDetails.overseasExperience" control={control} options={['Yes', 'No', 'N/A']} /></td>
                  </tr>
                   <tr>
                    <td className='font-bold bg-header-peach'>Holding any other offers (Yes/No)</td>
                    <td colSpan={2}><FormSelect name="otherInfo.holdingOtherOffers" control={control} options={['Yes', 'No', 'N/A']} /></td>
                    <td className='font-bold bg-header-peach' colSpan={2}>Notice period as per company policy / Serving notice period</td>
                    <td><FormInput name="employmentDetails.noticePeriod" control={control}/></td>
                  </tr>
                  <tr>
                    <td className='font-bold bg-header-peach'>Reason for Change</td>
                    <td colSpan={2}><FormInput name="otherInfo.reasonForChange" control={control}/></td>
                    <td className='font-bold bg-header-peach' colSpan={2}>Bench/ Market Profile</td>
                    <td><FormInput name="employmentDetails.benchMarketProfile" control={control}/></td>
                  </tr>
                   <tr>
                    <td colSpan={3}></td>
                    <td className='font-bold bg-header-peach' colSpan={2}>Shifts (Yes/No)</td>
                    <td><FormSelect name="employmentDetails.shifts" control={control} options={['Yes', 'No', 'N/A']} /></td>
                  </tr>

                   {/* Skills Header */}
                  <tr>
                    <td colSpan={6} className="printable-section-header">Skills Rating (1-Poor & 5-Excellent)</td>
                  </tr>
                  <tr className="bg-header-peach">
                    <td className="font-bold text-center">Top 3 Skills (Relevant/ Others)</td>
                    <td className="font-bold text-center">No of Projects Handled</td>
                    <td className="font-bold text-center">Relevant Experience in Skills</td>
                    <td className="font-bold text-center">Candidate Rating</td>
                    <td className="font-bold text-center" colSpan={2}>Recruiter Rating</td>
                  </tr>
                  {skillFields.map((field, index) => (
                    <tr key={field.id}>
                        <td className="h-8"><FormInput name={`skillsRating.${index}.skill`} control={control} /></td>
                        <td><FormInput name={`skillsRating.${index}.projectsHandled`} control={control} /></td>
                        <td><FormInput name={`skillsRating.${index}.relevantExperience`} control={control} /></td>
                        <td><FormInput name={`skillsRating.${index}.candidateRating`} control={control} /></td>
                        <td colSpan={2}>{index === 0 ? <FormInput name={`recruiterDetails.recruiterRating`} control={control} /> : ''}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="font-bold bg-header-peach" colSpan={3}>Communication (Poor / Average / Excellent)</td>
                    <td colSpan={3}><FormSelect name="otherInfo.communicationSkills" control={control} options={['Poor', 'Average', 'Excellent', 'N/A']} /></td>
                  </tr>
                  <tr>
                    <td className="font-bold bg-header-peach" colSpan={3}>Listening Skills (Poor / Average / Excellent)</td>
                    <td colSpan={3}><FormSelect name="otherInfo.listeningSkills" control={control} options={['Poor', 'Average', 'Excellent', 'N/A']} /></td>
                  </tr>
                  
                  {/* Other Info */}
                  <tr>
                    <td colSpan={6} className="printable-section-header">Other Information</td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="font-bold bg-header-peach">Earlier worked with Deloitte (Yes/No)</td>
                    <td><FormSelect name="otherInfo.earlierWorkedWithDeloitte" control={control} options={['Yes', 'No', 'N/A']} /></td>
                    <td colSpan={2} className="font-bold bg-header-peach">If Yes, Tenure (From/To)</td>
                    <td><FormInput name="otherInfo.tenure" control={control}/></td>
                  </tr>
                   <tr>
                    <td colSpan={2} className="font-bold bg-header-peach">If Yes, Deloitte (FTE/Contract)</td>
                    <td><FormInput name="otherInfo.deloitteFteContract" control={control}/></td>
                    <td colSpan={2} className="font-bold bg-header-peach">If Yes, Reason to Leave Deloitte</td>
                    <td><FormInput name="otherInfo.reasonToLeaveDeloitte" control={control}/></td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="font-bold bg-header-peach">If Yes, Deloitte Entity</td>
                    <td><FormInput name="otherInfo.deloitteEntity" control={control}/></td>
                    <td colSpan={2} className="font-bold bg-header-peach">Relevant documents for further process</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="font-bold bg-header-peach">Any plan for a long leave for next 6 months</td>
                    <td><FormSelect name="otherInfo.longLeavePlan" control={control} options={['Yes', 'No', 'N/A']} /></td>
                    <td colSpan={2} className="font-bold bg-header-peach">Any other Input / Comments / Concerns:</td>
                    <td><FormInput name="otherInfo.otherInput" control={control}/></td>
                  </tr>

                   {/* Recruiter Details */}
                  <tr>
                    <td colSpan={6} className="printable-section-header">Recruiter Details</td>
                  </tr>
                  <tr>
                    <td className="font-bold bg-header-peach" colSpan={2}>Deloitte Recruiter</td>
                    <td><FormInput name="recruiterDetails.deloitteRecruiter" control={control}/></td>
                    <td className="font-bold bg-header-peach" colSpan={2}>Vendor Recruiter Name</td>
                    <td><FormInput name="recruiterDetails.vendorRecruiterName" control={control}/></td>
                  </tr>
                  <tr>
                    <td className="font-bold bg-header-peach" colSpan={2}>Deloitte CRM</td>
                    <td><FormInput name="recruiterDetails.deloitteCrm" control={control}/></td>
                    <td className="font-bold bg-header-peach" colSpan={2}>Vendor Coordinator</td>
                    <td><FormInput name="recruiterDetails.vendorCoordinator" control={control}/></td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
    </Form>
  );
}
