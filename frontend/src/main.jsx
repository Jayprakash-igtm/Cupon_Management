import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter as Router } from 'react-router-dom'; // Correct import

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router> {/* Use Router here, not BrowserRouter */}
      <App />
    </Router>
  </StrictMode>
);