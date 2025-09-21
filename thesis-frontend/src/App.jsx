import { lazy, Suspense, useEffect } from 'react';
import './App.css';
import { NotificationManager } from './components/common/ErrorNotification';
import { useBackendHealth } from './hooks/useBackendHealth';


const HomePage = lazy(() => import('./pages/HomePage/HomePage'));


const preloadComponents = () => {
  import('./pages/SimulationPage');
};

function App() {
  useBackendHealth();
  
  useEffect(() => {
    const timer = setTimeout(preloadComponents, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin motion-reduce:animate-none rounded-full h-16 w-16 border-t-2 border-b-2 border-[#319694]"></div>
        </div>
      }>
        <HomePage/>
      </Suspense>
      <NotificationManager />
    </>
  );
}

export default App;

