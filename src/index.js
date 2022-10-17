import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import DashboardComponent from './DashboardComponent';

if (document.getElementById('root')) {
  // In this case we render the dasboard as a standalone app
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
} else {
  // In this case we render the dashboard as a component
  ReactDOM.render(
    <React.StrictMode>
      <DashboardComponent 
        rtJob={document.getElementById('reportree_job_number').innerHTML}
      />
    </React.StrictMode>,
    document.getElementById('dashboard')
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
