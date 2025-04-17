// app/resume/_components/entry-form.jsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { entrySchema } from "@/app/lib/schema";
import { Sparkles, PlusCircle, X, Pencil, Save, Loader2 } from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

// display in Apr 2024
const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const date = parse(dateString, "yyyy-MM", new Date());
  return format(date, "MMM yyyy");
};

// EntryForm component handles entrySchema of the resume builder
export function EntryForm({ type, entries, onChange }) {
  const [isAdding, setIsAdding] = useState(false); // entry schema  section is being added

  //  entrySchema form
  const { register, handleSubmit: handleValidation, formState: { errors }, reset, watch, setValue, } = useForm({ // setValue is used to set the value of a particular field
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  // watch the current field to determine if the end date should be disabled
  const current = watch("current");

  // handleAdd function to add the entrySchema
  const handleAdd = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate),
    };

    // Updates the entries list by appending the new formattedEntry
    onChange([...entries, formattedEntry]);

    reset();
    setIsAdding(false);
  });

  // removes the entry of the selected section
  const handleDelete = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
  };

  // useFetch hook to call the improveWithAI()
  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  // Add this effect to handle the improvement result
  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Description improved successfully!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  // the improved description will be stored in the improvedContent
  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAIFn({
      current: description,
      type: type.toLowerCase(), // 'experience', 'education', or 'project'
    });
  };

  // entryForm 
  return (
    <div className="space-y-4">

      {/* Content priview after adding the entry section */}
      <div className="space-y-4">
        {entries.map((item, index) => (
          <Card key={index}>

            {/* Header */}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

              {/* Title */}
              <CardTitle className="text-sm font-medium">
                {item.title} @ {item.organization}
              </CardTitle>

              {/* Delete section */}
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => handleDelete(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            {/* dates and description */}
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {item.current
                  ? `${item.startDate} - Present`
                  : `${item.startDate} - ${item.endDate}`}
              </p>
              <p className="mt-2 text-sm whitespace-pre-wrap">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/*Section to take the inputs from user  */}
      {isAdding && (
        <Card>
          {/* Header */}
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
          </CardHeader>

          {/* Card content */}
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">

              {/* Position */}
              <div className="space-y-2">
                <Input
                  placeholder="Title/Position"
                  {...register("title")}
                  error={errors.title}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              {/* Organization */}
              <div className="space-y-2">
                <Input
                  placeholder="Organization/Company"
                  {...register("organization")}
                  error={errors.organization}
                />
                {errors.organization && (
                  <p className="text-sm text-red-500">
                    {errors.organization.message}
                  </p>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">

              {/* StartDate */}
              <div className="space-y-2">
                <Input
                  type="month"
                  {...register("startDate")}
                  error={errors.startDate}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              {/* EndDate */}
              <div className="space-y-2">
                <Input
                  type="month"
                  {...register("endDate")}
                  disabled={current} // Disable if the section is current one
                  error={errors.endDate}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Current checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="current"
                {...register("current")}
                onChange={(e) => {
                  setValue("current", e.target.checked);
                  if (e.target.checked) {
                    setValue("endDate", "");
                  }
                }}
              />
              <label htmlFor="current">Current {type}</label>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Textarea
                placeholder={`Description of your ${type.toLowerCase()}`}
                className="h-32"
                {...register("description")}
                error={errors.description}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Improve with AI button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleImproveDescription}
              disabled={isImproving || !watch("description")}
            >
              {isImproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Improve with AI
                </>
              )}
            </Button>
          </CardContent>

          {/* Footer */}
          <CardFooter className="flex justify-end space-x-2">
            {/* Cancel entry button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset(); //reset the section
                setIsAdding(false); // entrySchema section is not being added
              }}
            >
              Cancel
            </Button>

            {/* Add entry button */}
            <Button type="button" onClick={handleAdd}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Button to add the section */}
      {!isAdding && (
        <Button
          className="w-full"
          variant="outline"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add {type}
        </Button>
      )}
    </div>
  );
}
