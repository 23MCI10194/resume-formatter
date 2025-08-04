'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useCallback } from 'react';
import { ResumeDataSchema, type ResumeData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Download, RotateCcw } from 'lucide-react';

interface ResumeFormProps {
  initialData: ResumeData;
  onReset: () => void;
  onLoadFromStorage: (data: ResumeData) => void;
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

export default function ResumeForm({ initialData, onReset, onLoadFromStorage }: ResumeFormProps) {
  const form = useForm<ResumeData>({
    resolver: zodResolver(ResumeDataSchema),
    defaultValues: initialData,
  });

   const { fields: skillFields } = useFieldArray({
    control: form.control,
    name: "skillsRating",
  });

  useEffect(() => {
    try {
        const savedData = localStorage.getItem('resumeFormData');
        if (savedData) {
            const parsedData = ResumeDataSchema.parse(JSON.parse(savedData));
             if (parsedData && parsedData.basicInfo.candidateName) {
                form.reset(parsedData);
                onLoadFromStorage(parsedData);
                return;
            }
        }
    } catch (e) {
      // Fallback to initialData if localStorage is corrupt
    }
    form.reset(initialData);
  }, [initialData, form.reset, onLoadFromStorage]);


  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem('resumeFormData', JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const handlePrint = () => {
    window.print();
  }

  const onSubmit = (data: ResumeData) => {
    console.log('Form submitted for printing:', data);
    handlePrint();
  }
  
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white p-4 rounded-lg shadow-lg">
            <div className="flex flex-col sm:flex-row gap-2 no-print">
                <Button type="submit">
                  <Download className="mr-2 h-4 w-4" /> Download as PDF
                </Button>
                <Button type="button" variant="outline" onClick={onReset}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Start Over
                </Button>
            </div>

            <div className="border border-black">
                {/* Basic Information */}
                <h2 className="bg-yellow-500 text-black font-bold p-1 text-center printable-section-header text-base">Basic Information</h2>
                <div className="grid grid-cols-2 gap-px bg-black">
                    <div className="bg-white p-1 space-y-1">
                        <FormInput name="basicInfo.jobPostingId" control={form.control} label="Job Posting ID" />
                        <FormInput name="basicInfo.vendorName" control={form.control} label="Vendor Name" />
                        <FormInput name="basicInfo.requisitionReceivedDate" control={form.control} label="Requisition Received Date" />
                        <FormInput name="basicInfo.candidateName" control={form.control} label="Candidate NameasPer PAN" />
                        <FormInput name="basicInfo.email" control={form.control} label="Email" />
                        <FormInput name="basicInfo.currentLocation" control={form.control} label="Current Location" />
                        <FormInput name="basicInfo.preferredLocation" control={form.control} label="Preferred Location" />
                    </div>
                    <div className="bg-white p-1 space-y-1">
                        <FormInput name="basicInfo.jobSeekerId" control={form.control} label="Job Seeker ID" />
                        <FormInput name="basicInfo.positionApplied" control={form.control} label="Position Applied" />
                        <FormInput name="basicInfo.contactNo" control={form.control} label="Contact No" />
                        <FormInput name="basicInfo.totalExperience" control={form.control} label="Total Experience" />
                        <FormInput name="basicInfo.relevantExperience" control={form.control} label="Relevant Experience" />
                        <FormSelect name="basicInfo.relocation" control={form.control} label="Relocation (Yes/No)" options={['Yes', 'No', 'N/A']} />
                        <FormSelect name="basicInfo.workPreference" control={form.control} label="Work from office/ Work from Home/Both" options={['Office', 'Home', 'Both', 'N/A']} />
                    </div>
                </div>

                {/* Education & Employment */}
                <div className="grid grid-cols-2 gap-px bg-black">
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
                                        <td><FormField control={form.control} name="educationDetails.bachelors.degree" render={({field}) => <Input {...field} value={field.value || ''} placeholder="Bachelor's" className="h-8 text-sm printable-input" />} /></td>
                                        <td><FormField control={form.control} name="educationDetails.bachelors.from" render={({field}) => <Input {...field} value={field.value || ''} className="h-8 text-sm printable-input" />} /></td>
                                        <td><FormField control={form.control} name="educationDetails.bachelors.to" render={({field}) => <Input {...field} value={field.value || ''} className="h-8 text-sm printable-input" />} /></td>
                                    </tr>
                                    <tr>
                                        <td><FormField control={form.control} name="educationDetails.masters.degree" render={({field}) => <Input {...field} value={field.value || ''} placeholder="Master's" className="h-8 text-sm printable-input" />} /></td>
                                        <td><FormField control={form.control} name="educationDetails.masters.from" render={({field}) => <Input {...field} value={field.value || ''} className="h-8 text-sm printable-input" />} /></td>
                                        <td><FormField control={form.control} name="educationDetails.masters.to" render={({field}) => <Input {...field} value={field.value || ''} className="h-8 text-sm printable-input" />} /></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="flex items-center mt-1">
                                <label className="font-semibold pr-4 text-sm w-1/3">Others (Any Certifications):</label>
                                <FormField control={form.control} name="educationDetails.certifications" render={({field}) => <Input {...field} value={field.value || ''} className="h-8 text-sm printable-input w-2/3" />} />
                            </div>
                        </div>
                    </div>
                     {/* Employment Details */}
                    <div className="bg-white">
                        <h3 className="bg-yellow-500 text-black font-bold p-1 text-center printable-section-header text-base">Employment Details</h3>
                        <div className="p-1 space-y-1">
                            <div className="flex items-center">
                                <label className="w-1/2 font-semibold pr-4 text-sm">Current / Last Employer:</label>
                                <FormField control={form.control} name="employmentDetails.currentEmployer" render={({field}) => <Input {...field} value={field.value || ''} className="h-8 text-sm printable-input w-1/2" />} />
                            </div>
                             <div className="flex items-center">
                                <label className="w-1/2 font-semibold pr-4 text-sm">Role FTE/ Contract with Current or Last Employer</label>
                                <FormField control={form.control} name="employmentDetails.employmentType" render={({field}) => <Input {...field} value={field.value || ''} className="h-8 text-sm printable-input w-1/2" />} />
                            </div>
                            <div className="flex items-center">
                                <label className="w-1/4 font-semibold pr-4 text-sm">From</label>
                                <FormField control={form.control} name="employmentDetails.from" render={({field}) => <Input {...field} value={field.value || ''} className="h-8 text-sm printable-input w-1/4" />} />
                                <label className="w-1/4 font-semibold px-4 text-sm">To</label>
                                <FormField control={form.control} name="employmentDetails.to" render={({field}) => <Input {...field} value={field.value || ''} className="h-8 text-sm printable-input w-1/4" />} />
                            </div>
                             <FormSelect name="employmentDetails.overseasExperience" control={form.control} label="Overseas Experience If Any (Yes/No)" options={['Yes', 'No', 'N/A']} />
                             <FormInput name="employmentDetails.noticePeriod" control={form.control} label="Notice period as per company policy / Serving notice period" />
                             <FormInput name="employmentDetails.benchMarketProfile" control={form.control} label="Bench/ Market Profile" />
                             <FormSelect name="employmentDetails.shifts" control={form.control} label="Shifts (Yes/No)" options={['Yes', 'No', 'N/A']} />
                        </div>
                    </div>
                </div>

                {/* Other Info Continued */}
                <div className="grid grid-cols-2 gap-px bg-black">
                     <div className="bg-white p-1 space-y-1">
                        <FormSelect name="otherInfo.awarenessAboutContractRole" control={form.control} label="Awareness about Contract Role (Yes/No)" options={['Yes', 'No', 'N/A']} />
                     </div>
                     <div className="bg-white p-1 space-y-1">
                         <FormSelect name="otherInfo.holdingOtherOffers" control={form.control} label="Holding any other offers (Yes/No)" options={['Yes', 'No', 'N/A']} />
                     </div>
                </div>
                 <div className="grid grid-cols-1 gap-px bg-black">
                    <div className="bg-white p-1">
                         <FormInput name="otherInfo.reasonForChange" control={form.control} label="Reason for Change" />
                    </div>
                </div>


                {/* Skills Rating */}
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
                                    <td><FormField control={form.control} name={`skillsRating.${index}.skill`} render={({field}) => <Input {...field} value={field.value || ''} className="h-8 text-sm printable-input" />} /></td>
                                    <td><FormField control={form.control} name={`skillsRating.${index}.projectsHandled`} render={({field}) => <Input {...field} value={field.value || ''} className="h-8 text-sm printable-input" />} /></td>
                                    <td><FormField control={form.control} name={`skillsRating.${index}.relevantExperience`} render={({field}) => <Input {...field} value={field.value || ''} className="h-8 text-sm printable-input" />} /></td>
                                    <td><FormField control={form.control} name={`skillsRating.${index}.candidateRating`} render={({field}) => <Input type="number" min="1" max="5" {...field} value={field.value || 1} onChange={e => field.onChange(parseInt(e.target.value))} className="h-8 text-sm printable-input" />} /></td>
                                    <td><FormField control={form.control} name={`skillsRating.${index}.recruiterRating`} render={({field}) => <Input type="number" min="1" max="5" {...field} value={field.value || 1} onChange={e => field.onChange(parseInt(e.target.value))} className="h-8 text-sm printable-input" />} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                 <div className="grid grid-cols-2 gap-px bg-black">
                     <div className="bg-white p-1">
                        <FormSelect name="otherInfo.communicationSkills" control={form.control} label="Communication (Poor / Average / Excellent)" options={['Poor', 'Average', 'Excellent', 'N/A']} />
                     </div>
                     <div className="bg-white p-1">
                         <FormSelect name="otherInfo.listeningSkills" control={form.control} label="Listening Skills (Poor / Average / Excellent)" options={['Poor', 'Average', 'Excellent', 'N/A']} />
                     </div>
                </div>

                {/* Other Information */}
                <h3 className="bg-yellow-500 text-black font-bold p-1 text-center printable-section-header text-base">Other Information</h3>
                <div className="grid grid-cols-2 gap-px bg-black">
                    <div className="bg-white p-1 space-y-1">
                        <FormInput name="otherInfo.earlierWorkedWithDeloitte" control={form.control} label="Earlier worked with Deloitte (Yes/No)" />
                        <FormInput name="otherInfo.deloitteFteContract" control={form.control} label="If Yes, Deloitte (FTE/Contract)" />
                        <FormInput name="otherInfo.deloitteEntity" control={form.control} label="If Yes, Deloitte Entity" />
                    </div>
                     <div className="bg-white p-1 space-y-1">
                        <FormInput name="otherInfo.tenure" control={form.control} label="If Yes, Tenure (From/To)" />
                        <FormInput name="otherInfo.reasonToLeaveDeloitte" control={form.control} label="If Yes, Reason to Leave Deloitte" />
                        <label className="text-sm">Relevant documents for further process</label>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-px bg-black">
                     <div className="bg-white p-1">
                        <FormInput name="otherInfo.longLeavePlan" control={form.control} label="Any plan for a long leave for next 6 months" />
                     </div>
                     <div className="bg-white p-1">
                         <FormInput name="otherInfo.otherInput" control={form.control} label="Any other Input / Comments / Concerns:" />
                     </div>
                </div>


                {/* Recruiter Details */}
                <h3 className="bg-yellow-500 text-black font-bold p-1 text-center printable-section-header text-base">Recruiter Details</h3>
                <div className="grid grid-cols-2 gap-px bg-black">
                    <div className="bg-white p-1 space-y-1">
                        <FormInput name="recruiterDetails.deloitteRecruiter" control={form.control} label="Deloitte Recruiter" />
                        <FormInput name="recruiterDetails.deloitteCrm" control={form.control} label="Deloitte CRM" />
                    </div>
                    <div className="bg-white p-1 space-y-1">
                        <FormInput name="recruiterDetails.vendorRecruiterName" control={form.control} label="Vendor Recruiter Name" />
                        <FormInput name="recruiterDetails.vendorCoordinator" control={form.control} label="Vendor Coordinator" />
                    </div>
                </div>

            </div>
        </form>
    </Form>
  );
}

    