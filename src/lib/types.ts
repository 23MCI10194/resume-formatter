import { z } from "zod";

export const ResumeDataSchema = z.object({
  personalDetails: z.object({
    fullName: z.string().default("").describe('The full name of the candidate.'),
    contactDetails: z.object({
      phone: z.string().default("").describe('The phone number of the candidate.'),
      email: z.string().default("").describe('The email address of the candidate.'),
    }).describe('The contact details of the candidate.'),
  }).describe('The personal details of the candidate.'),
  
  experience: z.object({
    totalExperience: z.string().default("").describe('The total years of experience of the candidate.'),
    relevantExperience: z.string().default("").describe('The relevant years of experience of the candidate.'),
  }).describe('The experience of the candidate.'),
  
  education: z.array(z.object({
    degree: z.string().default("").describe('The degree obtained.'),
    major: z.string().default("").describe('The major of the degree.'),
    university: z.string().default("").describe('The university where the degree was obtained.'),
    graduationDate: z.string().default("").describe('The graduation date.'),
  })).default([]).describe('The education history of the candidate.'),
  
  skills: z.array(z.object({
    skillName: z.string().default("").describe('The name of the skill.'),
    rating: z.number().min(1).max(5).default(3).describe('The rating of the skill (out of 5).'),
  })).default([]).describe('The skills of the candidate.'),
  
  location: z.object({
    currentLocation: z.string().default("").describe('The current location of the candidate.'),
    preferredLocation: z.string().default("").describe('The preferred location of the candidate.'),
  }).describe('The location preferences of the candidate.'),
  
  employmentHistory: z.array(z.object({
    company: z.string().default("").describe('The name of the company.'),
    role: z.string().default("").describe('The role of the candidate.'),
    startDate: z.string().default("").describe('The start date of the employment.'),
    endDate: z.string().default("").describe('The end date of the employment.'),
  })).default([]).describe('The employment history of the candidate.'),
  
  additionalDetails: z.object({
    noticePeriod: z.string().default("").describe('The notice period of the candidate.'),
    currentOffer: z.string().default("").describe('The current offer of the candidate.'),
    reasonForChange: z.string().default("").describe('The reason for change of the candidate.'),
  }).describe('The additional details of the candidate.'),
  
  deloitteSpecific: z.object({
    isAuthorized: z.enum(['yes', 'no', 'na']).default('na'),
    previouslyEmployed: z.enum(['yes', 'no', 'na']).default('na'),
    needsSponsorship: z.enum(['yes', 'no', 'na']).default('na'),
  }),
  
  recruiterDetails: z.object({
    name: z.string().default(""),
    email: z.string().default(""),
    submissionDate: z.string().default(""),
  }),
});

export type ResumeData = z.infer<typeof ResumeDataSchema>;
