import type { Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Provider } from 'jotai';
import "./globals.css";


export const metadata: Metadata = {
  title: "Nodebase",
  description: "Easy workflow automation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en"
      className={"js-focus-visible data-js-focus-visible=\"\" "}
    >
      <body>
        <TRPCReactProvider>
          <NuqsAdapter>
            <Provider>
              {children}
              <Toaster />
            </Provider>
          </NuqsAdapter>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
