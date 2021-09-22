import { topOffsetBig } from "./constants";

const navBar = document.getElementById('navbar');

function collapseNavBar() {
    if (window.scrollY === 0) { // When at the top of the page scroll down first
        window.scroll({top: topOffsetBig, behavior: 'smooth'});
    }
    navBar.classList.add('collapsed');
}

function expandNavbar() {
    navBar.classList.remove('collapsed');
}

export {collapseNavBar, expandNavbar}
