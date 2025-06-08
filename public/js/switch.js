// Wait for DOM to load before accessing elements
document.addEventListener("DOMContentLoaded", function () {
    // Get references to elements
    const switch360Button = document.getElementById('Switch360');
    const switchSlbsgmcButton = document.getElementById('SwitchSLBSGMC');
    const mapIframe = document.getElementById('mapIframe');
    const loadingMessage = document.getElementById('loadingMessage');

    // Ensure the iframe and buttons exist
    if (!mapIframe) {
        console.warn("⚠️ Map iframe not found, switch functionality disabled");
        return;
    }

    if (!switch360Button || !switchSlbsgmcButton || !loadingMessage) {
        console.warn("⚠️ Some switch elements not found, functionality may be limited");
        // Continue anyway as the basic map should still work
    }

    // Iframe URLs
    const mappedInURL = "https://app.mappedin.com/map/67af9483845fda000bf299c3";
    const healthCenterURL = "https://iitm360.ankitthakur.eu.org/?media-index=4";
    const slbsgmcURL = "https://ankitthakur.eu.org/api_slbsgmc";

    let currentIframe = mappedInURL;

    // Function to switch map with loading effect
    function switchMap(newUrl) {
        if (mapIframe.src !== newUrl) {
            loadingMessage.style.display = 'block'; // Show loading message
            mapIframe.src = newUrl;
            currentIframe = newUrl;
        }
    }

    // Event listener for the 360 switch button
    switch360Button.addEventListener('click', () => {
        switchMap(currentIframe === mappedInURL ? healthCenterURL : mappedInURL);
    });

    // Event listener for the SLBSGMC switch button
    switchSlbsgmcButton.addEventListener('click', () => {
        switchMap(currentIframe === mappedInURL ? slbsgmcURL : mappedInURL);
    });

    // Event listener for when iframe has finished loading
    mapIframe.addEventListener('load', () => {
        loadingMessage.style.display = 'none';
    });

    // Initial loading message display
    loadingMessage.style.display = 'block';
});
