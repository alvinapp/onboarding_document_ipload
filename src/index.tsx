import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Ensure the path is correct for App.tsx
import './index.css'; // Optional: import your CSS file

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);