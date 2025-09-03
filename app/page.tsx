/*"use client";

import InteractiveAvatar from "@/components/InteractiveAvatar";
export default function App() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-[900px] flex flex-col items-start justify-start gap-5 mx-auto pt-4 pb-20">
        <div className="w-full">
          <InteractiveAvatar />
        </div>
      </div>
    </div>
  );
}*/

// File: app/page.tsx
import SessionProvider from './SessionProvider';
import ClientPage from './ClientPage';

export default function HomePage() {
  return (
    <SessionProvider>
      <ClientPage />
    </SessionProvider>
  );
}
