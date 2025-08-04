'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useCallback } from 'react';
import { ResumeDataSchema, type ResumeData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form } from '@/components/ui/form';
import { Download, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

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
            <Select onValueChange={field.onChange} value={field.value}>
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

  const { fields: skillFields } = useFieldArray({ control, name: "skillsRating" });

  useEffect(() => {
    form.reset(initialData);
  }, [initialData, form.reset]);

  const watchedValues = watch();
  useEffect(() => {
    localStorage.setItem('resumeFormData', JSON.stringify(watchedValues));
  }, [watchedValues]);
  
  const handlePrint = () => {
    window.print();
  }

  return (
    <Form {...form}>
        <div className="space-y-4 bg-white p-4 rounded-lg shadow-lg">
            <div className="flex flex-col sm:flex-row gap-2 no-print">
                <Button type="button" onClick={handlePrint}>
                  <Download className="mr-2 h-4 w-4" /> Download as PDF
                </Button>
                <Button type="button" variant="outline" onClick={onReset}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Start Over
                </Button>
            </div>

            <div className="printable-card">
              <table className="w-full border-collapse border-2 border-black printable-table">
                <tbody>
                  {/* Basic Information Header */}
                  <tr>
                    <td colSpan={4} className="printable-section-header bg-header-peach text-black font-bold p-1 text-center text-base">Basic Information</td>
                  </tr>

                  {/* Row 1 */}
                  <tr>
                    <td className="font-bold w-1/5">Job Posting ID</td>
                    <td className="w-2/5"><FormInput name="basicInfo.jobPostingId" control={control} /></td>
                    <td className="font-bold w-1/5">Job Seeker ID</td>
                    <td className="w-2/5"><FormInput name="basicInfo.jobSeekerId" control={control} /></td>
                  </tr>

                   {/* Row 2 */}
                  <tr>
                    <td className="font-bold">Vendor Name</td>
                    <td><FormInput name="basicInfo.vendorName" control={control} /></td>
                    <td className="font-bold">Position Applied</td>
                    <td><FormInput name="basicInfo.positionApplied" control={control} /></td>
                  </tr>

                  {/* Row 3 */}
                   <tr>
                    <td className="font-bold">Requisition Received Date</td>
                    <td><FormInput name="basicInfo.requisitionReceivedDate" control={control} /></td>
                    <td className="font-bold">Contact No</td>
                    <td><FormInput name="basicInfo.contactNo" control={control} /></td>
                  </tr>
                  
                   {/* Row 4 */}
                   <tr>
                    <td className="font-bold">Candidate NameasPer PAN</td>
                    <td><FormInput name="basicInfo.candidateName" control={control} /></td>
                    <td className="font-bold">Total Experience</td>
                    <td><FormInput name="basicInfo.totalExperience" control={control} /></td>
                  </tr>

                   {/* Row 5 */}
                   <tr>
                    <td className="font-bold">Email</td>
                    <td><FormInput name="basicInfo.email" control={control} /></td>
                    <td className="font-bold">Relevant Experience</td>
                    <td><FormInput name="basicInfo.relevantExperience" control={control} /></td>
                  </tr>

                  {/* Row 6 */}
                  <tr>
                    <td className="font-bold">Current Location</td>
                    <td><FormInput name="basicInfo.currentLocation" control={control} /></td>
                    <td className="font-bold">Relocation (Yes/No)</td>
                    <td><FormSelect name="basicInfo.relocation" control={control} options={['Yes', 'No', 'N/A']} /></td>
                  </tr>
                  
                  {/* Row 7 */}
                  <tr>
                    <td className="font-bold">Preferred Location</td>
                    <td><FormInput name="basicInfo.preferredLocation" control={control} /></td>
                    <td className="font-bold">Work from office/ Work from Home/Both</td>
                    <td><FormSelect name="basicInfo.workPreference" control={control} options={['Office', 'Home', 'Both', 'N/A']} /></td>
                  </tr>
                  
                  {/* Education / Employment Header */}
                  <tr>
                    <td colSpan={3} className="printable-section-header bg-header-peach text-black font-bold p-1 text-center text-base">Education Details</td>
                    <td colSpan={1} className="printable-section-header bg-header-peach text-black font-bold p-1 text-center text-base">Employment Details</td>
                  </tr>

                  {/* Education / Employment Content */}
                  <tr>
                    <td colSpan={3}>
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="font-bold border-r border-black w-1/3">Degree</td>
                            <td className="font-bold border-r border-black w-1/3">From</td>
                            <td className="font-bold w-1/3">To</td>
                          </tr>
                          <tr>
                            <td className="border-r border-black"><FormInput name="educationDetails.bachelors.degree" control={control}/></td>
                            <td className="border-r border-black"><FormInput name="educationDetails.bachelors.from" control={control}/></td>
                            <td><FormInput name="educationDetails.bachelors.to" control={control}/></td>
                          </tr>
                          <tr>
                            <td className="border-r border-black"><FormInput name="educationDetails.masters.degree" control={control}/></td>
                            <td className="border-r border-black"><FormInput name="educationDetails.masters.from" control={control}/></td>
                            <td><FormInput name="educationDetails.masters.to" control={control}/></td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td colSpan={1}>
                       <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="font-bold border-r border-black w-1/2">From</td>
                            <td className="font-bold w-1/2">To</td>
                          </tr>
                          <tr>
                            <td className="border-r border-black"><FormInput name="employmentDetails.from" control={control}/></td>
                            <td><FormInput name="employmentDetails.to" control={control}/></td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">Others (Any Certifications):</td>
                    <td colSpan={2}><FormInput name="educationDetails.certifications" control={control}/></td>
                    <td className="font-bold">Current / Last Employer: <FormInput name="employmentDetails.currentEmployer" control={control}/></td>
                  </tr>
                   <tr>
                    <td className="font-bold">Awareness about Contract Role (Yes/No)</td>
                    <td colSpan={2}><FormSelect name="otherInfo.awarenessAboutContractRole" control={control} options={['Yes', 'No', 'N/A']} /></td>
                    <td className="font-bold">Role FTE/ Contract with Current or Last Employer: <FormInput name="employmentDetails.employmentType" control={control}/></td>
                  </tr>
                   <tr>
                    <td className="font-bold">Holding any other offers (Yes/No)</td>
                    <td colSpan={2}><FormSelect name="otherInfo.holdingOtherOffers" control={control} options={['Yes', 'No', 'N/A']} /></td>
                    <td className="font-bold">Overseas Experience If Any (Yes/No): <FormSelect name="employmentDetails.overseasExperience" control={control} options={['Yes', 'No', 'N/A']} /></td>
                  </tr>
                   <tr>
                    <td className="font-bold">Reason for Change</td>
                    <td colSpan={2}><FormInput name="otherInfo.reasonForChange" control={control}/></td>
                    <td className="font-bold">Notice period as per company policy / Serving notice period: <FormInput name="employmentDetails.noticePeriod" control={control}/></td>
                  </tr>
                   <tr>
                    <td colSpan={3}></td>
                    <td className="font-bold">Bench/ Market Profile: <FormInput name="employmentDetails.benchMarketProfile" control={control}/></td>
                  </tr>
                  <tr>
                    <td colSpan={3}></td>
                    <td className="font-bold">Shifts (Yes/No): <FormSelect name="employmentDetails.shifts" control={control} options={['Yes', 'No', 'N/A']} /></td>
                  </tr>

                   {/* Skills Header */}
                  <tr>
                    <td colSpan={4} className="printable-section-header bg-header-peach text-black font-bold p-1 text-center text-base">Skills Rating (1-Poor & 5-Excellent)</td>
                  </tr>
                  <tr>
                    <td className="font-bold text-center">Top 3 Skills (Relevant/ Others)</td>
                    <td className="font-bold text-center">No of Projects Handled</td>
                    <td className="font-bold text-center">Relevant Experience in Skills</td>
                    <td className="font-bold text-center">Candidate Rating</td>
                  </tr>
                  {skillFields.map((field, index) => (
                    <tr key={field.id}>
                        <td><FormInput name={`skillsRating.${index}.skill`} control={control} /></td>
                        <td><FormInput name={`skillsRating.${index}.projectsHandled`} control={control} /></td>
                        <td><FormInput name={`skillsRating.${index}.relevantExperience`} control={control} /></td>
                        <td><FormInput name={`skillsRating.${index}.candidateRating`} control={control} /></td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={4}><FormInput name={`skillsRating.3.recruiterRating`} control={control} /></td>
                  </tr>

                  {/* Other Info */}
                  <tr>
                      <td className="font-bold">Communication (Poor / Average / Excellent)</td>
                      <td><FormSelect name="otherInfo.communicationSkills" control={control} options={['Poor', 'Average', 'Excellent', 'N/A']} /></td>
                      <td className="font-bold">Listening Skills (Poor / Average / Excellent)-</td>
                      <td><FormSelect name="otherInfo.listeningSkills" control={control} options={['Poor', 'Average', 'Excellent', 'N/A']} /></td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="printable-section-header bg-header-peach text-black font-bold p-1 text-center text-base">Other Information</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Earlier worked with Deloitte (Yes/No)</td>
                    <td><FormSelect name="otherInfo.earlierWorkedWithDeloitte" control={control} options={['Yes', 'No', 'N/A']} /></td>
                    <td colSpan={2}><FormInput name="otherInfo.deloitteFteContract" control={control}/></td>
                  </tr>
                  <tr>
                    <td colSpan={2}></td>
                    <td className="font-bold">If Yes, Tenure (From/To)</td>
                    <td><FormInput name="otherInfo.tenure" control={control}/></td>
                  </tr>
                   <tr>
                    <td colSpan={2}></td>
                    <td className="font-bold">If Yes, Reason to Leave Deloitte</td>
                    <td><FormInput name="otherInfo.reasonToLeaveDeloitte" control={control}/></td>
                  </tr>
                  <tr>
                    <td className="font-bold">If Yes, Deloitte Entity</td>
                    <td><FormInput name="otherInfo.deloitteEntity" control={control}/></td>
                    <td className="font-bold">Relevant documents for further process</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="font-bold">Any plan for a long leave for next 6 months</td>
                    <td><FormSelect name="otherInfo.longLeavePlan" control={control} options={['Yes', 'No', 'N/A']} /></td>
                    <td className="font-bold">Any other Input / Comments / Concerns:</td>
                    <td><FormInput name="otherInfo.otherInput" control={control}/></td>
                  </tr>

                   {/* Recruiter Details */}
                  <tr>
                    <td colSpan={4} className="printable-section-header bg-header-peach text-black font-bold p-1 text-center text-base">Recruiter Details</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Deloitte Recruiter</td>
                    <td><FormInput name="recruiterDetails.deloitteRecruiter" control={control}/></td>
                    <td className="font-bold">Vendor Recruiter Name</td>
                    <td><FormInput name="recruiterDetails.vendorRecruiterName" control={control}/></td>
                  </tr>
                  <tr>
                    <td className="font-bold">Deloitte CRM</td>
                    <td><FormInput name="recruiterDetails.deloitteCrm" control={control}/></td>
                    <td className="font-bold">Vendor Coordinator</td>
                    <td><FormInput name="recruiterDetails.vendorCoordinator" control={control}/></td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
    </Form>
  );
}
