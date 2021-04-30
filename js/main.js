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

// Elements
const navBar = document.getElementById('navbar');
const loader = document.getElementById('loader');
const dialog = document.getElementById('dialog');
const dialogContent = document.getElementById('dialog-content');

window.handleMenuClick = function handleMenuClick(elem) {
  const targetElem = document.getElementById(elem.dataset.linkTo);
  window.scrollTo({top: targetElem.offsetTop - topOffsetSmall, behavior: 'smooth'});

  if (dialog.classList.contains('active')) {
    closeDialog();
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

window.openCV = function openCV() {
  if (confirm("Open English version?")) { getAndViewBlob(`/cv/Curriculum Vitae Jan-Willem van Bremen 500779265 - English.pdf`); }
  else {
    if (confirm("Open Dutch version?")) { getAndViewBlob(`/cv/Curriculum Vitae Jan-Willem van Bremen 500779265.pdf`); }
  }
}

window.onLogoClick = function onLogoClick() {
  window.history.pushState(null, null, window.location.origin);
  closeDialog();
  window.scrollTo({top: 0, behavior: 'smooth'});
}

function collapseNavBar(force = false) {
  if (!navBar.classList.contains('open')) {
    if (force && window.scrollY === 0) { // When dialog is forced open and window scrolled to top
      window.scroll({top: topOffsetBig, behavior: 'smooth'});
    }

    if (window.scrollY >= topOffsetBig) {
      if (!navBar.classList.contains('collapsed')) {
        navBar.classList.add('collapsed');
      }
    } else {
      if (navBar.classList.contains('collapsed')) {
        navBar.classList.remove('collapsed');
      }
    }
  }
}

window.showMenu = function showMenu() {
  navBar.classList.toggle('open');
  if (!navBar.classList.contains('open')) {
    window.onscroll();
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
  collapseNavBar(true); // Force navBar to collapse (if at top of page scroll down first)
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

window.closeDialog = function closeDialog() {
  if (window.location.pathname !== '/') { window.history.pushState(null, null, window.location.origin); }
  document.body.classList.remove('scroll_disabled');
  dialog.classList.remove('active');
}

function openDialogFromPathname(pathname) {
  if (pathname !== '/') {
    getDialogContent(window.location.pathname.replace('/', ''));
  } else {
    closeDialog();
  }
}

window.onProjectClick = function onProjectClick(projectName) {
  getDialogContent(projectName);
  if (!window.location.pathname.includes(projectName)) { window.history.pushState(null, projectName, '/' + projectName); }
}

function init() {
  document.getElementById('vid').playbackRate = .5;

  window.onscroll = function () { collapseNavBar(); };

  openDialogFromPathname(window.location.pathname);

  collapseNavBar();

  window.onpopstate = function (event) {
    openDialogFromPathname(event.path[0].location.pathname);
  };
}

init();
