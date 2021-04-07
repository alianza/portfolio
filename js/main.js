const hljs = require('highlight.js/lib/core');  // require only the core library
const marked = require('marked');
import 'highlight.js/styles/xcode.css';
import Accordion from './accordion';

// Init
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript')); // separately require languages

// Variables
let navIsCollapsed = false;
const topOffsetBig = 80;
const topOffsetSmall = 48;

// Elements
const navBar = document.getElementById('navbar');

window.handleMenuClick = function handleMenuClick(elem) {
  const targetElem = document.getElementById(elem.dataset.linkTo);
  window.scrollTo({top: targetElem.offsetTop - topOffsetSmall, behavior: 'smooth'});

  if (isDialogOpen()) {
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
  if (confirm("Open English version?")) { getAndViewBlob(`/cv/Curriculum Vitae Jan-Willem van Bremen 500779265 - English.pdf`);
  } else {
    if (confirm("Open Dutch version?")) { getAndViewBlob(`/cv/Curriculum Vitae Jan-Willem van Bremen 500779265.pdf`); }
  }
}

window.onLogoClick = function onLogoClick() {
  window.history.pushState(null, null, window.location.origin);
  closeDialog();
  scrollToTop();
}

window.scrollToTop = function scrollToTop() {
  window.scrollTo({top: 0, behavior: 'smooth'});
}

function collapseNavBar() {
  if (!navBar.classList.contains('shown')) {
    if (window.scrollY > topOffsetBig) {
      if (!navIsCollapsed) {
        document.getElementById('navbar').classList.add('collapsed');
      }
      navIsCollapsed = true;
    } else {
      if (navIsCollapsed) {
        document.getElementById('navbar').classList.remove('collapsed');
      }
      navIsCollapsed = false;
    }
  }
}

window.showMenu = function showMenu() {
  navBar.classList.toggle('shown');
  if (!navBar.classList.contains('shown')) {
    window.onscroll();
  }
}

function showLoader()  {
  document.getElementById('loader').classList.add('active');
}

function hideLoader()  {
  document.getElementById('loader').classList.remove('active');
}

function buildDialogContent (data) {
  const doc = document.createRange().createContextualFragment(data.toString()); // Create HTML fragment from HTML string
  doc.querySelectorAll('[alt]:not([alt=""])').forEach(e => { e.classList.add(e.getAttribute('alt').split(' ')[0]); }); // set classnames from first alt attribute value
  doc.querySelectorAll('img.flex').forEach( e => { e.parentElement.classList.add('flex'); }); // Set flex attribute for flex images parent
  doc.querySelectorAll('details').forEach((e) => { new Accordion(e); }); // Set Accordion animation for all details tags
  document.getElementById('dialog-content').innerHTML = ''; // Clear dialog
  document.getElementById('dialog-content').appendChild(doc); // Fill dialog with data
  document.querySelector('.dialog__content-wrapper').scrollTop = 0; // Scroll dialog to top
  hljs.highlightAll(); // Highlight code blocks with Highlight.js
  openDialog();
  collapseNavBar();
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
  document.getElementById('dialog').classList.add('active');
}

window.closeDialog = function closeDialog() {
  if (window.location.pathname !== '/') { window.history.pushState(null, null, window.location.origin); }
  document.body.classList.remove('scroll_disabled');
  document.getElementById('dialog').classList.remove('active');
}

function isDialogOpen() {
  return document.getElementById('dialog').classList.contains('active');
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
  document.getElementById('video').playbackRate = .5;

  window.onscroll = function () { collapseNavBar(); };

  openDialogFromPathname(window.location.pathname);

  collapseNavBar();

  window.onpopstate = function (event) {
    openDialogFromPathname(event.path[0].location.pathname);
  };
}

init();
