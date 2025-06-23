import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom'; // ✅ Add this
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId="541657938802-sna6dapk53fh0f2dcp8c6th0beturvmq.apps.googleusercontent.com">
        <BrowserRouter> {/* ✅ Wrap App with Router */}
          <App />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
