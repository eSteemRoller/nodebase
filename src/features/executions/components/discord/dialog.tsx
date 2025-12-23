
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
  username: z
    .string()
    .optional(),
  content: z
    .string()
    .min(1, "Message content is required")
    .max(2000, "Discord messages cannot execeed 2000 characters"),
  webhookUrl: z
    .string()
    .min(1, "Webhook URL is required")
});


export type DiscordExecutionFormValues = z.infer<typeof formSchema>;

interface Props { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<DiscordExecutionFormValues>;
};

export const DiscordExecutionDialog = ({ 
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => { 
  const form = useForm<z.infer<typeof formSchema>>({ 
    resolver: zodResolver(formSchema),
    defaultValues: { 
      variableNodeName: defaultValues.variableNodeName || '',
      username: defaultValues.username || '',
      content: defaultValues.content || '',
      webhookUrl: defaultValues.webhookUrl || '',
    },
  });

  // Reset form values with defaults when dialog opens
  useEffect(() => { 
    if (open) { 
      form.reset({ 
        variableNodeName: defaultValues.variableNodeName || '',
        username: defaultValues.username || '',
        content: defaultValues.content || '',
        webhookUrl: defaultValues.webhookUrl || '',
      });
    }
  }, [ 
    open, 
    defaultValues, 
    form 
  ]);

  const watchVariableNodeName = form.watch('variableNodeName') || "myDiscordNodeName";

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
            Discord Configuration
          </DialogTitle>
          <DialogDescription>
            Configure the Discord webhook settings for this execution node.
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
                      placeholder="myDiscordNodeName"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    <p>You can use a unique Variable Node Name dynamically to reference this node in other nodes.</p>
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
                      placeholder="https://discord.com/api/webhooks/..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    URL created at Discord: Edit Channel →
                      Integrations → Create Webhook → Copy Webhook URL
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
                    The message and/or text in your post.
                    Use {"{{variables}}"} for simple values or a {"{{json variable}}"} 
                      &nbsp;to stringify objects.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bot Username (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Workflow Bot's Name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will override the webhook's default username
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
