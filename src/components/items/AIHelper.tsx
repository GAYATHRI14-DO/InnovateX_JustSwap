
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2 } from 'lucide-react';
import { generateDescription } from '@/ai/flows/ai-description-helper-flow';
import { useToast } from '@/hooks/use-toast';

interface AIHelperProps {
  onDescriptionGenerated: (description: string) => void;
  title: string;
  category: string;
}

export function AIHelper({ onDescriptionGenerated, title, category }: AIHelperProps) {
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!title) {
      toast({
        title: "Title required",
        description: "Please enter an item title first.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k !== '');
      const result = await generateDescription({
        itemTitle: title,
        category: category || 'General',
        keywords: keywordList.length > 0 ? keywordList : ['excellent condition', 'unique', 'sustainable']
      });
      onDescriptionGenerated(result.description);
      toast({
        title: "Success!",
        description: "AI description generated.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Could not generate description. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <Sparkles className="h-5 w-5" />
        <h3 className="font-headline font-semibold">AI Description Helper</h3>
      </div>
      <div className="space-y-2">
        <Label htmlFor="keywords">Keywords (comma separated)</Label>
        <Input 
          id="keywords" 
          placeholder="e.g. leather, vintage, minor scratch, high-quality" 
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
      </div>
      <Button 
        onClick={handleGenerate} 
        disabled={isGenerating} 
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Suggest Description
          </>
        )}
      </Button>
    </div>
  );
}
