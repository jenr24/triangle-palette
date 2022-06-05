import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { ColorModeScript } from '@chakra-ui/react'
import { CheckWebGPU } from "./helper";
import { Shaders } from './shaders';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    <ColorModeScript />
    <App />
  </React.StrictMode>,
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
