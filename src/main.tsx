import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 🔑 ONLY place BrowserRouter here!
import { BrowserRouter } from 'react-router-dom'; 

const rootElement = document.getElementById('root');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            {/* This is the one and only Router wrapper in the entire app */}
            <BrowserRouter> 
                <App />
            </BrowserRouter>
        </React.StrictMode>
    );
}

// NOTE: All the other imports and code blocks (QueryClient, AuthProvider, Toasters) 
// have been MOVED to App.tsx.