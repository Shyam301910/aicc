import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCoverLetter } from "@/actions/cover-letter";
import CoverLetterPreview from "../_components/cover-letter-preview";

// Component for editing a cover letter
export default async function EditCoverLetterPage({ params }) {
  const { id } = await params;
  
  // Fetch the cover letter using the provided ID
  const coverLetter = await getCoverLetter(id);

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-2">

        {/* Link button to cover letter list page */}
        <Link href="/ai-cover-letter">
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Cover Letters
          </Button>
        </Link>

        {/* Cover letter title */}
        <h1 className="text-6xl font-bold gradient-title mb-6">
          {coverLetter?.jobTitle} at {coverLetter?.companyName}
        </h1>
      </div>

      {/* Cover letter preview */}
      <CoverLetterPreview content={coverLetter?.content} />
    </div>
  );
}
