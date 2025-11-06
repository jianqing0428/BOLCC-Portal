
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Events from './components/Events';
import Sermons from './components/Sermons';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import Support from './components/Support';
import SermonArchive from './components/SermonArchive';
import SermonDetailPage from './components/SermonDetailPage';

const HomePage = () => (
  <>
    <Hero />
    <About />
    <Events />
    <Sermons />
    <Support />
    <Contact />
  </>
);

const SermonsPage = () => (
  <SermonArchive />
);


function App() {
  const [route, setRoute] = useState(window.location.hash);

  // Set up event listener for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Handle side-effects of route changes (e.g., scrolling)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  const renderPage = () => {
    if (route.startsWith('#/sermons/')) {
      const id = route.split('/')[2];
      return <SermonDetailPage sermonId={id} />;
    }
    if (route === '#/sermons') {
      return <SermonsPage />;
    }
    return <HomePage />;
  };
  
  const isHomePage = !route.startsWith('#/sermons');

  return (
    <div className="bg-white text-gray-800 antialiased">
      <Header isTransparent={isHomePage} />
      <main>
        {renderPage()}
      </main>
      <Footer />
      <AdminPanel />
    </div>
  );
}

export default App;