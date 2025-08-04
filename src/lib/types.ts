import { z } from "zod";

const YesNoSchema = z.enum(['Yes', 'No', 'N/A']).default('N/A');

export const ResumeDataSchema = z.object({
  basicInfo: z.object({
    jobPostingId: z.string().default("").describe("Job Posting ID"),
    jobSeekerId: z.string().default("").describe("Job Seeker ID"),
    vendorName: z.string().default("").describe("Vendor Name"),
    positionApplied: z.string().default("").describe("Position Applied"),
    requisitionReceivedDate: z.string().default("").describe("Requisition Received Date"),
    contactNo: z.string().default("").describe("Contact Number"),
    candidateName: z.string().default("").describe("Candidate Name as per PAN"),
    totalExperience: z.string().default("").describe("Total Experience"),
    email: z.string().default("").describe("Email"),
    relevantExperience: z.string().default("").describe("Relevant Experience"),
    currentLocation: z.string().default("").describe("Current Location"),
    relocation: YesNoSchema.describe("Relocation preference"),
    preferredLocation: z.string().default("").describe("Preferred Location"),
    workPreference: z.enum(['Office', 'Home', 'Both', 'N/A']).default('N/A').describe("Work from office/home preference"),
  }).default({}).describe('Basic Information'),
  
  educationDetails: z.object({
    bachelors: z.object({
      degree: z.string().default("").describe("Bachelor's Degree"),
      from: z.string().default("").describe("From Date"),
      to: z.string().default("").describe("To Date"),
    }).default({}),
    masters: z.object({
      degree: z.string().default("").describe("Master's Degree"),
      from: z.string().default("").describe("From Date"),
      to: z.string().default("").describe("To Date"),
    }).default({}),
    certifications: z.string().default("").describe("Other certifications"),
    awarenessAboutContractRole: YesNoSchema,
    holdingOtherOffers: YesNoSchema,
    reasonForChange: z.string().default(""),
  }).default({}).describe('Education Details'),

  employmentDetails: z.object({
    currentEmployer: z.string().default("").describe("Current/Last Employer"),
    from: z.string().default("").describe("From Date"),
    to: z.string().default("").describe("To Date"),
    employmentType: z.string().default("").describe("Role FTE/Contract with Current or Last Employer"),
    overseasExperience: YesNoSchema.describe("Overseas Experience"),
    noticePeriod: z.string().default("").describe("Notice Period"),
    benchMarketProfile: z.string().default("").describe("Bench/Market Profile"),
    shifts: YesNoSchema.describe("Willingness to work in shifts"),
  }).default({}).describe('Employment Details'),
  
  skillsRating: z.array(z.object({
    skill: z.string().default("").describe("Skill Name"),
    projectsHandled: z.string().default("").describe("Number of Projects Handled"),
    relevantExperience: z.string().default("").describe("Relevant Experience in Skill"),
    candidateRating: z.number().min(1).max(5).default(1).describe("Candidate's self-rating"),
  })).default(Array(3).fill(undefined).map(() => ({
      skill: "",
      projectsHandled: "",
      relevantExperience: "",
      candidateRating: 1,
  }))).describe('Skills Rating'),
  
  otherInfo: z.object({
    communicationSkills: z.enum(['Poor', 'Average', 'Excellent', 'N/A']).default('N/A'),
    listeningSkills: z.enum(['Poor', 'Average', 'Excellent', 'N/A']).default('N/A'),
    earlierWorkedWithDeloitte: YesNoSchema,
    deloitteFteContract: z.string().default("").describe("If yes, was it FTE or contract?"),
    deloitteEntity: z.string().default("").describe("If yes, which Deloitte entity?"),
    tenure: z.string().default("").describe("If yes, tenure (From/To)"),
    reasonToLeaveDeloitte: z.string().default("").describe("If yes, reason to leave Deloitte"),
    longLeavePlan: YesNoSchema.describe("Any plan for a long leave for next 6 months"),
    otherInput: z.string().default("").describe("Any other Input / Comments / Concerns"),
  }).default({}).describe('Other Information'),
  
  recruiterDetails: z.object({
    deloitteRecruiter: z.string().default(""),
    vendorRecruiterName: z.string().default(""),
    deloitteCrm: z.string().default(""),
    vendorCoordinator: z.string().default(""),
    recruiterRating: z.string().default("").describe("Recruiter's rating of the candidate"),
  }).default({}).describe('Recruiter Details'),
});

export type ResumeData = z.infer<typeof ResumeDataSchema>;
