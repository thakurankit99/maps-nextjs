(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    // Initiate the wowjs
    new WOW().init();

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('bg-primary shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('bg-primary shadow-sm').css('top', '-150px');
        }
    });

    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        items: 1,
        autoplay: true,
        smartSpeed: 1000,
        dots: true,
        loop: true,
        nav: true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });

})(jQuery);

function addNewIframe(sourceUrl) {
    const newIframe = document.createElement("iframe");
    newIframe.src = sourceUrl;
    newIframe.style.width = "calc(50% - 10px)";
    newIframe.style.height = "200px";
    const container = document.querySelector(".portfolio-item.google-map.rounded.shadow-dark");
    container.appendChild(newIframe);
}

// Fire alarm handling - will be initialized when DOM is ready
let mapIframe = null;
let fireAlertDiv = null;

const defaultMapURL = "https://app.mappedin.com/map/67af9483845fda000bf299c3";
const evacuationStep1 = "https://app.mappedin.com/map/67af9483845fda000bf299c3?location=s_4a807c5e25da4122&floor=m_cdd612a0032a1f74"; // Assembly point
const evacuationStep2 = "https://app.mappedin.com/map/67af9483845fda000bf299c3/directions?floor=m_cdd612a0032a1f74&location=s_3283c146d50c32f2&departure=s_304550fe8b33d93b"; // Guided exit path

let fireActive = false;
let currentFireSequence = 'normal';
let alertSoundPlayed = false;

// Function to play alert sound
function playAlertSound() {
    try {
        // Create a simple beep sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);

        // Play a second beep
        setTimeout(() => {
            const oscillator2 = audioContext.createOscillator();
            const gainNode2 = audioContext.createGain();

            oscillator2.connect(gainNode2);
            gainNode2.connect(audioContext.destination);

            oscillator2.frequency.setValueAtTime(1000, audioContext.currentTime);
            oscillator2.type = 'sine';

            gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator2.start(audioContext.currentTime);
            oscillator2.stop(audioContext.currentTime + 0.5);
        }, 600);

    } catch (error) {
        console.log('Audio not supported or blocked');
    }
}

function updateFireAlert(fireStatus) {
    console.log('updateFireAlert called with:', fireStatus);

    // Initialize elements if not already done
    if (!mapIframe) {
        mapIframe = document.querySelector('.google-map iframe') || document.getElementById('mapIframe');
        console.log('Map iframe found:', !!mapIframe);
    }
    if (!fireAlertDiv) {
        fireAlertDiv = document.getElementById('fireAlert');
        console.log('Fire alert div found:', !!fireAlertDiv);
    }

    // Only proceed if elements are available
    if (!mapIframe || !fireAlertDiv) {
        console.warn('Map iframe or fire alert div not found', {mapIframe: !!mapIframe, fireAlertDiv: !!fireAlertDiv});
        return;
    }

    // Update fire alert display with modern UI
    if (fireStatus.isActive && fireStatus.showAlert) {
        // Play alert sound only once when fire is first detected
        if (!alertSoundPlayed && !fireActive) {
            playAlertSound();
            alertSoundPlayed = true;
        }

        fireAlertDiv.classList.remove('hide');
        fireAlertDiv.classList.add('show');
        fireAlertDiv.style.display = 'block';

        // Update sequence-specific styling
        fireAlertDiv.className = fireAlertDiv.className.replace(/\b(exit1|exit2|normal)\b/g, '');
        fireAlertDiv.classList.add(fireStatus.sequence);

        // Update the alert content with modern structure
        const alertContent = fireAlertDiv.querySelector('.alert-content');
        if (alertContent) {
            const alertText = alertContent.querySelector('.alert-text');
            const alertSubtext = alertContent.querySelector('.alert-subtext');
            const statusText = alertContent.querySelector('.status-text');
            const progressBar = alertContent.querySelector('.progress-bar');

            if (alertText) {
                alertText.textContent = 'FIRE EMERGENCY DETECTED';
            }

            if (alertSubtext) {
                switch(fireStatus.sequence) {
                    case 'exit1':
                        alertSubtext.textContent = 'Follow the highlighted path to assembly point';
                        break;
                    case 'exit2':
                        alertSubtext.textContent = 'Continue following the guided evacuation route';
                        break;
                    default:
                        alertSubtext.textContent = 'Emergency evacuation sequence starting...';
                }
            }

            // Update status text based on sequence
            if (statusText) {
                switch(fireStatus.sequence) {
                    case 'exit1':
                        statusText.textContent = 'Emergency evacuation route activated';
                        if (progressBar) progressBar.style.width = '50%';
                        break;
                    case 'exit2':
                        statusText.textContent = 'Alternative exit route displayed';
                        if (progressBar) progressBar.style.width = '100%';
                        break;
                    default:
                        statusText.textContent = 'Initializing emergency evacuation protocol...';
                        if (progressBar) progressBar.style.width = '10%';
                }
            }
        }

        // Add vibration for mobile devices
        if (navigator.vibrate && !fireActive) {
            navigator.vibrate([200, 100, 200]);
        }

    } else {
        fireAlertDiv.classList.remove('show');
        fireAlertDiv.classList.add('hide');
        alertSoundPlayed = false; // Reset for next alert

        // Hide the element after animation completes
        setTimeout(() => {
            if (!fireAlertDiv.classList.contains('show')) {
                fireAlertDiv.style.display = 'none';
                fireAlertDiv.classList.remove('hide');
            }
        }, 300);

        // Reset progress bar
        const progressBar = fireAlertDiv.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = '0%';
        }

        // Update status when returning to normal
        const statusText = fireAlertDiv.querySelector('.status-text');
        if (statusText) {
            statusText.textContent = 'Emergency cleared - returning to normal view';
        }
    }

    // Update map URL based on sequence
    if (fireStatus.mapUrl && mapIframe.src !== fireStatus.mapUrl) {
        mapIframe.src = fireStatus.mapUrl;
        console.log('Map updated to:', fireStatus.sequence, fireStatus.mapUrl);
    }

    // Update global state
    fireActive = fireStatus.isActive;
    currentFireSequence = fireStatus.sequence;
}

function checkFireAlarm() {
    fetch('/api/fire-status')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(fireStatus => {
        console.log('Fire status received:', fireStatus);
        console.log('Current state - fireActive:', fireActive, 'currentFireSequence:', currentFireSequence);

        // Check if fire status has changed
        if (fireStatus.isActive !== fireActive || fireStatus.sequence !== currentFireSequence) {
            console.log('Fire status changed, updating alert');
            updateFireAlert(fireStatus);
        } else {
            console.log('No fire status change detected');
        }
      })
      .catch(err => {
        console.error('Error fetching fire status:', err);
        // Don't spam the console with errors, just log once
      });
}

// Wait a bit before starting the interval to ensure the page is fully loaded
setTimeout(() => {
  setInterval(checkFireAlarm, 5000);
  checkFireAlarm(); // Initial check
}, 2000);

document.addEventListener('DOMContentLoaded', () => {
  // Initial setup when DOM is ready
  console.log('O-Maps application loaded successfully');
});
