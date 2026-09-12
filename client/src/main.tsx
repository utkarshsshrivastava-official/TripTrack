import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Auto-register service worker for offline PWA operation
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('New content available, reload to update TripTrack PWA.');
  },
  onOfflineReady() {
    console.log('TripTrack PWA is ready for offline operation in Himalayan dead zones.');
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
