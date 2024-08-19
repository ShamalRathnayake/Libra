import React from 'react';

import { useSelector } from 'react-redux';

import './App.css';
import 'antd/dist/reset.css';
import { ConfigProvider, theme } from 'antd';
import { RouterProvider } from 'react-router-dom';
import router from './routes/router';

function App() {
  const themeMode = useSelector((state) => state.settings.theme);

  return (
    <ConfigProvider
      theme={{
        algorithm:
          themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
