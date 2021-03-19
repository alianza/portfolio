const fs = require('fs');
const unified = require('unified')
const markdown = require('remark-parse')
const html = require('remark-html')

// const navHeight = document.getElementById('navbar').offsetHeight;
let navIsCollapsed = false;
const topOffsetBig = 80;
const topOffsetSmall = 48;

// Elems
const navBar = document.getElementById('navbar');

// Files
CVEnglish = require('/img/Curriculum Vitae Jan-Willem van Bremen 500779265 - English.pdf')
CVDutch = require('/img/Curriculum Vitae Jan-Willem van Bremen 500779265.pdf')

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

function scrollToTop() {
  window.scrollTo({top: 0, behavior: 'smooth'});
}

window.onscroll = function () {
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
};

function showMenu() {
  navBar.classList.toggle('shown');
  if (!navBar.classList.contains('shown')) {
    window.onscroll();
  }
}

function buildDialogContents(projectName) {
  console.log(projectName);
  unified()
    .use(markdown)
    .use(html)
    .process(fs.readFileSync('./static/markdown/pokedexreact.md'), function (err, file) {
      if (err) throw err;
      console.log(String(file));
      document.querySelectorAll('.dialog__content')[0].innerHTML = String(file);
    });
}

function openDialog(projectName) {
  console.log(projectName)
  buildDialogContents(projectName);
  document.body.classList.add('scroll_disabled');
  setTimeout(() => {
    document.getElementById('dialog').classList.add('active');
  }, 100);
}

function closeDialog() {
  document.body.classList.remove('scroll_disabled');
  document.getElementById('dialog').classList.remove('active');
}

function isDialogOpen() {
  return document.getElementById('dialog').classList.contains('active');
}

document.getElementById('video').playbackRate = .5;

window.handleMenuClick = handleMenuClick;
window.openCV = openCV;
window.scrollToTop = scrollToTop;
window.showMenu = showMenu;
window.openDialog = openDialog;
window.closeDialog = closeDialog;
