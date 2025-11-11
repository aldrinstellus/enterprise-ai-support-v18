'use client';

import { useEffect, Suspense } from 'react';
import { InteractiveChatWithFloatingInput } from '@/components/chat/InteractiveChatWithFloatingInput';
import { usePersona } from '@/hooks/use-persona';

export const dynamic = 'force-dynamic';

export default function CSMDemoPage() {
  const { setPersona } = usePersona();

  useEffect(() => {
    setPersona('csm');
  }, [setPersona]);

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <InteractiveChatWithFloatingInput />
    </Suspense>
  );
}
