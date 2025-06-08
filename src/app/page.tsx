'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { useHydration } from '../hooks/useHydration';

export default function Home() {
  const isHydrated = useHydration();

  useEffect(() => {
    // Check URL parameters and load specific view
    const checkURLParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      const iframe = document.getElementById('mapIframe') as HTMLIFrameElement;

      if (iframe && id) {
        switch(id.toLowerCase()) {
          case 'lh1':
            iframe.src = 'https://app.mappedin.com/map/67af9483845fda000bf299c3?location=s_4a807c5e25da4122&floor=m_cdd612a0032a1f74';
            console.log('Loaded LH1 view from URL parameter');
            break;
          case 'mini-auditorium':
          case 'miniauditorium':
            iframe.src = 'https://app.mappedin.com/map/67af9483845fda000bf299c3?floor=m_d384ab208e4c026e&location=s_7697a5ba55b63506';
            console.log('Loaded Mini Auditorium view from URL parameter');
            break;
          case 'home':
          default:
            iframe.src = 'https://app.mappedin.com/map/67af9483845fda000bf299c3';
            console.log('Loaded default home view');
            break;
        }
      }
    };

    // Global state to track loading and fire emergency
    let isFireEmergencyActive = false;
    let isManualNavigation = false;
    let loadingTimeout: NodeJS.Timeout | null = null;

    // Setup iframe loading handlers with careful detection
    const setupIframeLoading = () => {
      const iframe = document.getElementById('mapIframe') as HTMLIFrameElement;
      const loadingOverlay = document.getElementById('mapLoadingOverlay');

      if (iframe && loadingOverlay) {

        // Hide loading overlay
        const hideLoading = () => {
          if (loadingTimeout) {
            clearTimeout(loadingTimeout);
            loadingTimeout = null;
          }

          setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            isManualNavigation = false; // Reset flag
            console.log('Loading animation hidden');
          }, 800); // Slightly longer delay for better UX
        };

        // More accurate iframe load detection
        const handleIframeLoad = () => {
          try {
            // Check if iframe content is actually loaded
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDoc && iframeDoc.readyState === 'complete') {
              hideLoading();
            } else {
              // If we can't access iframe content (cross-origin), wait a bit more
              setTimeout(hideLoading, 1500);
            }
          } catch (error) {
            // Cross-origin iframe, use fallback timing
            setTimeout(hideLoading, 2000);
          }
        };

        // Add event listeners
        iframe.addEventListener('load', handleIframeLoad);

        // Monitor for fire emergency status
        const checkFireStatus = () => {
          const fireAlert = document.getElementById('fireAlert');
          if (fireAlert) {
            const isVisible = fireAlert.style.display !== 'none' &&
                            !fireAlert.classList.contains('hidden');
            if (isVisible !== isFireEmergencyActive) {
              isFireEmergencyActive = isVisible;
              console.log('Fire emergency status:', isFireEmergencyActive ? 'ACTIVE' : 'INACTIVE');

              // Hide loading if fire emergency becomes active
              if (isFireEmergencyActive && !loadingOverlay.classList.contains('hidden')) {
                hideLoading();
              }
            }
          }
        };

        // Check fire status periodically
        const fireStatusInterval = setInterval(checkFireStatus, 500);

        // Cleanup function
        return () => {
          iframe.removeEventListener('load', handleIframeLoad);
          clearInterval(fireStatusInterval);
          if (loadingTimeout) clearTimeout(loadingTimeout);
        };
      }
    };

    // Function to safely show loading
    const safeShowLoading = () => {
      if (isFireEmergencyActive) {
        console.log('Loading animation skipped - Fire emergency active');
        return;
      }

      const loadingOverlay = document.getElementById('mapLoadingOverlay');
      if (loadingOverlay) {
        isManualNavigation = true;
        loadingOverlay.classList.remove('hidden');
        console.log('Loading animation shown');
      }
    };

    // Initialize any JavaScript functionality after component mounts
    const initializeOMaps = () => {
      // Setup iframe loading handlers
      setupIframeLoading();

      // Check URL parameters first
      checkURLParams();
      console.log('O-Maps initialized');

      // Make safeShowLoading available globally
      (window as any).safeShowLoading = safeShowLoading;
    };

    // Set a timeout to ensure all external scripts are loaded
    const timer = setTimeout(initializeOMaps, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Custom Styles for Side Menu - Perfect positioning like Indira-market-building */}
      <style jsx>{`
        /* 📌 Floating Menu Button - Perfect positioning */
        .menu-button {
          position: absolute;
          width: 45px;
          height: 45px;
          background: #007bff;
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
          z-index: 1010;
          transition: all 0.3s ease;
          border: none;
          /* Desktop Position */
          top: 14px;
          right: 14px;
        }

        .menu-button:hover {
          background: #0056b3;
          transform: scale(1.05);
        }

        .menu-button .fas {
          transition: all 0.3s ease;
          font-size: 16px;
        }

        /* 📌 Mobile Position - matches Indira-market-building exactly */
        @media (max-width: 768px) {
          .menu-button {
            top: 65px;
            right: 10px;
          }
        }

        /* 📌 Enhanced Side Menu Styles */
        #sideMenu.show {
          left: 0 !important;
        }

        /* Menu Item Base Styles */
        .menu-item {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          cursor: pointer;
          border-radius: 12px;
          margin: 8px 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, transparent 0%, transparent 100%);
        }

        /* Hover Effects */
        .menu-item:hover {
          background: linear-gradient(135deg, rgba(0, 123, 255, 0.08) 0%, rgba(0, 123, 255, 0.12) 100%);
          transform: translateX(8px);
          box-shadow: 0 4px 20px rgba(0, 123, 255, 0.15);
        }

        /* Active/Selected State */
        .menu-item.active {
          background: linear-gradient(135deg, rgba(0, 123, 255, 0.15) 0%, rgba(0, 123, 255, 0.2) 100%);
          border-left: 4px solid #007bff;
          transform: translateX(4px);
          box-shadow: 0 6px 25px rgba(0, 123, 255, 0.2);
        }

        /* Menu Item Icon */
        .menu-item-icon {
          width: 24px;
          height: 24px;
          margin-right: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: rgba(0, 123, 255, 0.1);
          transition: all 0.3s ease;
          font-size: 16px;
          color: #007bff;
        }

        .menu-item:hover .menu-item-icon {
          background: rgba(0, 123, 255, 0.2);
          transform: scale(1.1);
        }

        .menu-item.active .menu-item-icon {
          background: #007bff;
          color: white;
          transform: scale(1.05);
        }

        /* Menu Item Text */
        .menu-item-text {
          font-size: 16px;
          font-weight: 500;
          color: #2c3e50;
          transition: all 0.3s ease;
        }

        .menu-item:hover .menu-item-text {
          color: #007bff;
          font-weight: 600;
        }

        .menu-item.active .menu-item-text {
          color: #007bff;
          font-weight: 600;
        }

        /* Section Headers */
        .menu-section-header {
          margin: 24px 0 12px 0;
          padding: 0 20px;
        }

        .menu-section-title {
          color: #6c757d;
          fontSize: 12px;
          fontWeight: 700;
          letterSpacing: 1.2px;
          textTransform: uppercase;
          position: relative;
          padding-bottom: 8px;
        }

        .menu-section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30px;
          height: 2px;
          background: linear-gradient(90deg, #007bff, rgba(0, 123, 255, 0.3));
          border-radius: 1px;
        }

        /* Ripple Effect */
        .menu-item::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(0, 123, 255, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .menu-item:active::before {
          width: 300px;
          height: 300px;
        }

        /* 📌 Enhanced Close Button */
        .menu-close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 40px;
          height: 40px;
          background: rgba(108, 117, 125, 0.1);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          color: #6c757d;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .menu-close-btn:hover {
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
          transform: scale(1.1);
        }

        .menu-close-btn:active {
          transform: scale(0.95);
        }

        /* 📌 Menu Backdrop */
        .menu-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1014;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          backdrop-filter: blur(2px);
        }

        .menu-backdrop.show {
          opacity: 1;
          visibility: visible;
        }

        /* 📌 Enhanced Side Menu Container */
        #sideMenu {
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95) !important;
        }

        /* 📌 Modern Loading Overlay */
        .map-loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1020;
          transition: opacity 0.5s ease, visibility 0.5s ease;
        }

        .map-loading-overlay.hidden {
          opacity: 0;
          visibility: hidden;
        }

        .loading-content {
          text-align: center;
          color: white;
          max-width: 300px;
          padding: 20px;
        }

        /* 📌 Loading Spinner */
        .loading-spinner {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto 30px;
        }

        .spinner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-top: 3px solid rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          animation: spin 1.5s linear infinite;
        }

        .spinner-ring:nth-child(1) {
          animation-delay: 0s;
        }

        .spinner-ring:nth-child(2) {
          animation-delay: 0.3s;
          transform: scale(0.8);
          border-top-color: rgba(255, 255, 255, 0.6);
        }

        .spinner-ring:nth-child(3) {
          animation-delay: 0.6s;
          transform: scale(0.6);
          border-top-color: rgba(255, 255, 255, 0.4);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* 📌 Loading Text */
        .loading-text h3 {
          margin: 0 0 10px 0;
          font-size: 24px;
          font-weight: 600;
          color: white;
        }

        .loading-text p {
          margin: 0 0 20px 0;
          font-size: 16px;
          opacity: 0.9;
          line-height: 1.4;
        }

        /* 📌 Loading Dots Animation */
        .loading-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .loading-dots span {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .loading-dots span:nth-child(1) {
          animation-delay: 0s;
        }

        .loading-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .loading-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        /* 📌 Custom Logo Overlay Styles - Exact replica from map-api & Indira-market-building */
        .custom-logo {
          position: absolute;
          bottom: 10px;
          left: 8px;
          background-color: #f1efec;
          color: #595959;
          padding: 9px 60px;
          border-radius: 5px;
          font-size: 25px;
          font-weight: bold;
          z-index: 1006;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* 📌 Share Button */
        .share-button-overlay {
          position: absolute;
          top: 14px;
          right: 68px;
          width: 46px;
          height: 46px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
          transition: background-color 0.3s ease, transform 0.2s ease;
          z-index: 1009;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .share-button-overlay:hover {
          background-color: #0056b3;
        }

        .share-button-overlay i {
          font-size: 18px;
        }

        /* 📌 360 View Button Container */
        .view-btn-360-container {
          position: absolute;
          bottom: 68px;
          left: 9px;
          z-index: 1007;
        }

        /* 📌 360 View Button - Disabled State */
        .view-btn-360 {
          width: 34px;
          height: 34px;
          background-color: #6c757d;
          color: white;
          font-size: 14px;
          font-weight: bold;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: not-allowed;
          box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.1), -2px -2px 4px rgba(255, 255, 255, 0.6);
          transition: background-color 0.3s ease;
          padding: 5px;
          border: none;
          position: relative;
          opacity: 0.6;
        }

        .view-btn-360.disabled {
          background-color: #6c757d;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .view-btn-360.disabled:hover {
          background-color: #6c757d;
          transform: none;
        }

        /* 📌 Mobile Responsive Styles */
        @media (max-width: 768px) {
          /* Custom Logo - Mobile - Exact replica from map-api & Indira-market-building */
          .custom-logo {
            width: 45px;
            height: 45px;
            padding: 0;
            font-size: 12px;
            border-radius: 8px;
            bottom: 67px;
          }

          /* Share Button - Mobile */
          .share-button-overlay {
            top: auto;
            bottom: 69px;
            right: 11px;
          }

          /* 360 View Button - Mobile */
          .view-btn-360-container {
            bottom: 115px;
            left: 9px;
          }

          .view-btn-360 {
            width: 35px;
            height: 35px;
            font-size: 12px;
          }
        }
      `}</style>
      {/* Spinner Start */}
      <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center" suppressHydrationWarning>
        <div className="spinner-grow text-primary" style={{width: '3rem', height: '3rem'}} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      {/* Spinner End */}

      {/* Navbar Start */}
      <div className="container-fluid sticky-top">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-dark p-0">
            <a href="/" className="navbar-brand">
              <div>
                <h1 className="text-white mb-0">O<span className="text-dark">-</span>MAP</h1>
                <h6 className="text-white" style={{fontSize: '13px', margin: 0}}>Made with ❤️ by Team Vayu Sena</h6>
              </div>
            </a>
            <button type="button" className="navbar-toggler ms-auto me-0" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <div className="navbar-nav ms-auto">
                <a href="#home" className="nav-item nav-link active">Home</a>
                <a href="#aboutus" className="nav-item nav-link">About</a>
                <div className="nav-item dropdown">
                  <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Features (Beta)</a>
                  <div className="dropdown-menu bg-light mt-2">
                    <a href="/livefeed-multi" className="dropdown-item">Street View (Multi Cam)</a>
                    <a href="/livefeed-single" className="dropdown-item">Street View (Single Cam)</a>
                  </div>
                </div>
                <a href="#feedback" className="nav-item nav-link">Feedback</a>
              </div>
            </div>
          </nav>
        </div>
      </div>
      {/* Navbar End */}

      {/* Map Space Start */}
      <div className="container-fluid pt-5 bg-primary hero-header mb-5" id="home">
        <div className="container pt-5">
          <center>
            {/* Fire Alert - Integrated above map */}
            <div id="fireAlert" className="" style={{display: 'none'}}>
              <div className="sound-waves"></div>
              <div className="alert-content">
                <div className="alert-text">FIRE EMERGENCY DETECTED</div>
                <div className="alert-subtext">Please follow the highlighted exit route immediately</div>
                <div className="progress-container">
                  <div className="progress-bar" style={{width: '0%'}}></div>
                </div>
                <div className="status-indicator">
                  <div className="status-dot"></div>
                  <span className="status-text">Initializing emergency protocol...</span>
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div className="portfolio-item google-map rounded shadow-dark" suppressHydrationWarning>
              <iframe
                id="mapIframe"
                src="https://app.mappedin.com/map/67af9483845fda000bf299c3"
                style={{border: 0}}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Menu Backdrop */}
              <div
                id="menuBackdrop"
                className="menu-backdrop"
                onClick={() => {
                  const menu = document.getElementById('sideMenu');
                  const backdrop = document.getElementById('menuBackdrop');
                  if (menu) menu.classList.remove('show');
                  if (backdrop) backdrop.classList.remove('show');
                }}
              ></div>

              {/* Enhanced Hamburger Menu Button */}
              <button
                id="menuToggle"
                className="menu-button"
                onClick={() => {
                  const menu = document.getElementById('sideMenu');
                  const backdrop = document.getElementById('menuBackdrop');
                  if (menu && backdrop) {
                    const isOpen = menu.classList.contains('show');
                    if (isOpen) {
                      menu.classList.remove('show');
                      backdrop.classList.remove('show');
                    } else {
                      menu.classList.add('show');
                      backdrop.classList.add('show');
                    }
                  }
                }}
              >
                <i className="fas fa-bars" aria-hidden="true"></i>
              </button>

              {/* Side Menu Panel */}
              <div
                id="sideMenu"
                className="position-absolute"
                style={{
                  top: '0',
                  left: '-320px',
                  width: '300px',
                  height: '100%',
                  background: 'white',
                  zIndex: 1015,
                  borderRadius: '0 15px 15px 0',
                  boxShadow: '2px 0 15px rgba(0,0,0,0.1)',
                  transition: 'left 0.3s ease',
                  padding: '20px',
                  overflowY: 'auto'
                }}
              >
                {/* Enhanced Close Button */}
                <button
                  className="menu-close-btn"
                  onClick={() => {
                    const menu = document.getElementById('sideMenu');
                    const backdrop = document.getElementById('menuBackdrop');
                    if (menu) menu.classList.remove('show');
                    if (backdrop) backdrop.classList.remove('show');
                  }}
                >
                  <i className="fas fa-times" aria-hidden="true"></i>
                </button>

                {/* Enhanced Menu Content */}
                <div style={{marginTop: '40px'}}>
                  {/* Home */}
                  <div
                    id="menu-home"
                    className="menu-item active"
                    onClick={(e) => {
                      // Update active state
                      document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
                      e.currentTarget.classList.add('active');

                      const iframe = document.getElementById('mapIframe') as HTMLIFrameElement;
                      if (iframe) {
                        (window as any).safeShowLoading?.();
                        iframe.src = 'https://app.mappedin.com/map/67af9483845fda000bf299c3';
                      }
                      const menu = document.getElementById('sideMenu');
                      const backdrop = document.getElementById('menuBackdrop');
                      if (menu) menu.classList.remove('show');
                      if (backdrop) backdrop.classList.remove('show');
                    }}
                  >
                    <div className="menu-item-icon">
                      <i className="fas fa-home" aria-hidden="true"></i>
                    </div>
                    <span className="menu-item-text">Home</span>
                  </div>

                  {/* Special Locations Section */}
                  <div className="menu-section-header">
                    <div className="menu-section-title">
                      Special Locations
                    </div>
                  </div>

                  {/* LH1 */}
                  <div
                    id="menu-lh1"
                    className="menu-item"
                    onClick={(e) => {
                      // Update active state
                      document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
                      e.currentTarget.classList.add('active');

                      const iframe = document.getElementById('mapIframe') as HTMLIFrameElement;
                      if (iframe) {
                        (window as any).safeShowLoading?.();
                        iframe.src = 'https://app.mappedin.com/map/67af9483845fda000bf299c3?location=s_4a807c5e25da4122&floor=m_cdd612a0032a1f74';
                      }
                      const menu = document.getElementById('sideMenu');
                      const backdrop = document.getElementById('menuBackdrop');
                      if (menu) menu.classList.remove('show');
                      if (backdrop) backdrop.classList.remove('show');
                    }}
                  >
                    <div className="menu-item-icon">
                      <i className="fas fa-chalkboard-teacher" aria-hidden="true"></i>
                    </div>
                    <span className="menu-item-text">LH1</span>
                  </div>

                  {/* Mini Auditorium */}
                  <div
                    id="menu-mini-auditorium"
                    className="menu-item"
                    onClick={(e) => {
                      // Update active state
                      document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
                      e.currentTarget.classList.add('active');

                      const iframe = document.getElementById('mapIframe') as HTMLIFrameElement;
                      if (iframe) {
                        (window as any).safeShowLoading?.();
                        iframe.src = 'https://app.mappedin.com/map/67af9483845fda000bf299c3?floor=m_d384ab208e4c026e&location=s_7697a5ba55b63506';
                      }
                      const menu = document.getElementById('sideMenu');
                      const backdrop = document.getElementById('menuBackdrop');
                      if (menu) menu.classList.remove('show');
                      if (backdrop) backdrop.classList.remove('show');
                    }}
                  >
                    <div className="menu-item-icon">
                      <i className="fas fa-theater-masks" aria-hidden="true"></i>
                    </div>
                    <span className="menu-item-text">Mini Auditorium</span>
                  </div>
                </div>
              </div>



              {/* Custom Logo */}
              <div className="custom-logo">
                O<span style={{color: '#333'}}>-</span>MAP
              </div>

              {/* Share Button */}
              <div className="share-button-overlay" onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('URL copied to clipboard!');
              }}>
                <i className="fas fa-share-alt" aria-hidden="true"></i>
              </div>

              {/* 360 View Button Container - Disabled */}
              <div className="view-btn-360-container">
                <div className="view-btn-360 disabled" title="360° view coming soon">360°</div>
              </div>

              {/* Modern Loading Overlay */}
              <div id="mapLoadingOverlay" className="map-loading-overlay">
                <div className="loading-content">
                  <div className="loading-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                  </div>
                  <div className="loading-text">
                    <h3>Loading O-Maps</h3>
                    <p>Please wait while we load your interactive map...</p>
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Original Loading Message (Hidden) */}
              <div id="loadingMessage" style={{display: 'none'}} suppressHydrationWarning>Please Wait... Map is being loaded... <i className="fa-regular fa-face-smile" aria-hidden="true"></i></div>
            </div>
          </center>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      </div>
      {/* Map Space End */}

      {/* About Project */}
      <div className="container-fluid py-5" id="aboutus">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
              <div className="about-img">
                <img className="img-fluid" src="/images/about-img.webp" alt="About O-Maps" />
              </div>
            </div>
            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
              <div className="btn btn-sm border rounded-pill text-primary px-3 mb-3">About Us</div>
              <h1 className="mb-4">About this project</h1>
              <p className="mb-4">
                Indoor navigation presents a unique set of challenges compared to outdoor navigation.
                The absence of reliable GPS signals, intricate building layouts with multiple floors,
                and the dynamic nature of indoor environments make it difficult for users to find their way efficiently.
              </p>
              <p className="mb-4">
                To address these challenges and meet these evolving needs, we propose the development of an
                integrated indoor navigation and 360° virtual reality (VR) tour system. This innovative solution
                will combine the accuracy and intuitiveness of a modern navigation system with the immersive and
                exploratory capabilities of a virtual tour.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* About Project End */}

      {/* Footer Start */}
      <div className="container-fluid bg-dark text-white-50 footer pt-5">
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.1s">
              <a href="/" className="d-inline-block mb-3">
                <h1 className="text-white">O<span className="text-primary">-</span>MAP</h1>
              </a>
              <p className="mb-0">
                OMaps is an innovative indoor navigation and virtual tour platform designed to revolutionize
                the way users navigate and experience indoor environments. By seamlessly integrating intuitive
                2D maps with immersive 360° virtual reality (VR) tours
              </p>
            </div>
            <div className="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.3s">
              <h5 className="text-white mb-4">Get In Touch</h5>
              <p><i className="fa fa-map-marker-alt me-3" aria-hidden="true"></i>Mandi , Himachal Pradesh PIN - 175001</p>
              <p><i className="fa fa-envelope me-3" aria-hidden="true"></i>sahilvatsi@spumca.in , ankitthakur@spumca.in</p>
              <div className="d-flex pt-2">
                <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-twitter" aria-hidden="true"></i></a>
                <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-facebook-f" aria-hidden="true"></i></a>
                <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-youtube" aria-hidden="true"></i></a>
                <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-instagram" aria-hidden="true"></i></a>
                <a className="btn btn-outline-light btn-social" href="#"><i className="fab fa-linkedin-in" aria-hidden="true"></i></a>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.5s">
              <h5 className="text-white mb-4">Popular Link</h5>
              <a className="btn btn-link" href="#">About Us</a>
              <a className="btn btn-link" href="#">Contact Us</a>
              <a className="btn btn-link" href="#">Privacy Policy</a>
              <a className="btn btn-link" href="#">Terms & Condition</a>
            </div>
            <div className="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.7s">
              <h5 className="text-white mb-4">Our Projects</h5>
              <a className="btn btn-link" href="#">Indoor Navigation</a>
              <a className="btn btn-link" href="#">360 Maps</a>
            </div>
          </div>
        </div>
        <div className="container wow fadeIn" data-wow-delay="0.1s">
          <div className="copyright">
            <div className="row">
              <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                &copy; <a className="border-bottom" href="#">O MAPs</a>, All Right Reserved. Designed By Team Vayu Sena
              </div>
              <div className="col-md-6 text-center text-md-end">
                <div className="footer-menu">
                  <a href="#">Home</a>
                  <a href="#">Cookies</a>
                  <a href="#">Help</a>
                  <a href="#">FAQs</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer End */}

      {/* Back to Top */}
      <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top pt-2">
        <i className="bi bi-arrow-up" aria-hidden="true"></i>
      </a>

      {/* Load external scripts */}
      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      <Script src="/lib/wow/wow.min.js" strategy="afterInteractive" />
      <Script src="/lib/easing/easing.min.js" strategy="afterInteractive" />
      <Script src="/lib/waypoints/waypoints.min.js" strategy="afterInteractive" />
      <Script src="/lib/counterup/counterup.min.js" strategy="afterInteractive" />
      <Script src="/lib/owlcarousel/owl.carousel.min.js" strategy="afterInteractive" />
      <Script src="https://web3forms.com/client/script.js" strategy="lazyOnload" />
      <Script src="/js/main.js" strategy="afterInteractive" />
      <Script src="/js/switch.js" strategy="afterInteractive" />
    </>
  );
}
