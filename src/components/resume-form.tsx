'use client';

import { useForm, useFieldArray, Controller, type Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { ResumeDataSchema, type ResumeData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormMessage } from '@/components/ui/form';
import { Download, RotateCcw } from 'lucide-react';

interface ResumeFormProps {
  initialData: ResumeData;
  onReset: () => void;
}

interface FormSectionProps {
    control: Control<ResumeData>;
}

const FormInput = ({ name, control, label, placeholder }: { name: any, control: any, label: string, placeholder?: string }) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <div className="flex items-center">
                <label className="w-1/3 font-semibold pr-4 text-sm">{label}</label>
                <div className="w-2/3">
                    <Input {...field} value={field.value || ''} placeholder={placeholder} className="h-8 text-sm printable-input" />
                    <FormMessage />
                </div>
            </div>
        )}
    />
);

const FormSelect = ({ name, control, label, options }: { name: any, control: any, label: string, options: string[] }) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
             <div className="flex items-center">
                <label className="w-1/3 font-semibold pr-4 text-sm">{label}</label>
                <div className="w-2/3">
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger className="h-8 text-sm printable-input">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {options.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </div>
            </div>
        )}
    />
);

const BasicInfoSection: React.FC<FormSectionProps> = ({ control }) => (
    <>
        <h2 className="bg-yellow-500 text-black font-bold p-1 text-center printable-section-header text-base">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black">
            <div className="bg-white p-1 space-y-1">
                <FormInput name="basicInfo.jobPostingId" control={control} label="Job Posting ID" />
                <FormInput name="basicInfo.vendorName" control={control} label="Vendor Name" />
                <FormInput name="basicInfo.requisitionReceivedDate" control={control} label="Requisition Received Date" />
                <FormInput name="basicInfo.candidateName" control={control} label="Candidate Name as Per PAN" />
                <FormInput name="basicInfo.email" control={control} label="Email" />
                <FormInput name="basicInfo.currentLocation" control={control} label="Current Location" />
                <FormInput name="basicInfo.preferredLocation" control={control} label="Preferred Location" />
            </div>
            <div className="bg-white p-1 space-y-1">
                <FormInput name="basicInfo.jobSeekerId" control={control} label="Job Seeker ID" />
                <FormInput name="basicInfo.positionApplied" control={control} label="Position Applied" />
                <FormInput name="basicInfo.contactNo" control={control} label="Contact No" />
                <FormInput name="basicInfo.totalExperience" control={control} label="Total Experience" />
                <FormInput name="basicInfo.relevantExperience" control={control} label="Relevant Experience" />
                <FormSelect name="basicInfo.relocation" control={control} label="Relocation (Yes/No)" options={['Yes', 'No', 'N/A']} />
                <FormSelect name="basicInfo.workPreference" control={control} label="Work from office/ Work from Home/Both" options={['Office', 'Home', 'Both', 'N/A']} />
            </div>
        </div>
    </>
);

const EducationEmploymentSection: React.FC<FormSectionProps> = ({ control }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black">
        {/* Education Details */}
        <div className="bg-white">
            <h3 className="bg-yellow-500 text-black font-bold p-1 text-center printable-section-header text-base">Education Details</h3>
            <div className="p-1">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-black">
                            <th className="font-semibold text-sm w-1/3 text-left p-1">Degree</th>
                            <th className="font-semibold text-sm w-1/3 text-left p-1">From</th>
                            <th className="font-semibold text-sm w-1/3 text-left p-1">To</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><FormField control={control} name="educationDetails.bachelors.degree" render={({field}) => <Input {...field} value={field.value || ''} placeholder="Bachelor's" className="h-8 text-sm printable-input" />} /></td>
                            <td><FormField control={control} name="educationDetails.bachelors.from" render={({field}) => <Input {...field} value={field.value || ''} className="h-8 text-sm printable-input" />} /></td>
                            <td><FormField control={control} name="educationDetails.bachelors.to" render={({field}) => <Input {...field} value={field.value || ''} className="h-8 text-sm printable-input" />} /></td>
                        </tr>
                        <tr>
                            <td><FormField control={control} name="educationDetails.masters.degree" render={({field}) => <Input {...field} value={field.value || ''} placeholder="Master's" className="h-8 text-sm printable-input" />} /></td>
                            <td><FormField control={control} name="educationDetails.masters.from" render={({field}) => <Input {...field} value={field.value || ''} className="h-8 text-sm printable-input" />} /></td>
                            <td><FormField control={control} name="educationDetails.masters.to" render={({field}) => <Input {...field} value={field.value || ''} className="h-8 text-sm printable-input" />} /></td>
                        </tr>
                    </tbody>
                </table>
                <div className="flex items-center mt-1">
                    <label className="font-semibold pr-4 text-sm w-1/3">Others (Any Certifications):</label>
                    <FormField control={control} name="educationDetails.certifications" render={({field}) => <Input {...field} value={field.value || ''} className="h-8 text-sm printable-input w-2/3" />} />
                </div>
            </div>
        </div>
         {/* Employment Details */}
        <div className="bg-white">
            <h3 className="bg-yellow-500 text-black font-bold p-1 text-center printable-section-header text-base">Employment Details</h3>
            <div className="p-1 space-y-1">
                <div className="flex items-center">
                    <label className="w-1/2 font-semibold pr-4 text-sm">Current / Last Employer:</label>
                    <FormField control={control} name="employmentDetails.currentEmployer" render={({field}) => <Input {...field} value={field.value || ''} className="h-8 text-sm printable-input w-1/2" />} />
                </div>
                 <div className="flex items-center">
                    <label className="w-1/2 font-semibold pr-4 text-sm">Role FTE/ Contract with Current or Last Employer</label>
                    <FormField control={control} name="employmentDetails.employmentType" render={({field}) => <Input {...field} value={field.value || ''} className="h-8 text-sm printable-input w-1/2" />} />
                </div>
                <div className="flex items-center">
                    <label className="w-1/4 font-semibold pr-4 text-sm">From</label>
                    <FormField control={control} name="employmentDetails.from" render={({field}) => <Input {...field} value={field.value || ''} className="h-8 text-sm printable-input w-1/4" />} />
                    <label className="w-1/4 font-semibold px-4 text-sm">To</label>
                    <FormField control={control} name="employmentDetails.to" render={({field}) => <Input {...field} value={field.value || ''} className="h-8 text-sm printable-input w-1/4" />} />
                </div>
                 <FormSelect name="employmentDetails.overseasExperience" control={control} label="Overseas Experience If Any (Yes/No)" options={['Yes', 'No', 'N/A']} />
                 <FormInput name="employmentDetails.noticePeriod" control={control} label="Notice period as per company policy / Serving notice period" />
                 <FormInput name="employmentDetails.benchMarketProfile" control={control} label="Bench/ Market Profile" />
                 <FormSelect name="employmentDetails.shifts" control={control} label="Shifts (Yes/No)" options={['Yes', 'No', 'N/A']} />
            </div>
        </div>
    </div>
);

const SkillsSection: React.FC<FormSectionProps> = ({ control }) => {
    const { fields: skillFields } = useFieldArray({ control, name: "skillsRating" });
    
    return (
        <>
            <h3 className="bg-yellow-500 text-black font-bold p-1 text-center printable-section-header text-base">Skills Rating (1-Poor & 5-Excellent)</h3>
            <div className="bg-white p-1">
                <table className="w-full">
                    <thead>
                       <tr className="border-b border-black">
                            <th className="font-semibold text-sm w-1/4 text-left p-1">Top 3 Skills (Relevant/ Others)</th>
                            <th className="font-semibold text-sm w-1/5 text-left p-1">No of Projects Handled</th>
                            <th className="font-semibold text-sm w-1/5 text-left p-1">Relevant Experience in Skills</th>
                            <th className="font-semibold text-sm w-1/5 text-left p-1">Candidate Rating</th>
                            <th className="font-semibold text-sm w-1/5 text-left p-1">Recruiter Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {skillFields.map((field, index) => (
                            <tr key={field.id}>
                                <td><FormField control={control} name={`skillsRating.${index}.skill`} render={({field}) => <Input {...field} value={field.value || ''} className="h-8 text-sm printable-input" />} /></td>
                                <td><FormField control={control} name={`skillsRating.${index}.projectsHandled`} render={({field}) => <Input {...field} value={field.value || ''} className="h-8 text-sm printable-input" />} /></td>
                                <td><FormField control={control} name={`skillsRating.${index}.relevantExperience`} render={({field}) => <Input {...field} value={field.value || ''} className="h-8 text-sm printable-input" />} /></td>
                                <td><FormField control={control} name={`skillsRating.${index}.candidateRating`} render={({field}) => <Input type="number" min="1" max="5" {...field} value={field.value || 1} onChange={e => field.onChange(parseInt(e.target.value))} className="h-8 text-sm printable-input" />} /></td>
                                <td><FormField control={control} name={`skillsRating.${index}.recruiterRating`} render={({field}) => <Input type="number" min="1" max="5" {...field} value={field.value || 1} onChange={e => field.onChange(parseInt(e.target.value))} className="h-8 text-sm printable-input" />} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

const OtherInfoSection: React.FC<FormSectionProps> = ({ control }) => (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black">
             <div className="bg-white p-1 space-y-1">
                <FormSelect name="otherInfo.awarenessAboutContractRole" control={control} label="Awareness about Contract Role (Yes/No)" options={['Yes', 'No', 'N/A']} />
             </div>
             <div className="bg-white p-1 space-y-1">
                 <FormSelect name="otherInfo.holdingOtherOffers" control={control} label="Holding any other offers (Yes/No)" options={['Yes', 'No', 'N/A']} />
             </div>
        </div>
         <div className="grid grid-cols-1 gap-px bg-black">
            <div className="bg-white p-1">
                 <FormInput name="otherInfo.reasonForChange" control={control} label="Reason for Change" />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black">
             <div className="bg-white p-1">
                <FormSelect name="otherInfo.communicationSkills" control={control} label="Communication (Poor / Average / Excellent)" options={['Poor', 'Average', 'Excellent', 'N/A']} />
             </div>
             <div className="bg-white p-1">
                 <FormSelect name="otherInfo.listeningSkills" control={control} label="Listening Skills (Poor / Average / Excellent)" options={['Poor', 'Average', 'Excellent', 'N/A']} />
             </div>
        </div>
        <h3 className="bg-yellow-500 text-black font-bold p-1 text-center printable-section-header text-base">Other Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black">
            <div className="bg-white p-1 space-y-1">
                <FormInput name="otherInfo.earlierWorkedWithDeloitte" control={control} label="Earlier worked with Deloitte (Yes/No)" />
                <FormInput name="otherInfo.deloitteFteContract" control={control} label="If Yes, Deloitte (FTE/Contract)" />
                <FormInput name="otherInfo.deloitteEntity" control={control} label="If Yes, Deloitte Entity" />
            </div>
             <div className="bg-white p-1 space-y-1">
                <FormInput name="otherInfo.tenure" control={control} label="If Yes, Tenure (From/To)" />
                <FormInput name="otherInfo.reasonToLeaveDeloitte" control={control} label="If Yes, Reason to Leave Deloitte" />
                <label className="text-sm">Relevant documents for further process</label>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black">
             <div className="bg-white p-1">
                <FormInput name="otherInfo.longLeavePlan" control={control} label="Any plan for a long leave for next 6 months" />
             </div>
             <div className="bg-white p-1">
                 <FormInput name="otherInfo.otherInput" control={control} label="Any other Input / Comments / Concerns:" />
             </div>
        </div>
    </>
);

const RecruiterDetailsSection: React.FC<FormSectionProps> = ({ control }) => (
    <>
        <h3 className="bg-yellow-500 text-black font-bold p-1 text-center printable-section-header text-base">Recruiter Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black">
            <div className="bg-white p-1 space-y-1">
                <FormInput name="recruiterDetails.deloitteRecruiter" control={control} label="Deloitte Recruiter" />
                <FormInput name="recruiterDetails.deloitteCrm" control={control} label="Deloitte CRM" />
            </div>
            <div className="bg-white p-1 space-y-1">
                <FormInput name="recruiterDetails.vendorRecruiterName" control={control} label="Vendor Recruiter Name" />
                <FormInput name="recruiterDetails.vendorCoordinator" control={control} label="Vendor Coordinator" />
            </div>
        </div>
    </>
);


export default function ResumeForm({ initialData, onReset }: ResumeFormProps) {
  const form = useForm<ResumeData>({
    resolver: zodResolver(ResumeDataSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    form.reset(initialData);
  }, [initialData, form.reset]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem('resumeFormData', JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);
  
  const handlePrint = () => {
    localStorage.setItem('resumeFormData', JSON.stringify(form.getValues()));
    window.print();
  }

  return (
    <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 bg-white p-4 rounded-lg shadow-lg">
            <div className="flex flex-col sm:flex-row gap-2 no-print">
                <Button type="button" onClick={handlePrint}>
                  <Download className="mr-2 h-4 w-4" /> Download as PDF
                </Button>
                <Button type="button" variant="outline" onClick={onReset}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Start Over
                </Button>
            </div>

            <div className="border border-black printable-card">
                <BasicInfoSection control={form.control} />
                <EducationEmploymentSection control={form.control} />
                <OtherInfoSection control={form.control} />
                <SkillsSection control={form.control} />
                <RecruiterDetailsSection control={form.control} />
            </div>
        </form>
    </Form>
  );
}
