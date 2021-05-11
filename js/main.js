const hljs = require('highlight.js/lib/core');  // require only the core library
const marked = require('marked');
import 'highlight.js/styles/xcode.css';
import Accordion from './accordion';

// Init
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript')); // separately require languages
hljs.registerLanguage('kotlin', require('highlight.js/lib/languages/kotlin')); // separately require languages

// Variables
const topOffsetBig = 80;
const topOffsetSmall = 48;
const smallWidth = 480;
const mediumWidth = 768;
const largeWidth = 900;

// Elements
const navBar = document.getElementById('navbar');
const loader = document.getElementById('loader');
const dialog = document.getElementById('dialog');
const dialogContent = document.getElementById('dialog-content');
const logo = document.getElementById('logo');

function init() {
  document.getElementById('vid').playbackRate = .5;

  window.onscroll = function () { onScroll(); };
  window.onresize = function () { onResize(); };

  openDialogFromPathname(window.location.pathname);

  window.onpopstate = function (event) {
    openDialogFromPathname(event.path[0].location.pathname);
  };

  onScroll();
  onResize();

  document.onkeydown = escapeKeyListener;
}

function escapeKeyListener(evt) {
  evt = evt || window.event;
  let isEscape;
  if ("key" in evt) {
    isEscape = (evt.key === "Escape" || evt.key === "Esc");
  } else {
    isEscape = (evt.keyCode === 27);
  }
  if (isEscape) {
    closeDialog()
  }
}

function getAndViewBlob(path) {
  fetch(path).then(response => {
    response.blob().then(blob => {
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL);
    });
  });
}

function expandNavbar() {
  navBar.classList.remove('collapsed');
}

function collapseNavBar() {
  if (window.scrollY === 0) { // When at the top of the page scroll down first
    window.scroll({top: topOffsetBig, behavior: 'smooth'});
  }

  navBar.classList.add('collapsed');
}

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

function showLoader()  {
  loader.classList.add('active');
}

function hideLoader()  {
  loader.classList.remove('active');
}

function buildDialogContent (data) {
  const doc = document.createRange().createContextualFragment(data.toString()); // Create HTML fragment from HTML string
  doc.querySelectorAll('[alt]:not([alt=""])').forEach(e => { e.classList.add(e.getAttribute('alt').split(' ')[0]); }); // set classnames from first alt attribute value
  doc.querySelectorAll('img.flex').forEach( e => { e.parentElement.classList.add('flex'); }); // Set flex attribute for flex images parent
  doc.querySelectorAll('details').forEach((e) => { new Accordion(e); }); // Set Accordion animation for all details tags
  dialogContent.innerHTML = ''; // Clear dialog
  dialogContent.appendChild(doc); // Fill dialog with data
  document.querySelector('.dialog__content-wrapper').scrollTop = 0; // Scroll dialog to top
  hljs.highlightAll(); // Highlight code blocks with Highlight.js
  collapseNavBar(); // Force navBar to collapse (if at top of page scroll down first)
  openDialog();
}

function getDialogContent(projectName) {
  showLoader();
  fetch(`/markdown/${projectName}.md`).then(response => response.text()).then(data => { // Get markdown for project
    data = marked(data); // Convert markdown to HTML
    if (!data.toString().includes('<!doctype html>')) { buildDialogContent(data); } // If successful
    else { getDialogContent('404'); } // Else retrieve 404 page
  }).catch((error) => { console.error('Error:', error); });
}

function openDialog() {
  hideLoader();
  document.body.classList.add('scroll_disabled');
  dialog.classList.add('active');
}

function openDialogFromPathname(pathname) {
  if (pathname !== '/') { // If not on root page
    getDialogContent(window.location.pathname.replace('/', '')); // Open dialog from path (projectName)
  } else {
    closeDialog();
  }
}

window.openCV = function openCV() {
  if (confirm("Open English version?")) {
    getAndViewBlob(`/cv/Curriculum Vitae Jan-Willem van Bremen 500779265 - English.pdf`);
  } else {
    if (confirm("Open Dutch version?")) {
      getAndViewBlob(`/cv/Curriculum Vitae Jan-Willem van Bremen 500779265.pdf`);
    }
  }
}

window.onLogoClick = function onLogoClick() {
  window.history.pushState(null, null, window.location.origin);
  closeDialog();
  navBar.classList.remove('open');
  window.scrollTo({top: 0, behavior: 'smooth'});
}

window.handleMenuClick = function handleMenuClick(elem) {
  const targetElem = document.getElementById(elem.dataset.linkTo);
  window.scrollTo({top: targetElem.offsetTop - topOffsetSmall, behavior: 'smooth'});

  if (dialog.classList.contains('active')) {
    closeDialog();
  }
}

window.onMenuButtonClick = function onMenuButtonClick() {
  navBar.classList.toggle('open');
}

window.closeDialog = function closeDialog() {
  if (window.location.pathname !== '/') { window.history.pushState(null, null, window.location.origin); }
  document.body.classList.remove('scroll_disabled');
  dialog.classList.remove('active');
}

window.onProjectClick = function onProjectClick(projectName) {
  getDialogContent(projectName);
  if (!window.location.pathname.includes(projectName)) { window.history.pushState(null, projectName, '/' + projectName); }
}

init();
