'use client';

import { useState, useEffect, useCallback } from 'react';
import { parseResumeData, type ParseResumeDataOutput } from '@/ai/flows/resume-parser';
import { ResumeDataSchema, type ResumeData } from '@/lib/types';
import ResumeUploader from '@/components/resume-uploader';
import ResumeForm from '@/components/resume-form';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isParsing, setIsParsing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('resumeFormData');
      if (savedData) {
        const parsedData = ResumeDataSchema.parse(JSON.parse(savedData));
        if (parsedData && parsedData.basicInfo.candidateName) {
          setResumeData(parsedData);
        }
      }
    } catch (e) {
      console.error('Failed to load or parse data from localStorage', e);
      localStorage.removeItem('resumeFormData');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleResumeParse = async (file: File) => {
    setIsParsing(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const dataUri = reader.result as string;
      try {
        const result: ParseResumeDataOutput = await parseResumeData({ resumeDataUri: dataUri });
        
        // Get a fresh default object
        const defaultData = ResumeDataSchema.parse({});
        
        const fullData: ResumeData = {
          ...defaultData,
          basicInfo: { ...defaultData.basicInfo, ...result.basicInfo },
          educationDetails: { ...defaultData.educationDetails, ...result.educationDetails },
          employmentDetails: { ...defaultData.employmentDetails, ...result.employmentDetails },
          skillsRating: result.skillsRating.length > 0 
            ? result.skillsRating.map((skill, index) => ({
                ...defaultData.skillsRating[index],
                ...skill,
              }))
            : defaultData.skillsRating,
          otherInfo: { ...defaultData.otherInfo, ...result.otherInfo },
          recruiterDetails: { 
            ...defaultData.recruiterDetails,
            deloitteRecruiter: "HR Name" // Placeholder
          },
        };

        const validatedData = ResumeDataSchema.parse(fullData);
        setResumeData(validatedData);
        localStorage.setItem('resumeFormData', JSON.stringify(validatedData));

        toast({
          title: "Success!",
          description: "Your resume has been parsed successfully.",
        });

      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem parsing your resume. The file might be corrupted or in an unsupported format.",
        });
      } finally {
        setIsParsing(false);
      }
    };
    reader.onerror = () => {
      setIsParsing(false);
      toast({
        variant: "destructive",
        title: "File Error",
        description: "Could not read the selected file.",
      });
    }
  };

  const handleReset = useCallback(() => {
    setResumeData(null);
    localStorage.removeItem('resumeFormData');
  }, []);
  
  return (
    <main className="min-h-screen bg-background flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="flex items-center gap-4 mb-8 no-print">
          <Icons.logo className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold font-headline text-primary">Resume Formatter</h1>
            <p className="text-muted-foreground">Upload a resume to auto-fill the form, then edit and export.</p>
          </div>
        </header>

        <div className="printable-area">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Checking for saved session...</p>
            </div>
          ) : resumeData ? (
            <ResumeForm initialData={resumeData} onReset={handleReset} />
          ) : (
            <ResumeUploader onUpload={handleResumeParse} isLoading={isParsing} />
          )}
        </div>
      </div>
    </main>
  );
}
