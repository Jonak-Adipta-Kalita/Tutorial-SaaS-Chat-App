import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import ClientProvider from "@/components/providers/ClientProvider";
import FirebaseAuthProvider from "@/components/providers/FirebaseAuthProvider";
import SubscriptionProvider from "@/components/providers/SubscriptionProvider";

export const metadata: Metadata = {
  title: "JAK SaaS Chat App",
  description: "Following Video by Sonny Sangha",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientProvider>
      <html lang="en">
        <body className="flex flex-col min-h-screen">
          <FirebaseAuthProvider>
            <SubscriptionProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Header />
                {children}
              </ThemeProvider>
            </SubscriptionProvider>
          </FirebaseAuthProvider>
        </body>
      </html>
    </ClientProvider>
  );
}
