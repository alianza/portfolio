const fs = require('fs');
const unified = require('unified')
const markdown = require('remark-parse')
const html = require('remark-html')
const hljs = require('highlight.js');
import 'highlight.js/styles/xcode.css';

// const navHeight = document.getElementById('navbar').offsetHeight;
let navIsCollapsed = false;
const topOffsetBig = 80;
const topOffsetSmall = 48;

// Elems
const navBar = document.getElementById('navbar');

// Files
const CVEnglish = require('/img/Curriculum Vitae Jan-Willem van Bremen 500779265 - English.pdf')
const CVDutch = require('/img/Curriculum Vitae Jan-Willem van Bremen 500779265.pdf')

function handleMenuClick(elem) {
  const targetElem = document.getElementById(elem.dataset.linkTo);
  window.scrollTo({top: targetElem.offsetTop - topOffsetSmall, behavior: 'smooth'});

  if (isDialogOpen()) {
    closeDialog();
  }
}

function openCV() {
  if (confirm("Open English version?")) {
    window.open(CVEnglish, '_blank', 'fullscreen=yes');
  } else {
    if (confirm("Open Dutch version?")) {
      window.open(CVDutch, '_blank', 'fullscreen=yes');
    }
  }
}

function onLogoClick() {
  window.history.pushState(null, null, window.location.origin);
  closeDialog();
  scrollToTop();
}

function scrollToTop() {
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

function showMenu() {
  navBar.classList.toggle('shown');
  if (!navBar.classList.contains('shown')) {
    window.onscroll();
  }
}

function buildDialogContents(projectName) {
  let file = fs.readFileSync('./static/markdown/404.md');

  switch (projectName) {
    case 'pokedexreact':
      file = fs.readFileSync('./static/markdown/pokedexreact.md');
      break;
    case 'pokedexvue':
      file = fs.readFileSync('./static/markdown/pokedexvue.md');
      break;
    case 'monumental':
      file = fs.readFileSync('./static/markdown/monumental.md');
      break;
  }

  unified().use(markdown).use(html)
    .process(file, function (err, file) {
      if (err) throw err;
      let doc = document.createRange().createContextualFragment(file.toString());
      doc.querySelectorAll('[alt="icon"]').forEach(e => {
        e.classList.add(e.getAttribute('alt'));
      });
      document.getElementById('dialog-content').innerHTML = '';
      document.getElementById('dialog-content').appendChild(doc);
      document.querySelectorAll('.dialog__content-wrapper')[0].scrollTop = 0;
      hljs.highlightAll();
    });
}

function openDialog(projectName) {
  buildDialogContents(projectName);
  if (!window.location.pathname.includes(projectName)) { window.history.pushState(null, projectName, '/' + projectName); }
  document.body.classList.add('scroll_disabled');
  setTimeout(() => {
    document.getElementById('dialog').classList.add('active');
  }, 100);
}

function closeDialog() {
  if (window.location.pathname !== '/') { window.history.pushState(null, null, window.location.origin); }
  document.body.classList.remove('scroll_disabled');
  document.getElementById('dialog').classList.remove('active');
}

function isDialogOpen() {
  return document.getElementById('dialog').classList.contains('active');
}

function openDialogFromPathname(pathname) {
  if (pathname !== '/') {
    openDialog(window.location.pathname.replace('/', ''));
  } else {
    closeDialog();
  }
}

function init() {
  document.getElementById('video').playbackRate = .5;

  window.onscroll = function () {
    collapseNavBar();
  };

  openDialogFromPathname(window.location.pathname);

  collapseNavBar();

  window.onpopstate = function (event) {
    openDialogFromPathname(event.path[0].location.pathname);
  };
}

init();

window.handleMenuClick = handleMenuClick;
window.openCV = openCV;
window.onLogoClick = onLogoClick;
window.scrollToTop = scrollToTop;
window.showMenu = showMenu;
window.openDialog = openDialog;
window.closeDialog = closeDialog;
