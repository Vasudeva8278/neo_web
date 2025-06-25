import React from 'react';
import ReactDOM from 'react-dom/client'; // Correct import for React 18
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import store from './redux/store';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId="541657938802-sna6dapk53fh0f2dcp8c6th0beturvmq.apps.googleusercontent.com"> {/* Replace with your actual Google Client ID */}
          <App />
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
