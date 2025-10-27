
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { email, z } from "zod";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";


const loginSchema = z.object({ 
  email: z.email("Invalid e-mail address"),
  password: z.string().min(1, "Invalid password"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() { 
  const router = useRouter();

  const form = useForm<LoginFormValues>({ 
    resolver: zodResolver(loginSchema),
    defaultValues: { 
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => { 
    await authClient.signIn.email(
      { 
        email: values.email,
        password: values.password,
        callbackURL: '/',
      },
      {
        onSuccess: () => { 
          router.push('/');
        },
        onError: (ctx) => { 
          toast.error(ctx.error.message);
        },
      },
    );
  };

  const isPending = form.formState.isSubmitting;

  return ( 
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>
            Welcome Back!
          </CardTitle>
          <CardDescription>
            Login to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-8">
                <div className="flex flex-col gap-4">
                  <Button 
                    variant="outline"
                    className="w-full"
                    type="button"
                    disabled={isPending}
                  >
                    <Image src='/logos/github.svg' width={24} height={24} alt="GitHub logo" />
                    Continue with GitHub
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full"
                    type="button"
                    disabled={isPending}
                  >
                    <Image src='/logos/google.svg' width={24} height={24} alt="Google logo" />
                    Continue with Google
                  </Button>
                </div>
                <div className="grid gap-8">
                  <FormField 
                    control={form.control}
                    name="email"
                    render={({ field }) => ( 
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="Your e-mail address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField 
                    control={form.control}
                    name="password"
                    render={({ field }) => ( 
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="Your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isPending}
                  >
                    Login
                  </Button>
                </div>
                <div className="text-center text-sm">
                  First visit?{" "}
                  <Link href="/signup" 
                    className="underline underline-offset-4"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
