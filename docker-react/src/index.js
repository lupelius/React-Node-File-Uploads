import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const root: ?Element = document.getElementById('root');

if (root != null) {
  ReactDOM.render(<App/>, root);
}
