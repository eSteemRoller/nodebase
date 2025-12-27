
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
  variableNodeName: z
    .string()
    .min(1, { message: "Variable Node Name is required" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, { 
      message: "Variable Node Name must start with a letter or underscore and contain only letters, underscores, or numbers.",
    }),
  content: z
    .string()
    .min(1, "Post content is required"),
  webhookUrl: z
    .string()
    .min(1, "Webhook URL is required")
});


export type SlackExecutionFormValues = z.infer<typeof formSchema>;

interface Props { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<SlackExecutionFormValues>;
};

export const SlackExecutionDialog = ({ 
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => { 
  const form = useForm<z.infer<typeof formSchema>>({ 
    resolver: zodResolver(formSchema),
    defaultValues: { 
      variableNodeName: defaultValues.variableNodeName || '',
      content: defaultValues.content || '',
      webhookUrl: defaultValues.webhookUrl || '',
    },
  });

  // Reset form values with defaults when dialog opens
  useEffect(() => { 
    if (open) { 
      form.reset({ 
        variableNodeName: defaultValues.variableNodeName || '',
        content: defaultValues.content || '',
        webhookUrl: defaultValues.webhookUrl || '',
      });
    }
  }, [ 
    open, 
    defaultValues, 
    form 
  ]);

  const watchVariableNodeName = form.watch('variableNodeName') || "mySlackNodeName";

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
            Slack Configuration
          </DialogTitle>
          <DialogDescription>
            Configure the Slack webhook settings for this execution node.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-8 mt-4'
          >
            <FormField 
              control={form.control}
              name='variableNodeName'
              render={({ field }) => ( 
                <FormItem>
                  <FormLabel>Variable Node Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="mySlackNodeName"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    <p>You can use a unique Variable Node Name dynamically with {"{}"} to share this node's data into other nodes.</p>
                    <p>Example: </p> 
                    <p>{`{{${watchVariableNodeName}.text}}`}</p> {/* To Do: what's the Inngest output? */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name='webhookUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://slack.com/api/webhooks/..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    URL created at Slack: More → Tools → Workflows → Webhooks 
                      → Create Webhook? → Copy Webhook URL?
                      {/* To do: Correct this */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name='content'
              render={({ field }) => ( 
                <FormItem>
                  <FormLabel>Post Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Examples: Summary: {{aiResponse}}, Summary: {{myGemini.text}}..."
                      className='min-h-[80px] font-mono text-sm'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The content and/or text in your post.
                  </FormDescription>
                  <FormDescription>
                    Note: Variables {"({} 'variable_name')"} allow you to share dynamic data from node to node.
                      &nbsp;Use {"{} 'variable name'"} for individual values or a {"{} 'json_variable_name'"} 
                      &nbsp;to stringify objects.
                  </FormDescription>
                  <FormDescription> 
                    Important note: Unless you're sure otherwise, make sure 
                      the Slack webhook "Data Variable" at least contains a variable 
                      with the "Key" as "content" {"({} content)"}.
                  </FormDescription>
                  <FormDescription> 
                    More dynamic features to be added in the future. 
                    {/* To do: Add a button offering detailed scrollable Slack instructions */}
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
