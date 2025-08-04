'use server';
/**
 * @fileOverview Parses resume data using an LLM.
 *
 * - parseResumeData - A function that handles the resume parsing process.
 * - ParseResumeDataInput - The input type for the parseResumeData function.
 * - ParseResumeDataOutput - The return type for the parseResumeData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseResumeDataInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The resume file (PDF or DOCX) content as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ParseResumeDataInput = z.infer<typeof ParseResumeDataInputSchema>;

const YesNoSchema = z.enum(['Yes', 'No', 'N/A']).describe("Yes, No, or Not Applicable");

const ParseResumeDataOutputSchema = z.object({
    basicInfo: z.object({
        positionApplied: z.string().describe("The position the candidate is applying for."),
        candidateName: z.string().describe("The full name of the candidate."),
        contactNo: z.string().describe("The phone number of the candidate."),
        email: z.string().describe("The email address of the candidate."),
        totalExperience: z.string().describe("The total years of work experience."),
        relevantExperience: z.string().describe("The relevant years of work experience for the position."),
        currentLocation: z.string().describe("The current city and state of the candidate."),
        preferredLocation: z.string().describe("The preferred work location."),
        relocation: YesNoSchema.describe("Whether the candidate is open to relocation."),
    }).describe('Basic Information section'),

    educationDetails: z.object({
        bachelors: z.object({
          degree: z.string().describe("Bachelor's Degree name and major."),
          from: z.string().describe("Start date of Bachelor's degree."),
          to: z.string().describe("End date or graduation date of Bachelor's degree."),
        }),
        masters: z.object({
          degree: z.string().describe("Master's Degree name and major, if any."),
          from: z.string().describe("Start date of Master's degree."),
          to: z.string().describe("End date or graduation date of Master's degree."),
        }),
        certifications: z.string().describe("Any other relevant certifications mentioned."),
        awarenessAboutContractRole: YesNoSchema,
        holdingOtherOffers: YesNoSchema,
        reasonForChange: z.string(),
    }).describe('Education Details section'),

    employmentDetails: z.object({
        currentEmployer: z.string().describe("The name of the current or most recent employer."),
        employmentType: z.string().describe("The type of role (e.g., Full-Time, Contract)."),
        from: z.string().describe("Start date of the most recent employment."),
        to: z.string().describe("End date of the most recent employment (or 'Present')."),
        noticePeriod: z.string().describe("The notice period required for leaving the current job."),
        overseasExperience: YesNoSchema,
        benchMarketProfile: z.string(),
        shifts: YesNoSchema,
    }).describe('Employment Details section'),

    skillsRating: z.array(z.object({
        skill: z.string().describe("A key skill possessed by the candidate."),
        projectsHandled: z.string().describe("Number of projects handled for this skill."),
        relevantExperience: z.string().describe("Years of experience with this skill."),
        candidateRating: z.number().min(1).max(5).describe("Candidate's proficiency in this skill, rated 1 (Poor) to 5 (Excellent). Infer this from the resume."),
    })).min(3).max(3).describe("A list of the top 3 most relevant skills from the resume."),

    otherInfo: z.object({
        communicationSkills: z.enum(['Poor', 'Average', 'Excellent', 'N/A']),
        listeningSkills: z.enum(['Poor', 'Average', 'Excellent', 'N/A']),
        earlierWorkedWithDeloitte: YesNoSchema,
        deloitteFteContract: z.string().describe("If yes, was it FTE or contract?"),
        deloitteEntity: z.string().describe("If yes, which Deloitte entity?"),
        tenure: z.string().describe("If yes, tenure (From/To)"),
        reasonToLeaveDeloitte: z.string().describe("If yes, reason to leave Deloitte"),
        longLeavePlan: YesNoSchema,
        otherInput: z.string().describe("Any other Input / Comments / Concerns"),
    }).describe('Other Information section'),
});

export type ParseResumeDataOutput = z.infer<typeof ParseResumeDataOutputSchema>;

export async function parseResumeData(input: ParseResumeDataInput): Promise<ParseResumeDataOutput> {
  return parseResumeDataFlow(input);
}

const resumeParserPrompt = ai.definePrompt({
  name: 'resumeParserPrompt',
  input: {schema: ParseResumeDataInputSchema},
  output: {schema: ParseResumeDataOutputSchema},
  prompt: `You are an expert resume parser for a recruitment agency. You will be given a resume as a data URI. Extract the following information from the resume and respond in JSON format. Be precise and only extract information that is explicitly available in the resume. If a value is not available, provide a sensible default or an empty string.

- **Basic Information**:
  - Position Applied: The job title the candidate is targeting.
  - Candidate Name: Full name.
  - Contact No: Phone number.
  - Email: Email address.
  - Total Experience: Extract the total years of work experience. It MUST be only a number followed by 'years' (e.g., '10 years'). Do NOT include any other text or summary.
  - Relevant Experience: Extract the relevant years of work experience for the position. It MUST be only a number followed by 'years' (e.g., '5 years'). Do NOT include any other text or summary.
  - Current Location: City, State/Country.
  - Preferred Location: Any mentioned preferred work locations.
  - Relocation: Is the candidate willing to relocate? (Yes/No/N/A).

- **Education Details**:
  - Bachelors: Degree, start date, and end date.
  - Masters: Degree, start date, and end date (if applicable).
  - Certifications: List any other certifications.
  - Awareness about Contract Role: (Yes/No/N/A).
  - Holding any other offers: (Yes/No/N/A).
  - Reason for Change: Any stated reason for looking for a new job.

- **Employment Details**:
  - Current/Last Employer: Name of the company.
  - Employment Type: e.g., Full-Time, Contract.
  - From/To Dates: Employment duration for the latest role.
  - Notice Period: If mentioned.
  - Overseas Experience If Any: (Yes/No/N/A).
  - Bench/ Market Profile:
  - Shifts: (Yes/No/N/A).

- **Skills Rating**:
  - Identify the top 3 skills from the resume. For each skill, provide a rating from 1 to 5 based on your interpretation of their proficiency from the projects and experience described. 1 is poor, 5 is excellent. Also include number of projects and years of experience for each skill.

- **Other Information**:
  - Communication Skills: (Poor/Average/Excellent/N/A).
  - Listening Skills: (Poor/Average/Excellent/N/A).
  - Earlier worked with Deloitte: (Yes/No/N/A).
  - If Yes, Deloitte (FTE/Contract):
  - If Yes, Deloitte Entity:
  - If Yes, Tenure (From/To):
  - If Yes, Reason to Leave Deloitte:
  - Any plan for a long leave for next 6 months: (Yes/No/N/A).
  - Any other Input / Comments / Concerns:

Resume: {{media url=resumeDataUri}}`,
});

const parseResumeDataFlow = ai.defineFlow(
  {
    name: 'parseResumeDataFlow',
    inputSchema: ParseResumeDataInputSchema,
    outputSchema: ParseResumeDataOutputSchema,
  },
  async input => {
    const {output} = await resumeParserPrompt(input);
     if (output) {
      output.skillsRating = output.skillsRating.map(skill => ({
        ...skill,
        candidateRating: Math.max(1, skill.candidateRating || 1),
      }));
    }
    return output!;
  }
);
