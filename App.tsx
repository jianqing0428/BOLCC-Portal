
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
    // Differentiate between page navigation and in-page anchors
    if (route.startsWith('#/')) {
      // This is a page-level navigation (e.g., #/sermons). Scroll to top.
      window.scrollTo(0, 0);
    } else {
      // This is an in-page anchor link (e.g., #about).
      const id = route.substring(1);
      if (id) {
        const element = document.getElementById(id);
        if (element) {
          // Use modern CSS for smooth scrolling with an offset for the sticky header.
          const header = document.querySelector('header');
          const headerHeight = header ? header.offsetHeight : 100; // Fallback height
          document.documentElement.style.scrollPaddingTop = `${headerHeight}px`;

          element.scrollIntoView({ behavior: 'smooth', block: 'start' });

          // Clean up the style after the scroll animation is likely to have finished.
          setTimeout(() => {
            document.documentElement.style.scrollPaddingTop = '';
          }, 1000);
        }
      }
    }
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