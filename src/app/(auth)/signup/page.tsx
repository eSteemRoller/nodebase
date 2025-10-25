
import { RegisterForm } from "@/features/auth/components/register-form";
import { requireUnauth } from "@/lib/auth-utils";


export async function Page() { 
  await requireUnauth();

  return ( 
    <div>
      <RegisterForm />
    </div>
  );
};