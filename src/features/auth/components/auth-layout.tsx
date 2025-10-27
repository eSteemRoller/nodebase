
import Link from "next/link"
import Image from "next/image"


export const AuthLayout = ({ children } : { children: React.ReactNode; }) => { 
  return ( 
    <div className="bg-muted flex min-h-svh flex-col justify-center items-center gap-8 p-8 md:p-12">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <Link href='/' className="flex items-center gap-4 self-center font-medium">
          <Image src='/logos/logo.svg' width={32} height={32} alt='Nodebase logo' />
          Nodebase
        </Link>
        {children}
      </div>
    </div>  
  )
}