/**
 * Initializes the application layout by loading the header and navbar,
 * and triggers the greeting functionality if the user is on the summary page.
 * @async
 * @function init
 * @param {string} page - The ID of the current page (e.g., 'summary_page').
 */
async function init(page) {
    await loadHTML("header.html", "header-placeholder");
    await loadHTML("navbar.html", "navbar-section");
    activePageHiglight(page);
    setUserCircleInitials();
    if (page === 'summary_page') {
        initGreeting();
        initGreetingRepeat();
    }
}


/**
 * Checks the login status stored in localStorage.
 * If the user is not logged in, redirects them to the index (login) page.
 * @function isUserLoged
 */
function isUserLoged() {
    let isLoggedIn = localStorage.getItem("loggedIn");
    if (isLoggedIn !== "true") {
        window.location.href = "../index.html";
    } else {
        setUserCircleInitials();
    }
}


/**
 * Logs the user out by resetting the login and layout information in localStorage.
 * Redirects to the index (login) page afterwards.
 * @function logOut
 */
function logOut() {
    localStorage.setItem("loggedIn", "false");
    localStorage.removeItem("layout");
    localStorage.removeItem("username");
    window.location.href = "../index.html";
}


/**
 * Loads an external HTML file and injects it into a specified container element on the page.
 * @async
 * @function loadHTML
 * @param {string} file - The path to the HTML file.
 * @param {string} elementId - The ID of the target container element to load content into.
 */
async function loadHTML(file, elementId) {
    let response = await fetch(file);
    let html = await response.text();
    let container = document.getElementById(elementId);
    if (container) container.innerHTML = html;
}


/**
 * Highlights the currently active page by adding an "active-menu" class
 * to the relevant navigation element and removing it from all others.
 *
 * @function activePageHiglight
 * @param {string} page - The ID of the current active page.
 */
function activePageHiglight(page) {
    let ids = ["summary_page", "add_task_page", "board_page", "contact_page", "help_page"];
    ids.forEach(id => {
        let el = document.getElementById(id);
        if (el) el.classList.remove("active-menu");
    });
    let current = document.getElementById(page);
    if (current) current.classList.add("active-menu");
}


/**
 * Toggles the burger menu open/close with fade animation.
 */
function burgerMenuSliding() {
    let menu = document.getElementById("burger_menu");
    menu.classList.toggle("visible");
}


/**
 * Closes the burger menu when clicking outside of it.
 */
document.addEventListener("click", function (event) {
    let menu = document.getElementById("burger_menu");
    let userLogo = document.querySelector(".user-logo");
    if (!menu || !menu.classList.contains("visible")) return;
    let clickedInsideMenu = menu.contains(event.target);
    let clickedUserLogo = userLogo && userLogo.contains(event.target);
    if (!clickedInsideMenu && !clickedUserLogo) {
        menu.classList.remove("visible");
    }
});


/**
 * Stores the layout type (internal or external) in localStorage
 * and redirects the user to a given URL.
 * @function setLayoutAndRedirect
 * @param {string} layout - The layout type ('intern' or 'extern').
 * @param {string} url - The destination URL to redirect the user to.
 */
function setLayoutAndRedirect(layout, url) {
    localStorage.removeItem('layout');
    localStorage.setItem('layout', layout);
    window.location.href = url;
}


/**
 * Loads the internal header and navbar for authenticated users.
 * Also highlights the current page for legal/privacy pages.
 * @async
 * @function loadHeaderNavbarIntern
 */
async function loadHeaderNavbarIntern() {
    await Promise.all([
        loadHTML("/html/header.html", "header-placeholder"),
        loadHTML("/html/navbar.html", "navbar-section")
    ]);
    markLegalPrivacyActiveLink();
    setUserCircleInitials();
}


/**
 * Loads the external header and navbar for guest (unauthenticated) users.
 * @async
 * @function loadHeaderNavbarExtern
 */
async function loadHeaderNavbarExtern() {
    await Promise.all([
        loadHTML("/html/header_extern.html", "header-placeholder"),
        loadHTML("/html/navbar_extern.html", "navbar-section")
    ]);
}


/**
 * Adds the 'active-menu' class to the correct navigation item
 * on legal and privacy policy pages.
 * @function markLegalPrivacyActiveLink
 */
function markLegalPrivacyActiveLink() {
    let path = window.location.pathname;
    if (path.includes("privacy_policy.html")) {
        let el = document.getElementById("privacy_page");
        if (el) el.classList.add("active-menu");
    }
    if (path.includes("legal_notice.html")) {
        let el = document.getElementById("legal_notice_page");
        if (el) el.classList.add("active-menu");
    }
}


/**
 * Accepts cookies, stores the acceptance timestamp in localStorage,
 * hides the cookie banner, and enables the login buttons.
 *
 * @function acceptCookies
 */
function acceptCookies() {
    let now = new Date().getTime();
    localStorage.setItem("cookiesAcceptedAt", now);
    document.getElementById("cookieBanner").classList.add("d-none");
    enableLogin();
    enableLoginButtons();
}


/**
 * Validates whether the user's cookie acceptance is still valid
 * by checking if it occurred within the past year.
 *
 * @function cookiesStillValid
 * @returns {boolean} True if still valid, otherwise false.
 */
function cookiesStillValid() {
    let timestamp = localStorage.getItem("cookiesAcceptedAt");
    if (!timestamp) return false;
    let acceptedAt = parseInt(timestamp);
    let now = new Date().getTime();
    let oneYear = 1000 * 60 * 60 * 24 * 365;
    return now - acceptedAt < oneYear;
}


/**
 * Makes the login area visible.
 *
 * @function enableLogin
 */
function enableLogin() {
    let loginArea = document.getElementById("loginArea");
    if (loginArea) loginArea.classList.remove("d-none");
}


/**
 * Disables both the standard login and guest login buttons.
 * @function disableLoginButtons
 */
function disableLoginButtons() {
    let logInBtn = document.getElementById("logIn");
    let guestBtn = document.getElementById("guestLogIn");
    if (logInBtn) logInBtn.disabled = true;
    if (guestBtn) guestBtn.disabled = true;
}


/**
 * Enables both the standard login and guest login buttons.
 * @function enableLoginButtons
 */
function enableLoginButtons() {
    let logInBtn = document.getElementById("logIn");
    let guestBtn = document.getElementById("guestLogIn");
    if (logInBtn) logInBtn.disabled = false;
    if (guestBtn) guestBtn.disabled = false;
}


/**
 * Runs once the DOM has fully loaded.
 * Initializes rotate warning, layout loading, cookie logic, and back button.
 */
window.addEventListener("DOMContentLoaded", async () => {
    try {
        await loadRotateWarning();
    } catch (err) {
        console.warn("⚠️ rotate_warning.html konnte nicht geladen werden:", err);
    }
    const path = window.location.pathname;
    const isLegalPage = path.includes("privacy_policy.html") || path.includes("legal_notice.html");
    if (isLegalPage) {
        await initLayout();
    }
    initCookies();
    initBackButton();
    checkOrientation();
});


/**
 * Loads the rotate warning overlay into the DOM.
 * @async
 * @function loadRotateWarning
 */
async function loadRotateWarning() {
    await loadHTML("/html/rotate_warning.html", "rotate-warning-placeholder");
}


/**
 * Initializes the layout based on login status and current page.
 * Resets layout value every time to ensure clean state.
 * @function initLayout
 */
async function initLayout() {
    window.location.pathname.includes("privacy_policy.html") ||
    window.location.pathname.includes("legal_notice.html");
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    const hasUsername = !!localStorage.getItem("username");
    const layout = localStorage.getItem("layout");

    if ((isLoggedIn || hasUsername) && layout === "intern") {
        await loadHeaderNavbarIntern();
    } else {
        await loadHeaderNavbarExtern();
    }
    localStorage.removeItem("layout");
}


/**
 * Handles cookie banner visibility and login button state.
 */
function initCookies() {
    let stillValid = cookiesStillValid();
    let banner = document.getElementById("cookieBanner");
    let loginArea = document.getElementById("loginArea");
    if (!stillValid) {
        if (banner) banner.classList.remove("d-none");
        if (loginArea) loginArea.classList.remove("d-none");
        disableLoginButtons();
    } else {
        if (banner) banner.classList.add("d-none");
        if (loginArea) loginArea.classList.remove("d-none");
        enableLoginButtons();
    }
    let acceptBtn = document.getElementById("acceptCookiesBtn");
    if (acceptBtn) {
        acceptBtn.addEventListener("click", acceptCookies);
    }
}


/**
 * Attaches functionality to the back arrow to go to previous page.
 * @function initBackButton
 */
function initBackButton() {
    let backClick = document.getElementById("backArrow");
    if (backClick) {
        backClick.addEventListener("click", () => history.back());
    }
}


/**
 * Checks the current orientation of the user's device.
 * If on a mobile device in landscape mode, shows a fullscreen warning overlay.
 * @function checkOrientation
 */
function checkOrientation() {
    let warning = document.getElementById("rotateWarning");
    if (!warning) return;

    let isLandscape = window.matchMedia("(orientation: landscape)").matches;
    let isMobile = /Mobi|Android/i.test(navigator.userAgent);
    let smallScreen = Math.min(window.innerWidth, window.innerHeight) <= 800;

    warning.style.display = (isMobile && smallScreen && isLandscape) ? "flex" : "none";
}


/**
 * Adds event listeners to check the device orientation
 * when the page is loaded, resized, or when the orientation changes.
 */
window.addEventListener("load", checkOrientation);


/**
 * Trigger checkOrientation when the window is resized.
 * Useful for detecting changes in layout dimensions.
 */
window.addEventListener("resize", checkOrientation);


/**
 * Trigger checkOrientation when the device orientation changes.
 * Specifically useful on mobile devices and tablets.
 */
window.addEventListener("orientationchange", checkOrientation);


/**
 * Displays the full-screen loading spinner overlay.
 * @function spinningLoaderStart
 */
function spinningLoaderStart() {
    let spinner = document.getElementById('spinnerOverLay');
    spinner.classList.remove('d-none');
}


/**
 * Hides the full-screen loading spinner overlay.
 * @function spinningLoaderEnd
 */
function spinningLoaderEnd() {
    let spinner = document.getElementById('spinnerOverLay');
    spinner.classList.add('d-none');
}


/**
 * Sets the user's initials inside the circle in the header.
 * If the user is a guest, it shows "G".
 * This function should be called after the header has been injected into the DOM.
 * @function setUserCircleInitials
 */
function setUserCircleInitials() {
    let userCircle = document.querySelector('.user-logo-text');
    if (!userCircle) return;

    let name = localStorage.getItem('username') || "Guest";

    if (name && name.toLowerCase() !== "guest") {
        let initials = name
            .split(" ")
            .map(part => part.charAt(0).toUpperCase())
            .join("");
        userCircle.textContent = initials;
    } else {
        userCircle.textContent = "G";
    }
}