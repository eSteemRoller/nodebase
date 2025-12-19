
'use client';

import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';



const formSchema = z.object({ 
  variableName: z
    .string()
    .min(1, { message: "Variable Name is required" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, { 
      message: "Variable Name must start with a letter or underscore and contain only letters, underscores, or numbers.",
    }),
  systemPrompt: z
    .string()
    .optional(),
  userPrompt: z 
    .string()
    .min(1, "A user prompt is required"),
});


export type ClaudeExecutionFormValues = z.infer<typeof formSchema>;

interface Props { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<ClaudeExecutionFormValues>;
};

export const ClaudeExecutionDialog = ({ 
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => { 
  const form = useForm<z.infer<typeof formSchema>>({ 
    resolver: zodResolver(formSchema),
    defaultValues: { 
      variableName: defaultValues.variableName || '',
      systemPrompt: defaultValues.systemPrompt || '',
      userPrompt: defaultValues.userPrompt || '',
    },
  });

  // Reset form values with defaults when dialog opens
  useEffect(() => { 
    if (open) { 
      form.reset({ 
        variableName: defaultValues.variableName || '',
        systemPrompt: defaultValues.systemPrompt || '',
        userPrompt: defaultValues.userPrompt || '',
      });
    }
  }, [ 
    open, 
    defaultValues, 
    form 
  ]);

  const watchVariableName = form.watch('variableName') || "myClaudeName";

  const handleSubmit = (values: z.infer<typeof formSchema>) => 
  { 
    onSubmit(values);
    onOpenChange(false);
  };

  return ( 
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Anthropic Claude AI Configuration
          </DialogTitle>
          <DialogDescription>
            Configure the name, credential, and prompt for this Claude AI execution node.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-8 mt-4'
          >
            <FormField 
              control={form.control}
              name='variableName'
              render={({ field }) => ( 
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="myClaudeName"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    <p>You can use a unique Variable Name dynamically to reference this node in other nodes.</p>
                    <p>Example: </p> 
                    <p>{`{{${watchVariableName}.text}}`}</p> {/* To Do: what's the Inngest output? */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name='systemPrompt'
              render={({ field }) => ( 
                <FormItem>
                  <FormLabel>System Prompt (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="You are a helpful assistant. ..."
                      className='min-h-[80px] font-mono text-sm'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Guides the behavior of the AI.
                    Use {"{{variables}}"} for simple values or a {"{{json variable}}"} 
                     &nbsp;to stringify objects.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name='userPrompt'
              render={({ field }) => ( 
                <FormItem>
                  <FormLabel>User Prompt (Required)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Summarize this text: {{json variable.text}}"
                      className='min-h-[120px] font-mono text-sm'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The prompt to send to the AI.
                    Use {"{{variables}}"} for simple values or a {"{{json variable}}"} 
                     &nbsp;to stringify objects.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className='mt-4'>
              <Button type='submit'>Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
};
