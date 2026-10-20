import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RoleProvider } from './RoleContext';
import { AppRoutes } from './routes';

export const App: React.FC = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <RoleProvider>
        <AppRoutes />
      </RoleProvider>
    </BrowserRouter>
  );
};

export default App;
