import React, { ReactNode } from 'react';
import { createRoot } from 'react-dom';
import App from './App'; // Replace with your App component path
import { createStore, createEffect, Store, Effect } from 'effector';

interface PluginOptions {
  initializedOptions: string[];
  onPositionChange(positions: string[]): void;
  onComplete(positions: string[]): void;
  onInit(): void;
}

interface MyAppProps {
  activePositions: Store<string[]>;
  fetchPositionsFx: Effect<void, string[], Error>;
  sendActivePositionsFx: Effect<string[], void, Error>;
  initializedOptions: string[];
  onPositionChange: (positions: string[]) => void;
  onComplete: (positions: string[]) => void;
  onInit: () => void;
}

function MyAppWrapper({ children, options }: { children: ReactNode; options: PluginOptions }) {
  const activePositions = createStore<string[]>([]);
  const fetchPositionsFx = createEffect<void, string[]>(async () => {
    const response = await fetch('https://myfailemtions.npkn.net/b944ff/');
    const returnedData = await response.json();
    activePositions.setState(returnedData);
    return returnedData;
  });
  const sendActivePositionsFx = createEffect<string[], void>(async (positions) => {
    await fetch('https://myfailemtions.npkn.net/b944ff/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(positions),
    });
  });

  const appProps: MyAppProps = {
    activePositions,
    fetchPositionsFx,
    sendActivePositionsFx,
    ...options,
  };

  // Perform any initialization steps here

  return <App {...appProps}>{children}</App>;
}

export function initMyApp(options: PluginOptions): void {
  const { onInit } = options;

  // Perform any additional SDK initialization here

  // Call onInit from provided options
  onInit();

  // Render the application
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(
      <MyAppWrapper options={options}>
        {/* Any additional components you want to include */}
      </MyAppWrapper>
    );
  }
}

(window as any).MY_APP = {
  init: initMyApp,
};
