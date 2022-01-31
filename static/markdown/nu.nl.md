# Nu.nl Clone - Next.js

![homepage](../projects/nu.nl/nu.nl.webp)

This project was a learning experience and a good example of how to use Next.js to generate multiple pages.
This project demonstrates how to use the Next.js framework to render multiple pages from an external data source.
The data source originates from the [nu.nl](https://nu.nl) website's xml feeds which are consumed by the application
and converted to JSON for internal use.

---

## Technologies & Frameworks

- Next.js Framework [![icon](../logos/tech/nextjs.png)](https://nextjs.org/)
- Sass [![icon](../logos/tech/sass.png)](https://sass-lang.com/)
- Node.js [![icon](../logos/tech/nodejs.png)](https://www.nodejs.org/)
- Git(hub) [![icon](../logos/tech/github.png)](https://www.github.com/)
- Progressive Web Application [![icon](../logos/tech/pwa.png)](https://web.dev/progressive-web-apps/)
- TailwindCSS [![icon](../logos/tech/tailwindcss.png)](https://tailwindcss.com/)
- Netlify [![icon](../logos/tech/netlify.png)](https://netlify.com/)
- Vercel [![icon](../logos/tech/vercel.png)](https://vercel.com/)

---

## Summary

This project is a clone of the [nu.nl](https://nu.nl) news website. It uses the [nu.nl](https://nu.nl) RSS feeds as the data source.
The RSS feeds are converted to JSON and used to generate pages for each news category. 
They are all server side or statically rendered using the Next.js framework.
Thanks to its static nature the application is extremely fast and easy to deploy
using different hosting services like Vercel and Netlify. All pages are rendered at build time, served from a global CDN
and cached using a service worker also supporting Progressive Web Application functionalities like caching and offline fallback support.
I've had varying experience with different services regarding stability and built times.
Vercel seems to be the fastest and most reliably for Next.js based applications by far.

Data not included in the RSS feeds, like the contents of actual stories are retrieved using the 
[Whatever Origin](https://whatever.fly.dev/) website's API. This is a service that allows you to access the contents of an 
external resource without encountering the same-origin policy.

---

## Screens

![flex screenshot](../projects/nu.nl/nu.nl.webp)
![flex screenshot](../projects/nu.nl/nu.nl_1.webp)

![flex screenshot](../projects/nu.nl/nu.nl_2.webp)
![flex screenshot](../projects/nu.nl/nu.nl_3.webp)

---

## Techniques & Libraries

- [NodeJS](https://nodejs.org/)
- [JSON](https://json.org/)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Yarn](https://yarnpkg.com/)
- [Cypress E2E testing](https://www.cypress.io/)
- [Github Actions](https://www.github.com/features/actions)
- [Lighthouse Audits](https://developers.google.com/web/tools/lighthouse/)
- [Compress-JSON](https://www.npmjs.com/package/compress-json)
- [Prop-Types](https://www.npmjs.com/package/prop-types)
- [Nextjs-Progressbar](https://www.npmjs.com/package/nextjs-progressbar)
- [XML-JS](https://www.npmjs.com/package/xml-js)
- [Next-PWA](https://www.npmjs.com/package/next-pwa)

## Lighthouse Audit Score ![icon](../logos/tech/lighthouse.png)

![flex screenshot](../projects/nu.nl/lighthouse.png)

---

<details>
  <summary>Code Snippets</summary>
<div>

The following are some code snippets of pieces of code I'm proud of from this project. 
The snippets demonstrate clean, concise and powerful code following established best practices. _(Code has been compacted)_

**Index.js file**\
The Index.js file is the main entry point of the application. It is responsible for gathering data from the external data source.
The data is converted to JSON and used to generate each category on the page in a dynamic fashion.

```
export async function getServerSideProps() {
    const algemeen = await NuService.getVoorpagina('4')
    const anders = await NuService.getAlgemeen('4')
    const opmerkelijk = await NuService.getOpmerkelijk('4')
    const wetenschap = await NuService.getWetenschap('4')
    const gezondheid = await NuService.getGezondheid('4')
    const tech = await NuService.getTech('4')
    const sport = await NuService.getSport('4')
    const economie = await NuService.getEconomie('4')
    const film = await NuService.getFilm('4')
    const muziek = await NuService.getMuziek('4')
    const achterklap = await NuService.getAchterklap('4')
    const podcast = await NuService.getPodcast('4')

    return {
        props: {
            channels: [
                algemeen,
                anders,
                opmerkelijk,
                wetenschap,
                gezondheid,
                tech,
                sport,
                economie,
                film,
                muziek,
                achterklap,
                podcast
            ],
            buildTime: new Date().toString()
        },
    }
}

export default function Home({ channels }) {
    const [story, setStory] = useState(null)

    return (
        <div className="flex flex-col items-center gap-8">

            <QuickTabs channels={channels} />

            {channels.map(channel => (<Channel key={channel.title} openStory={setStory} channel={channel} linkToChannel/>))}

            <StoryDialog story={story} setStory={setStory}/>

        </div>
    )
}
```

**Channel component**\
The Channel component is basically a news category with a title, the data and a collection of stories.

```
export default function Channel({channel, openStory, linkToChannel}) {
    const channelLink = channel.link.substr(channel.link.lastIndexOf('/'), channel.link.length)
    const channelDate = new Date(channel.lastBuildDate)

    let formattedDate = formatDate(channelDate)

    if (!months.some(value => formattedDate.includes(value))) { // If date doesn't contain month name, add time
        formattedDate = `${formattedDate} om: ${formatTime(channelDate)}`
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center">
                {linkToChannel ?
                    <Link href={channelLink}>
                        <a className='relative group flex items-center'>
                            <span id={channel.title.replace('NU - ', '')} className="absolute -top-20"/>
                            <h1 className="text-2xl">{channel.title}</h1>
                            <span className='absolute -right-6 text-2xl transition-transform group-hover:translate-x-2'>→</span>
                        </a>
                    </Link> : <h1 className="text-2xl">{channel.title}</h1>}
                <span className="text-accent-6"> Laatste data: {formattedDate}</span>
            </div>

            <ul className="flex flex-wrap justify-center gap-8 tablet:gap-4 w-full">
                {channel.item.map(item => <Story openStory={openStory} key={item.title} item={item}/> )}
            </ul>
        </div>
    )
}
```

**Story component**\
The Story component is a small component that is used to display the preview of a story. It is styled using TailwindCSS
and accepts a story object as a prop.

```
export default function Story(props) {
    const storyDate = new Date(props.item.pubDate)
    const dateString = `${formatDate(props.item.pubDate)} om: ${formatTime(storyDate)}`

    return(
        <li tabIndex='0' className="flex flex-col gap-2 flex-grow relative basis-64 rounded-lg outline-offset-4 outline-accent-6 focus:outline focus:outline-1 active:outline active:outline-1">
            <div style={{backgroundImage: `url(${props.item.enclosure._attributes.url})`}}
                 className="text-white text-xl bg-cover bg-center bg-no-repeat relative z-10 p-2 rounded-t-lg">
                <a className="py-1 after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-black/50 after:z-[-1] after:rounded-t-lg"
                   href={props.item.link} target="_blank" rel="noreferrer" onClick={e => { e.preventDefault(); props.openStory(props.item)}}>
                    {props.item.title}</a>
                <a className="before:margin-1 before:relative before:w-[24px] before:h-[24px] before:inline-block before:align-text-bottom"
                   href={props.item.link} target="_blank" rel="noreferrer" title="Lees volledig bericht...">
                    <NewTabIcon className='absolute bottom-1 right-1 ml-auto p-2 invert transition-transform hover:scale-125'/>
                </a>
            </div>
            <span>{dateString}</span>
            <p className="text-sm"
               dangerouslySetInnerHTML={{
                   __html: !(props.item.description && Object.keys(props.item.description).length === 0) ?
                       props.item.description.toString() : "Geen beschrijving..."
               }}/>
        </li>
    )
}

```

</div>
</details>

---

## Check out the project

[<button>![icon](../logos/tech/github.png) Github</button>](https://github.com/alianza/nu.nl)
[<button>![icon](../logos/tech/vercel.png) Visit Site (Vercel)</button>](https://nu-nl.vercel.app/)
[<button>![icon](../logos/tech/netlify.png) Visit Site (Netlify)</button>](https://www.nu.jwvbremen.nl/)
[<button>![icon](../logos/tech/lighthouse.png) Lighthouse audit</button>](/projects/nu.nl/lighthouse.html)

---
