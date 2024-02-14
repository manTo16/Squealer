import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "bootstrap/dist/css/bootstrap.min.css"
import "./scss/main.scss"
import { BrowserRouter } from 'react-router-dom';






const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter basename='app'>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
