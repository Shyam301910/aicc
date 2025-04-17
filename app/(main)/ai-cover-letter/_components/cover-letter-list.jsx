"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog";
import { deleteCoverLetter } from "@/actions/cover-letter";

// CoverletterList component for displaying a list of cover letters
export default function CoverLetterList({ coverLetters }) {
  const router = useRouter();

  // Function to handle deletion of a cover letter by id
  const handleDelete = async (id) => {
    try {
      await deleteCoverLetter(id);
      toast.success("Cover letter deleted successfully!");
      router.refresh(); // Refresh the page to reflect the changes
    } catch (error) {
      toast.error(error.message || "Failed to delete cover letter");
    }
  };

  // If no cover letters are found, display a message
  if (!coverLetters?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Cover Letters Yet</CardTitle>
          <CardDescription>
            Create your first cover letter to get started
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Map through the cover letters and display them in a card format
  return (
    <div className="space-y-4">

      {coverLetters.map((letter) => (
        <Card key={letter.id} className="group relative ">
          
          {/* Header */}
          <CardHeader>
            <div className="flex items-start justify-between">

              <div>
                {/* title */}
                <CardTitle className="text-xl gradient-title">
                  {letter.jobTitle} at {letter.companyName}
                </CardTitle>

                {/* description */}
                <CardDescription>
                  Created {format(new Date(letter.createdAt), "PPP")}
                </CardDescription>
              </div>

              <div className="flex space-x-2">

                <AlertDialog>
                  {/* Button to view the cover letter */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.push(`/ai-cover-letter/${letter.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  {/* Trigger to delete cover letter*/}
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                    
                    {/* Alert Dialog content */}
                  <AlertDialogContent>

                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Cover Letter?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your cover letter for {letter.jobTitle} at{" "}
                        {letter.companyName}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      {/* Cancel */}
                      <AlertDialogCancel>Cancel</AlertDialogCancel> 
                      {/* Delete */}
                      <AlertDialogAction
                        onClick={() => handleDelete(letter.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>


                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>

            {/* Job description */}
          <CardContent>
            <div className="text-muted-foreground text-sm line-clamp-3">
              {letter.jobDescription}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
