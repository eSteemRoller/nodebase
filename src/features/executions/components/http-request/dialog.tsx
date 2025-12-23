
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
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
  endpoint: z
    .string()
    .min(1, { message: "Please enter a valid URL" }),
  method: z
    .enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
  body: z 
    .string()
    .optional()
    // TO DO: .refine() (JSON5)
});



export type HttpRequestFormValues = z.infer<typeof formSchema>;

interface Props { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<HttpRequestFormValues>;
};

export const HttpRequestDialog = ({ 
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => { 
  const form = useForm<z.infer<typeof formSchema>>({ 
    resolver: zodResolver(formSchema),
    defaultValues: { 
      variableNodeName: defaultValues.variableNodeName || '',
      endpoint: defaultValues.endpoint || '',
      method: defaultValues.method || 'GET',
      body: defaultValues.body || '',
    },
  });

  // Reset form values with defaults when dialog opens
  useEffect(() => { 
    if (open) { 
      form.reset({ 
      variableNodeName: defaultValues.variableNodeName || '',
      endpoint: defaultValues.endpoint || '',
      method: defaultValues.method || 'GET',
      body: defaultValues.body || '',
      });
    }
  }, [ 
    open, 
    defaultValues, 
    form 
  ]);

  const watchVariableNodeName = form.watch('variableNodeName') || "myApiCallNodeName";
  const watchMethod = form.watch('method');
  const showBodyField = ['POST', 'PUT', 'PATCH']
    .includes(watchMethod);

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
            HTTP Request
          </DialogTitle>
          <DialogDescription>
            Configure settings for this HTTP Request node.
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
                      placeholder="myApiCallNodeName"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    <p>You can use a unique Variable Node Name dynamically to reference this node in other nodes.</p>
                    <p>Example: </p> 
                    <p>{`{{${watchVariableNodeName}.httpResponse.data}}`}</p>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name='method'
              render={({ field }) => ( 
                <FormItem>
                  <FormLabel>Method</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Select a method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='GET'>GET</SelectItem>
                      <SelectItem value='POST'>POST</SelectItem>
                      <SelectItem value='PUT'>PUT</SelectItem>
                      <SelectItem value='PATCH'>PATCH</SelectItem>
                      <SelectItem value='DELETE'>DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The HTTP method to use for this request
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name='endpoint'
              render={({ field }) => ( 
                <FormItem>
                  <FormLabel>Endpoint URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://api.example.com/users/{{httpResponse.data.id}}"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a static/standard URL (no variables) or use {"{variables}"} for 
                    simple values or a {"{{json variable}}"} to stringify objects.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showBodyField && ( 
              <FormField 
                control={form.control}
                name='body'
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Request Body</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={ 
                          '{\n "userId": "{{httpResponse.data.id}}",\n "name": "{{httpResponse.data.name}}",\n "items": "{{httpResponse.data.items}}"\n}'
                        }
                        className='min-h-[120px] font-mono text-sm'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Example: A JSON object with template variables. Use {"{variables}"} for 
                      simple values or a {"{{json variable}}"} to stringify objects.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter className='mt-4'>
              <Button type='submit'>Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
};
