import { largeWidth, logo, mediumWidth, navBar, smallWidth, topOffsetBig } from "./constants";
import { collapseNavBar, expandNavbar } from "./navBar";

function onScroll() {
    if (window.scrollY >= topOffsetBig) {
        if (!navBar.classList.contains('collapsed')) {
            collapseNavBar()
        }
    } else {
        if (navBar.classList.contains('collapsed')) {
            expandNavbar()
        }
    }
}

function onResize() {
    if (window.innerWidth >= largeWidth) {
        logo.innerText = "Jan-Willem van Bremen";
    } else if (window.innerWidth >= mediumWidth) {
        logo.innerText = "J.W. van Bremen";
    } else if (window.innerWidth >= smallWidth) {
        logo.innerText = "J.W.";
    }
}

export {onScroll, onResize}
