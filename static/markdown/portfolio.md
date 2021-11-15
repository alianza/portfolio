# Personal Portfolio Website - Vanilla JS

![homepage](../projects/portfolio/portfolio.webp)

I built this Personal Portfolio Website to introduce myself as a software engineer, demonstrate some of my previous projects
and experiences and as practice in vanilla web development (No frameworks). I update this website with new content as I
make new projects or gain new professional experiences!

---

## Technologies & Frameworks

- Sass [![icon](../logos/tech/sass.png)](https://sass-lang.com/)
- Node.js [![icon](../logos/tech/nodejs.png)](https://www.nodejs.org/)
- Git(hub) [![icon](../logos/tech/github.png)](https://www.github.com/)
- Netlify [![icon](../logos/tech/netlify.png)](https://netlify.com/)
- Parcel.js [![icon](../logos/tech/parcel.png)](https://parceljs.org/)
- Markdown [![icon](../logos/tech/markdown.png)](https://daringfireball.net/projects/markdown/)

---

## Summary

The website features a lot of visual elements like a full screen background video, lots of images and hover effects.
Most of the website's content resides behind the clickable project images. In the dialog that pops up detailed information
for every project (That I've gotten around to write) can be found including images, video's, code snippets and links to source code
and live demo's. Content is created using Markdown and a minimal amount of HTML. This is all fetched on the fly when the user requests it.
The project is hosted using the [Netlify](https://netlify.com/) deployment platform.

---

## Screens

![flex screenshot](../projects/portfolio/portfolio_1.webp)
![flex screenshot](../projects/portfolio/portfolio_2.webp)
<video autoplay muted loop playsinline controls src="../projects/portfolio/portfolio.webm"></video>

---

## Lighthouse Audit Score ![icon](../logos/tech/lighthouse.png)

![flex screenshot](../projects/portfolio/lighthouse.png)

---

<details>
  <summary>Code Snippets</summary>
<div>

The following are some code snippets of pieces of code I'm proud of from this project. The snippets demonstrate clean, concise and powerful code. _(Code has been compacted)_

**Main JavaScript file**\
The main JavaScript file is responsible for initializing the application, loading in dynamic data and responding to
user events. The file is written to be as straight forward and readable as possible while performing many essential functions
of the application.

```
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
}

async function buildDialogContent (data, projectName) {
  const currentProject = projectsData[projectName]
  const doc = document.createRange().createContextualFragment(data.toString()) // Create HTML fragment from HTML string
  const title = doc.querySelector('h1')

  if (title) {
    if (currentProject?.timestampFrom && !currentProject?.timestampTo) { title.nextElementSibling.insertAdjacentHTML('beforebegin', `<p style="display: inline-block; margin: 0;"><b>To:</b> Present`) }
    if (currentProject?.timestampTo) { title.nextElementSibling.insertAdjacentHTML('beforebegin',  `<p style="display: inline-block; margin: 0;"><b>To:</b> ${new Date(currentProject?.timestampTo).toDateString().replace(/^\S+\s/,'')}</p>`) }
    if (currentProject?.timestampFrom) { title.nextElementSibling.insertAdjacentHTML('beforebegin', `<p style="display: inline-block; margin: 0 1em 0 0;"><b>From:</b> ${new Date(currentProject?.timestampFrom).toDateString().replace(/^\S+\s/,'')}</p>`) }
    title.style.marginBottom = '.2em' } // Set title style

  if (currentProject?.gitHub) { doc.querySelector('a[href^="https://github.com/alianza/"] button')?.insertAdjacentHTML('beforeend', ` <b>Last updated:</b> ${new Date(await getRepositoryLatestCommitDate(currentProject?.gitHub)).toDateString().replace(/^\S+\s/,'')}`) }

  doc.querySelectorAll('[alt]:not([alt=""])').forEach(e => { e.classList.add(e.getAttribute('alt').split(' ')[0]) }) // set classnames from first alt attribute value
  doc.querySelectorAll('img.flex').forEach( e => { e.parentElement.classList.add('flex') }) // Set flex attribute for flex images parent
  doc.querySelectorAll('details').forEach((e) => { new Accordion(e) }) // Set Accordion animation for all details tags
  doc.querySelectorAll('a').forEach((e) => {e.setAttribute('target', '_blank'); e.setAttribute('rel', 'noopener') }) // Open all links in new tabs

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
  registerHljsLanguages()
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
            <h3>${project.name} - ${project.suffix}</h3>
          </div>`)
    })
    document.querySelector('.load-more').classList.remove('hidden')
  }).catch(error => { console.error('Error:', error); alert('Error loading projects...') })
}

function registerHljsLanguages() {
  import('highlight.js/lib/languages/javascript.js').then(javascript => { hljs.registerLanguage('javascript', javascript) })
  import('highlight.js/lib/languages/kotlin.js').then(kotlin => { hljs.registerLanguage('kotlin', kotlin) })
  import('highlight.js/lib/languages/xml.js').then(xml => { hljs.registerLanguage('xml', xml) })
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
```

**Index.html**\
The index.html is the initial page that is loaded. It contains the header, footer and the container main content.
The projects and past experiences are loaded in the main content using JavaScript.

```
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Jan-Willem van Bremen - Portfolio</title>
    <meta name="description" content="Portfolio website Jan-Willem van Bremen - Software Engineer">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="manifest" href="site.webmanifest">

    <link rel="stylesheet" href="css/main.css">

    <meta name="theme-color" content="#222">
</head>

<body>

<nav id="navbar">
    <div class="navbar__logo">
        <h1 id="logo" onclick="onLogoClick()">J.W.</h1>
    </div>
    <div class="navbar__menu">
        <span onclick="handleMenuClick(this)" data-link-to="about_me">About me</span>
        <span onclick="handleMenuClick(this)" data-link-to="experiences">Experiences</span>
        <span onclick="openCV()" data-link-to="curriculum_vitae">Curriculum Vitae</span>
        <span onclick="handleMenuClick(this)" data-link-to="contact">Contact</span>
    </div>
    <div class="navbar__mobile" onclick="onMenuButtonClick()"><h1>☰</h1></div>
</nav>

<header id="cover">
    <div class="cover__title">
        <h1>Jan-Willem van Bremen</h1>
        <h2>Software developer, Skateboarder & Model!</h2>
    </div>
    <video class="cover__video" id="vid" autoplay playsinline muted loop>
        <source src="static/cover_video.webm" type="video/webm">
        <source src="static/cover_video.mp4" type="video/mp4">
    </video>
</header>

<main id="content">
    <section id="about_me">
        <div class="container">
            <h1>About me!</h1>
            <div class="wrapper">
                <div class="col" data-name="portrait">
                    <img class="img" alt="portrait" src="static/portrait.webp">
                    <h3>Who I am</h3>
                    <p>My name is Jan-Willem van Bremen. I'm a <span id="age"></span> year old software engineer,
                        skateboarder and model from Amsterdam! I'm a very social, diligent and precise person who can concentrate for long periods of time.
                        I work well both solo and in development teams!</p>
                </div>
                <div class="col" data-name="professional">
                    <video class="img" autoplay playsinline muted loop>
                        <source src="static/professional.webm" type="video/webm">
                        <source src="static/professional.mp4" type="video/mp4">
                    </video>
                    <h3>What I do professionally</h3>
                    <p>Professionally I am a Software Engineer focussing on front-end web-development and a bit of Android development.
                        I do this using technologies & techniques like HTML, (S)CSS, Type/JavaScript, Node.js, web frameworks (React, Vue), Git(hub), Agile Scrum and more!
                        Check out some of my experiences & projects! </p>
                </div>
                <div class="col" data-name="fun">
                    <img class="img" alt="fun" src="static/fun.webp"/>
                    <h3>What I do for fun</h3>
                    <p>For fun I have been practicing skateboarding for <span id="years"></span> years on an amateur level.
                      During my skateboarding career I have been sponsored by different brands and shops.
                      Next to that I also do some model work for various street wear brands in Amsterdam.</p>
                </div>
            </div>
        </div>
    </section>

    <section id="experiences">
        <div class="container">
            <h1>Experiences & Projects</h1>
            <div class="wrapper">
                <!-- Experiences to be added dynamically by js -->
                <h2>JavaScript is required to view Experiences & Projects...</h2>
            </div>
            <button class="button load-more hidden" onclick="document.querySelectorAll('#experiences .clickable').forEach(e => { e.classList.remove('hidden') }); this.remove()">Load more projects...</button>
        </div>
    </section>

    <section id="contact">
        <div class="container">
            <h1>Contact me!</h1>
            <div class="wrapper">
                <div class="col">
                    <h3>Send me a message!</h3>
                    <form class="contact_form" name="contact" method="POST" data-netlify="true" data-netlify-recaptcha="true">
                        <div class="contact_form__left">
                            <span>
                                <input id="name" class="balloon" type="text" placeholder="Your full name" name="name" required/>
                              <label for="name">Name</label>
                            </span>
                            <span>
                                <input id="email" class="balloon" type="email" placeholder="Your Email address" name="email" required/>
                              <label for="email">Email</label>
                            </span>
                        </div>
                        <div class="contact_form__right">
                            <span>
                             <textarea id="message" class="balloon balloon-big-indent" rows="5" placeholder="Your message to me :)" name="message" required></textarea>
                              <label for="message">Message</label>
                            </span>
                        </div>
                        <div class="contact_form__bottom">
                            <button type="submit">Send</button>
                            <div data-netlify-recaptcha="true"></div>
                        </div>
                    </form>
                </div>
                <div class="col">
                    <h3>Or, Email me directly! @ <a href="mailto:janwillemvanbremen@live.nl">janwillemvanbremen@live.nl</a></h3>
                </div>
            </div>
        </div>
    </section>
</main>

<footer id="footer">
    <span class="footer__author">Jan-Willem van Bremen</span>
    <div class="footer__social-media">
        <a href="https://www.linkedin.com/in/jan-willem/">LinkedIn</a>
        <a href="https://www.facebook.com/janwillem.van.bremen.9/">Facebook</a>
        <a href="https://www.instagram.com/jan_willem.van.bremen/">Instagram</a>
        <a href="https://github.com/alianza">GitHub</a>
        <a href="mailto:janwillemvanbremen@live.nl">📧 Email</a>
        <a href="tel:+31657118462">📞 Phone</a>
    </div>
</footer>

<div id="loader">
    <div></div>
</div>

<dialog id="dialog">
    <div class="dialog__backdrop" onclick="closeDialog()"></div>
    <div class="dialog__content-wrapper">
        <div onclick="closeDialog()" class="dialog__close-button">✖</div>
        <div class="dialog__container">
            <div class="dialog__content" id="dialog-content"></div>
        </div>
    </div>
</dialog>

<script defer src="js/main.js"></script>

</body>

</html>

```

</div>
</details>

---

## Check out the project

[<button>![icon](../logos/tech/github.png) Github</button>](https://github.com/alianza/portfolio)
[<button>![icon](../projects/portfolio/portfolio.webp) Visit Site</button>](https://jwvbremen.nl/) _You are already here :)_
[<button>![icon](../logos/tech/lighthouse.png) Lighthouse audit</button>](/projects/portfolio/lighthouse.html)

---
