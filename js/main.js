import 'highlight.js/styles/xcode.css';
import hljs from 'highlight.js/lib/core.js';
import marked from 'marked';

import * as constants from "./constants";
import { calculateYearsSinceDate } from "./lib/calculateYearsSinceDate";
import { onResize, onScroll } from "./lib/windowCallBacks";
import { getAndViewBlob } from "./lib/blob";
import getRepositoryLatestCommitDate from "./lib/gitHub";
import Accordion from './lib/accordion';
import { collapseNavBar } from "./lib/navBar";
import { hideLoader, showLoader } from "./lib/loader";
import { escapeKeyListener } from "./lib/escapeKeyListener";

import javascript from 'highlight.js/lib/languages/javascript';
import kotlin from 'highlight.js/lib/languages/kotlin';

let projectsData = {}

function init() {
  document.getElementById('age').innerHTML = calculateYearsSinceDate(new Date('10-10-1998'))
  document.getElementById('years').innerHTML = calculateYearsSinceDate(new Date('1-7-2011'))

  window.addEventListener('scroll', () => onScroll())
  window.addEventListener('resize', () => onResize())
  window.addEventListener('keydown', e => escapeKeyListener(e))
  window.addEventListener('popstate', e => openDialogFromPathname(e.path[0].location.pathname))

  onScroll()
  onResize()

  loadProjects()
  openDialogFromPathname(window.location.pathname)

  hljs.registerLanguage('javascript', javascript)
  hljs.registerLanguage('kotlin', kotlin)
}

async function buildDialogContent (data, projectName) {
  const currentProject = projectsData[projectName]
  const doc = document.createRange().createContextualFragment(data.toString()) // Create HTML fragment from HTML string
  const title = doc.querySelector('h1')
  if (currentProject?.timestampFrom && !currentProject?.timestampTo) { title.nextElementSibling.insertAdjacentHTML('beforebegin', `<p style="display: inline-block; margin: 0;"><b>To:</b> Present`) }
  if (currentProject?.timestampTo) { title.nextElementSibling.insertAdjacentHTML('beforebegin',  `<p style="display: inline-block; margin: 0;"><b>To:</b> ${new Date(currentProject?.timestampTo).toDateString().replace(/^\S+\s/,'')}</p>`) }
  if (currentProject?.timestampFrom) { title.nextElementSibling.insertAdjacentHTML('beforebegin', `<p style="display: inline-block; margin: 0 1em 0 0;"><b>From:</b> ${new Date(currentProject?.timestampFrom).toDateString().replace(/^\S+\s/,'')}</p>`) }
  if (currentProject?.gitHub) { doc.querySelector('a[href^="https://github.com/alianza/"] button').insertAdjacentHTML('beforeend', ` <b>Last updated:</b> ${new Date(await getRepositoryLatestCommitDate(currentProject?.gitHub)).toDateString().replace(/^\S+\s/,'')}`) }
  doc.querySelectorAll('[alt]:not([alt=""])').forEach(e => { e.classList.add(e.getAttribute('alt').split(' ')[0]) }) // set classnames from first alt attribute value
  doc.querySelectorAll('img.flex').forEach( e => { e.parentElement.classList.add('flex') }) // Set flex attribute for flex images parent
  doc.querySelectorAll('details').forEach((e) => { new Accordion(e) }) // Set Accordion animation for all details tags
  doc.querySelectorAll('a').forEach((e) => {e.setAttribute('target', '_blank'); e.setAttribute('rel', 'noopener') }) // Open all links in new tabs
  title.style.marginBottom = '.2em' // Set title style
  constants.dialogContent.innerHTML = '' // Clear dialog
  constants.dialogContent.append(doc) // Fill dialog with data
  document.querySelector('.dialog__content-wrapper').scrollTop = 0 // Scroll dialog to top
  hljs.highlightAll() // Highlight code blocks with Highlight.js
  collapseNavBar() // Force navBar to collapse (if at top of page scroll down first)
  constants.navBar.classList.remove('open') // Collapse mobile nav bar menu
  openDialog()
}

function getDialogContent(projectName) {
  showLoader()
  fetch(`/markdown/${projectName}.md`).then(response => response.text()).then(data => { // Get markdown for project
    data = marked(data) // Convert markdown to HTML
    if (!data.toString().includes('<!doctype html>')) { buildDialogContent(data, projectName) } // If successful
    else { getDialogContent('404') } // Else retrieve 404 page
  }).catch(error => { console.error('Error:', error); alert('Error loading project...') })
}

function openDialog() {
  hideLoader();
  document.body.classList.add('scroll_disabled')
  constants.dialog.setAttribute('open', '')
}

function openDialogFromPathname(pathname) {
  let projectName = pathname.replace('/', '')
  if (pathname !== '/') { getDialogContent(projectName) } // If not on root page open dialog from path (projectName)
  else { closeDialog() }
}

function loadProjects() {
  fetch('/projects/projects.json').then(response => response.json()).then(projects => {
    projectsData = projects;
    document.querySelector('#experiences .wrapper').innerHTML = ''
    Object.entries(projectsData).forEach(([name, project], index) => { // Iterate through projects and append to dom
      document.querySelector('#experiences .wrapper').insertAdjacentHTML('beforeend',
      `<div class="col clickable ${index > 5 ? 'hidden' : ''}" onclick="onProjectClick(this.dataset.name)" data-name="${name}" data-team="${project.team}" data-tech="${project.tech}">
                <img class="img" alt="${name} project" src="../projects/${name}/${name}.webp" onerror="this.src='../tile.webp'"/>
            <h3>${project.title}</h3>
          </div>`)
    })
    document.querySelector('.load-more').classList.remove('hidden')
  }).catch(error => { console.error('Error:', error); alert('Error loading projects...') })
}

window.openCV = () => { // Ask for language preference and open CV pdf blob
  if (confirm("Open English version?")) { getAndViewBlob(`/cv/Curriculum Vitae Jan-Willem van Bremen 500779265 - English.pdf`) }
  else if (confirm("Open Dutch version?")) { getAndViewBlob(`/cv/Curriculum Vitae Jan-Willem van Bremen 500779265.pdf`) }
}

window.onLogoClick = () => {
  window.history.pushState(null, null, window.location.origin)
  closeDialog()
  constants.navBar.classList.remove('open')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

window.handleMenuClick = (elem) => {
  const targetElem = document.getElementById(elem.dataset.linkTo)
  window.scrollTo({top: targetElem.offsetTop - constants.topOffsetSmall, behavior: 'smooth'})
  if (constants.dialog.hasAttribute('open')) { closeDialog() }
}

window.onMenuButtonClick = () => { constants.navBar.classList.toggle('open') }

window.closeDialog = () => {
  if (window.location.pathname !== '/') { window.history.pushState(null, null, window.location.origin) }
  document.body.classList.remove('scroll_disabled')
  constants.dialog.removeAttribute('open')
}

window.onProjectClick = (projectName) => {
  getDialogContent(projectName)
  if (!window.location.pathname.includes(projectName)) { window.history.pushState(null, projectName, '/' + projectName) }
}

init()
