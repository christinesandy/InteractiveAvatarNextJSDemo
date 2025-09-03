// File: app/ClientPage.tsx
'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';

// Import the InteractiveAvatar component from your original code
import InteractiveAvatar from "@/components/InteractiveAvatar";

// This function now contains your actual HeyGen page content.
function OriginalPageContent() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-[900px] flex flex-col items-start justify-start gap-5 mx-auto pt-4 pb-20">
        <div className="w-full">
          <InteractiveAvatar />
        </div>
      </div>
    </div>
  );
}

// This is the main component that handles the login check.
export default function ClientPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // If the session status is 'unauthenticated', redirect to the login page.
    if (status === 'unauthenticated') {
      signIn();
    }
  }, [status]);

  // While checking the session, display a simple loading message.
  if (status === 'loading') {
    return <p style={{ textAlign: 'center', paddingTop: '40px' }}>Loading...</p>;
  }

  // If the user is successfully authenticated, show the main avatar page.
  if (status === 'authenticated') {
    return <OriginalPageContent />;
  }

  // Render nothing while preparing for the redirect.
  return null;
}