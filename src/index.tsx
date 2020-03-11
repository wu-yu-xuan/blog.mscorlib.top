import React from 'react';
import { createBlockingRoot } from 'react-dom';
import App from './views/App';
import registerServiceWorker from './registerServiceWorker';

createBlockingRoot(document.getElementById('root')).render(<App />);
registerServiceWorker();
