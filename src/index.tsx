import React from 'react';
import { createRoot } from 'react-dom';
import App from './views/App';
import registerServiceWorker from './registerServiceWorker';

/**
 * Concurrent Mode auto enable Strict Mode
 */
createRoot(document.getElementById('root')).render(<App />);
registerServiceWorker();
