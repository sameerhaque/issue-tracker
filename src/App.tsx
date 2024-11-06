import React from 'react';
import Issues from './features';
import './styles/global.scss';
import './styles/Issue.scss';
import { ThemeProvider } from './ui/theme-provider.tsx';
import Header from './components/header.tsx';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header />
      <main className="app-container ">
        <Issues />
      </main>
    </ThemeProvider>
  );
};

export default App;
