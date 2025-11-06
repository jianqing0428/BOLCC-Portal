

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
import SermonDetailPage from './components/SermonDetailPage';
import AboutPage from './components/AboutPage';
import EventsPage from './components/EventsPage';
import SermonsPage from './components/SermonsPage';
import GivingPage from './components/GivingPage';
import ContactPage from './components/ContactPage';
import { SubPage, MinistrySubPage, SermonSubPage, GivingSubPage, ContactSubPage } from './types';

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
      const parts = route.split('/');
      const segment = parts[2];
      
      // Check if it's a detail page (numeric ID)
      if (segment && !isNaN(parseInt(segment))) {
        return <SermonDetailPage sermonId={segment} />;
      }
      
      // Otherwise, it's a sub-page
      const subPageSegment = segment || 'sunday-worship';
      const validSubPages: ReadonlyArray<SermonSubPage> = ['sunday-worship', 'recent-sermons', 'live-stream'];
      const subPage = validSubPages.find(p => p === subPageSegment) ?? 'sunday-worship';
      return <SermonsPage activeSubPage={subPage} />;
    }
    if (route.startsWith('#/events/')) {
      const subPageSegment = route.split('/')[2] || 'kids';
      const validSubPages: ReadonlyArray<MinistrySubPage> = ['kids', 'men', 'women', 'joint', 'alpha', 'prayer'];
      const subPage = validSubPages.find(p => p === subPageSegment) ?? 'kids';
      return <EventsPage activeSubPage={subPage} />;
    }
    if (route.startsWith('#/giving/')) {
      const subPageSegment = route.split('/')[2] || 'why-we-give';
      const validSubPages: ReadonlyArray<GivingSubPage> = ['why-we-give', 'what-is-tithing', 'ways-to-give', 'other-ways-to-give'];
      const subPage = validSubPages.find(p => p === subPageSegment) ?? 'why-we-give';
      return <GivingPage activeSubPage={subPage} />;
    }
    if (route.startsWith('#/contact/')) {
      const subPageSegment = route.split('/')[2] || 'contact-us';
      const validSubPages: ReadonlyArray<ContactSubPage> = ['contact-us', 'join-us', 'prayer-request'];
      const subPage = validSubPages.find(p => p === subPageSegment) ?? 'contact-us';
      return <ContactPage activeSubPage={subPage} />;
    }
    if (route.startsWith('#/about/')) {
      const subPageSegment = route.split('/')[2] || 'our-church';
      // Fix: Validate that the subpage from the URL is a valid SubPage, defaulting to 'our-church' if not.
      const validSubPages: ReadonlyArray<SubPage> = ['our-church', 'our-beliefs', 'job-opportunities', 'ministry-leaders', 'becoming-a-member'];
      const subPage = validSubPages.find(p => p === subPageSegment) ?? 'our-church';
      return <AboutPage activeSubPage={subPage} />;
    }
    return <HomePage />;
  };
  
  const isHomePage = !route.startsWith('#/sermons') && !route.startsWith('#/about') && !route.startsWith('#/events') && !route.startsWith('#/giving') && !route.startsWith('#/contact');

  return (
    <div className="bg-white text-gray-800 antialiased min-h-screen flex flex-col">
      <Header isTransparent={isHomePage} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
      <AdminPanel />
    </div>
  );
}

export default App;