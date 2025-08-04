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
      'The resume file (PDF or DOCX) content as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type ParseResumeDataInput = z.infer<typeof ParseResumeDataInputSchema>;

const ParseResumeDataOutputSchema = z.object({
  personalDetails: z.object({
    fullName: z.string().describe('The full name of the candidate.'),
    contactDetails: z.object({
      phone: z.string().describe('The phone number of the candidate.'),
      email: z.string().describe('The email address of the candidate.'),
    }).describe('The contact details of the candidate.'),
  }).describe('The personal details of the candidate.'),
  overview: z.string().describe('A professional summary of the candidate.'),
  experience: z.object({
    totalExperience: z.string().describe('The total years of experience of the candidate.'),
    relevantExperience: z.string().describe('The relevant years of experience of the candidate.'),
  }).describe('The experience of the candidate.'),
  education: z.array(z.object({
    degree: z.string().describe('The degree obtained.'),
    major: z.string().describe('The major of the degree.'),
    university: z.string().describe('The university where the degree was obtained.'),
    graduationDate: z.string().describe('The graduation date.'),
  })).describe('The education history of the candidate.'),
  skills: z.array(z.object({
    skillName: z.string().describe('The name of the skill.'),
    rating: z.number().min(1).max(5).describe('The rating of the skill (out of 5). A value of 0 is not allowed.'),
  })).describe('The skills of the candidate.'),
  location: z.object({
    currentLocation: z.string().describe('The current location of the candidate.'),
    preferredLocation: z.string().describe('The preferred location of the candidate.'),
  }).describe('The location preferences of the candidate.'),
  employmentHistory: z.array(z.object({
    company: z.string().describe('The name of the company.'),
    role: z.string().describe('The role of the candidate.'),
    startDate: z.string().describe('The start date of the employment.'),
    endDate: z.string().describe('The end date of the employment.'),
  })).describe('The employment history of the candidate.'),
  additionalDetails: z.object({
    noticePeriod: z.string().describe('The notice period of the candidate.'),
    currentOffer: z.string().describe('The current offer of the candidate.'),
    reasonForChange: z.string().describe('The reason for change of the candidate.'),
  }).describe('The additional details of the candidate.'),
});
export type ParseResumeDataOutput = z.infer<typeof ParseResumeDataOutputSchema>;

export async function parseResumeData(input: ParseResumeDataInput): Promise<ParseResumeDataOutput> {
  return parseResumeDataFlow(input);
}

const resumeParserPrompt = ai.definePrompt({
  name: 'resumeParserPrompt',
  input: {schema: ParseResumeDataInputSchema},
  output: {schema: ParseResumeDataOutputSchema},
  prompt: `You are an expert resume parser that extracts information from resumes.

You will be given a resume as a data URI. Extract the following information from the resume and respond in JSON format:

- Personal Details (full name, contact details (phone, email))
- Overview (A professional summary of the candidate)
- Experience (total experience, relevant experience)
- Education (degree, major, university, graduation date)
- Skills (skill name, rating (out of 5, where 1 is the minimum))
- Location (current location, preferred location)
- Employment History (company, role, start date, end date)
- Additional Details (notice period, current offer, reason for change)

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
    return output!;
  }
);
