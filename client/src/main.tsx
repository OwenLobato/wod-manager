import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WodManagerApp } from './WodManagerApp.tsx';
import './styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WodManagerApp />
  </StrictMode>
);
