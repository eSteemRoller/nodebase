
import { LoginForm } from "@/features/auth/components/login-form";
import { requireUnauth } from "@/lib/auth-utils";


export async function Page() { 
  await requireUnauth();

  return ( 
    <div>
      <LoginForm />
    </div>
  );
};
