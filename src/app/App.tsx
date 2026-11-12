import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { TenantProvider } from '@/providers';
import { ToastProvider } from '@/shared/components/ui';

export const App: React.FC = () => {
  return (
    <TenantProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </TenantProvider>
  );
};

export default App;
