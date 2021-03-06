import React from 'react'
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import App from './app'
import configureStore from './store/configureStore';

const store = configureStore();

render(
  <Provider store={store}>
      <App />
  </Provider>,
  document.getElementById('root')
);
