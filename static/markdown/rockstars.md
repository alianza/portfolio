# Rockstars Static - Next.js

![homepage](../projects/rockstars/rockstars.webp)

This project was a learning experience and a good example of how to use Next.js. This project demonstrates how to use 
Next.js to render static web pages from an external data source. The application allows you to search for rockstars and their songs.
The application is inspired by the Front-End Tech Case for my new position at Team Rockstars IT [![icon](../projects/rockstars/rockstars_5.webp)](https://teamrockstars.nl/).

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

This project is a static remake of the Front-End Tech Case for my new position at Team Rockstars IT. The application is
built using Next.js and TailwindCSS with JIT (Just In Time) mode. The application allows you to search for rockstars
and their songs and browse songs per genre. Thanks to its static nature the application is extremely fast and easy to deploy
using different hosting services like Vercel and Netlify. All pages are rendered at build time, served from a global CDN 
and cached using a service worker also supporting Progressive Web Application functionalities like caching and offline fallback support. 
I've had varying experience with different services regarding stability and built times. 
Vercel seems to be the fastest and most reliably for Next.js based applications by far.

The data source is a local JSON file served using the [json-server](https://www.npmjs.com/package/json-server) package during
the build. All pages are then statically generated using the Next.js framework. The application utilizes static generation
and static generation with dynamic routes. The application is also optimized for mobile devices and is a fully featured 
Progressive Web Application. 

---

## Screens

![flex screenshot](../projects/rockstars/rockstars.webp)
![flex screenshot](../projects/rockstars/rockstars_1.webp)

![flex screenshot](../projects/rockstars/rockstars_2.webp)
![flex screenshot](../projects/rockstars/rockstars_3.webp)

<video autoplay muted loop playsinline controls src="../projects/rockstars/rockstars.webm"></video>

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

## Lighthouse Audit Score ![icon](../logos/tech/lighthouse.png)

![flex screenshot](../projects/rockstars/lighthouse.png)

---

<details>
  <summary>Code Snippets</summary>
<div>

The following are some code snippets of pieces of code I'm proud of from this project. 
The snippets demonstrate clean, concise and powerful code following established best practices. _(Code has been compacted)_


**Artists pages with Dynamic routing**\
This is the /artists/[artistName].js file. It is a dynamic route that is used to render the detail page for each artist. 
All artist pages are rendered using the Next.js framework with data provided by the local JSON server ran at build-time.

```
export async function getStaticProps({ params }) {
    const songs = await MusicService.getSongsByArtistName(encodeURIComponent(params.name))

    return {
        props: {
            songs
        }
    }
}

export async function getStaticPaths() {
    const artists = await MusicService.getArtists()

    const paths = artists.map(artist => {
        return {
            params: {
                name: artist.name
            }
        }
    })

    return {
        paths,
        fallback: false
    }
}

export default function artist({ songs }) {
    const pageSize = 25
    const router = useRouter()
    const [filteredSongs, setFilteredSongs] = useState(songs)
    const [page, setPage] = useState(1)

    const albums = songs?.map(song => song.album).filter((album, index, self) => self.indexOf(album) === index)
    const oldest = songs?.length ? songs?.reduce((a, b) => a.year < b.year ? a : b) : ''
    const newest = songs?.length ? songs?.reduce((a, b) => a.year > b.year ? a : b) : ''

    const filterSongs = (e) => {
        triggerLoader(router)
        setPage(1)
        setFilteredSongs(songs?.filter(song => {
            return Object.values({...song, spotifyId: ''}).some(value => {
                return value?.toString().toLowerCase().includes(e.target.value.toLowerCase())
        })}))
    }

    return (
        <div id="artist" className="flex flex-wrap justify-between gap-2">
            <div className="flex justify-between flex-wrap gap-4 mb-4 w-full">
                <h1>Artist: "{router.query.name}"</h1>
                <input className="p-2 text-rockstar-grey w-full mobile:w-auto" placeholder="Search songs! 🎵" onChange={e => filterSongs(e)}/>
                <span className="text-xl w-full -mb-4">{oldest.year} - {newest.year}</span>
                <span className="text-xl w-full -mb-4">{albums.length} Album<SOrNot arrayLength={albums.length}/></span>
                <h2 className="w-full -mb-4">{filteredSongs.length} Song<SOrNot arrayLength={filteredSongs.length} withColon /></h2>
            </div>
            {filteredSongs.slice(0, page * pageSize).length ? filteredSongs.slice(0, page * pageSize).map(song =>
                <SongCard key={song.id} song={song} showGenre/>
            ) : <h3>No results...</h3>}
            {filteredSongs.length > 50 && <ScrollToTopButton/>}
            {!(filteredSongs.slice(0, page * pageSize).length === filteredSongs.length) &&
            <LoadMoreButton fullWidth loadMore={() => { triggerLoader(router); setPage(page + 1) }}/>}
        </div>
    )
}
```

**All Songs page**\
This is the all songs page. It is a static route that is used to render the page that lists all songs. 
It features advanced filtering on each property of a song and rudimentary sorting. 
Song elements are dynamically rendered using the React.js framework.
It also demonstrates how to treat large amounts of data using JSON compression.

```
export async function getStaticProps() {
    let songs = await MusicService.getSongs()

    songs = songs.map(song => { // Trim unneeded properties from songs
        const { id, bpm, duration, shortname, ...trimmedSongs } = song
        return trimmedSongs
    })

    songs = compress(songs)

    return {
        props: {
            songs
        }
    }
}

export default function Songs({songs}) {
    const pageSize = 50
    const router = useRouter()
    songs = decompress(songs)
    const [filteredSongs, setFilteredSongs] = useState(songs)
    const [page, setPage] = useState(1)

    const filterSongs = (e) => {
        triggerLoader(router)
        setPage(1)
        setFilteredSongs(songs?.filter(song => {
            return Object.values({...song, spotifyId: ''}).some(value => {
                return value?.toString().toLowerCase().includes(e.target.value.toLowerCase())
            })
        }))
    }

    return (
        <div id="songs" className="flex flex-wrap justify-between gap-2">
            <div className="flex justify-between flex-wrap gap-4 mb-4 w-full">
                <div className="flex items-center gap-4 w-full mobile:w-auto justify-between mobile:justify-start">
                    <h1>All Songs</h1>
                    <button className="button !p-2 shadow-3xl !w-auto" onClick={() => setFilteredSongs([...filteredSongs].reverse())}>Sort ⇕</button>
                </div>
                <input className="p-2 text-rockstar-grey  w-full mobile:w-auto" placeholder="Search songs! 🎵" onChange={e => filterSongs(e)}/>
            </div>

            {filteredSongs.slice(0, page * pageSize).length ? filteredSongs.slice(0, page * pageSize).map(song =>
                <SongCard showArtist showGenre key={`${song.name} ${song.artist}`} song={song}/>
            ) : <h3>No results...</h3>}
            {filteredSongs.length >= 50 && <ScrollToTopButton/>}
            {!(filteredSongs.slice(0, page * pageSize).length === filteredSongs.length) &&
            <LoadMoreButton fullWidth loadMore={() => { triggerLoader(router); setPage(page + 1) }}/>}
        </div>
    )
}
```


</div>
</details>

---

## Check out the project

[<button>![icon](../logos/tech/github.png) Github</button>](https://github.com/alianza/rockstars_static)
[<button>![icon](../logos/tech/vercel.png) Visit Site (Vercel)</button>](https://rockstars-static.vercel.app/)
[<button>![icon](../logos/tech/netlify.png) Visit Site (Netlify)</button>](https://rockstars.jwvbremen.nl/)
[<button>![icon](../logos/tech/lighthouse.png) Lighthouse audit</button>](/projects/rockstars/lighthouse.html)

---
