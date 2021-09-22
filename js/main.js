import 'highlight.js/styles/xcode.css';
import Accordion from './accordion';
import { collapseNavBar } from "./navBar";
import { hideLoader, showLoader } from "./loader";
import { escapeKeyListener } from "./escapeKeyListener";
import hljs from 'highlight.js/lib/core.js';
import marked from 'marked';

import javascript from 'highlight.js/lib/languages/javascript';
import kotlin from 'highlight.js/lib/languages/kotlin';
import * as constants from "./constants";
import { calculateYearsSinceDate } from "./calculateYearsSinceDate";
import { onResize, onScroll } from "./windowCallBacks";
import { getAndViewBlob } from "./blob";

// Init
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('kotlin', kotlin);

function init() {
  // document.getElementById('vid').playbackRate = .5; // Slow motion main video

  document.getElementById('age').innerHTML = calculateYearsSinceDate(new Date('10-10-1998'));
  document.getElementById('years').innerHTML = calculateYearsSinceDate(new Date('1-7-2011'));

  window.onscroll = function () { onScroll(); };
  window.onresize = function () { onResize(); };

  onScroll();
  onResize();

  openDialogFromPathname(window.location.pathname);

  window.onpopstate = function (event) {
    openDialogFromPathname(event.path[0].location.pathname);
  };

  document.onkeydown = escapeKeyListener;
}

function buildDialogContent (data) {
  const doc = document.createRange().createContextualFragment(data.toString()); // Create HTML fragment from HTML string
  doc.querySelectorAll('[alt]:not([alt=""])').forEach(e => { e.classList.add(e.getAttribute('alt').split(' ')[0]); }); // set classnames from first alt attribute value
  doc.querySelectorAll('img.flex').forEach( e => { e.parentElement.classList.add('flex'); }); // Set flex attribute for flex images parent
  doc.querySelectorAll('details').forEach((e) => { new Accordion(e); }); // Set Accordion animation for all details tags
  doc.querySelectorAll('a').forEach((e) => { e.setAttribute('target', '_blank') }); // Open all links in new tabs
  constants.dialogContent.innerHTML = ''; // Clear dialog
  constants.dialogContent.appendChild(doc); // Fill dialog with data
  document.querySelector('.dialog__content-wrapper').scrollTop = 0; // Scroll dialog to top
  hljs.highlightAll(); // Highlight code blocks with Highlight.js
  collapseNavBar(); // Force navBar to collapse (if at top of page scroll down first)
  constants.navBar.classList.remove('open'); // Collapse mobile nav bar menu
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
  constants.dialog.classList.add('active');
}

function openDialogFromPathname(pathname) {
  if (pathname !== '/') { // If not on root page
    getDialogContent(window.location.pathname.replace('/', '')); // Open dialog from path (projectName)
  } else {
    closeDialog();
  }
}

window.openCV = function openCV() { // Ask for language preference and open CV pdf blob
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
  constants.navBar.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.handleMenuClick = function handleMenuClick(elem) {
  const targetElem = document.getElementById(elem.dataset.linkTo);
  window.scrollTo({top: targetElem.offsetTop - constants.topOffsetSmall, behavior: 'smooth'});

  if (constants.dialog.classList.contains('active')) {
    closeDialog();
  }
}

window.onMenuButtonClick = function onMenuButtonClick() {
  constants.navBar.classList.toggle('open');
}

window.closeDialog = function closeDialog() {
  if (window.location.pathname !== '/') { window.history.pushState(null, null, window.location.origin); }
  document.body.classList.remove('scroll_disabled');
  constants.dialog.classList.remove('active');
}

window.onProjectClick = function onProjectClick(projectName) {
  getDialogContent(projectName);
  if (!window.location.pathname.includes(projectName)) { window.history.pushState(null, projectName, '/' + projectName); }
}

init();
