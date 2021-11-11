# Rockstars Static - Next.js

![homepage](../projects/rockstars/rockstars.webp)

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



---

## Screens

![flex screenshot](../projects/rockstars/rockstars.webp)
![flex screenshot](../projects/rockstars/rockstars_1.webp)

![flex screenshot](../projects/rockstars/rockstars_2.webp)
![flex screenshot](../projects/rockstars/rockstars_3.webp)

<video autoplay muted loop playsinline controls src="../projects/rockstars/rockstars.webm"></video>

---

<details>
  <summary>Code Snippets</summary>
<div>

The following are some code snippets of pieces of code I'm proud of from this project. The snippets demonstrate clean, concise and powerful code. _(Code has been compacted)_
The largest file in the project is 80 lines of code which says something about the simplicity of the code.

**App component**\
The App component is responsible for housing the application layout & content and showing the correct pages based on route.

```
function App() {
  return (
      <Router>
          <div id="app" className={'text-text-primary'}>

              <div id={'background'} className={'fixed w-full h-full bg-primary top-0'}/>

              <Menu/>

              <Wave id={'wave'} className={'fixed bottom-0 bg-primary transition-transform origin-bottom scale-x-450 scale-y-650 animate-waveSm xsm:scale-150 xsm:animate-waveXsm sm:scale-100 sm:animate-wave'}/>

              <AnimatedSwitch
                  atEnter={{opacity: 0}}
                  atLeave={{opacity: 0}}
                  atActive={{opacity: 1}}
                  className={'relative'}>

                  <Route exact path='/' component={Home}/>

                  <Route exact path={['/result', '/result/:name', '/result/:name/:countryCode']} component={Result}/>

                  <Route path="/about" component={About}/>

                  <Route component={NotFound}/>

              </AnimatedSwitch>

              <Loader/>

          </div>
      </Router>
  );
}
```

**Results page**\
This code snippet demonstrates the Results page. It performs API requests to the different endpoints based on url parameters,
then the results are displayed in the DOM to the user.

```
function Result() {
    const history = useHistory();
    const match = useRouteMatch();

    const name = match.params.name
    const countryCode = match.params.countryCode?.toUpperCase()
    const [result, setResult] = useState()

    useEffect(() => {
        if (name && !countryCode) {
            ApiService.lookUpByName(name).then(result => {
                setResult(result)
            })
        } else if (name && countryCode) {
            ApiService.lookUpByNameAndCountry(name, countryCode).then(result => {
                setResult(result)
            })
        } else { history.replace('/') }
    }, [name, countryCode, history])

    return (
        <Layout>
            <div className={'text-center'}>
                <h1 className={'main-title'}>Who Am I?</h1>
            </div>
            { result &&
            <div className={"content-container"}>
                <div className={'text-center bg-accent-1 p-4 shadow-lg sm:px-24'}>
                    <h1 className={'text-4xl my-4'}>{capitalize(name)}</h1>

                    {countryCode &&
                        <h2 className={'text-accent-3 mb-4'}>From <span className={'text-text-primary'}>{iso3311a2.getCountry(countryCode)}</span></h2>
                    }
                    
                    { !!result.ageResult?.age && <>
                        <h2 className={'text-accent-3'}>Age</h2>
                        <h1 className={'text-4xl mb-4'}>{result.ageResult.age}</h1></>
                    }

                    { !!result.genderResult?.gender && <>
                        <h2 className={'text-accent-3'}>Gender</h2>
                        {result.genderResult.gender === 'male' ?
                            <Male className={'fill-current w-[64px] h-[64px] m-auto'}/> :
                            <Female className={'fill-current w-[64px] h-[64px] m-auto'}/>
                        }
                        <div className={'text-sm text-accent-3 mb-4'}>Probability: <span className={'text-text-primary'}>{Math.round(100 * result.genderResult.probability)}%</span></div></>
                    }

                    { !!result.nationalityResult?.country?.length && <>
                        <h2 className={'text-accent-3'}>Nationality</h2>
                        <h1 className={'text-4xl'}>{iso3311a2.getCountry(result.nationalityResult.country[0].country_id)}</h1>
                        <div className={'text-sm text-accent-3'}>Probability: <span className={'text-text-primary'}>{Math.round(100 * result.nationalityResult.country[0].probability)}%</span></div></>
                    }

                    { !(!!result?.ageResult?.age || !!result?.genderResult?.gender || !!result?.nationalityResult?.country?.length) && <>
                        <span className={'text-primary block'}>You are a unknown alien... 👾</span>
                        <span className={'text-secondary text-sm'}>No known data based on your name.</span></>
                    }
                </div>
                <button onClick={() => { history.push('/') }} className={"bg-secondary p-2 text-primary font-bold transition-transform ease-in-out hover:scale-105 active:scale-95"}>Try Again!</button>
            </div>
            }
        </Layout>
    );
}
```

</div>
</details>

---

## Check out the project

[<button>![icon](../logos/tech/github.png) Github</button>](https://github.com/alianza/rockstars_static)
[<button>![icon](../logos/tech/vercel.png) Visit Site</button>](https://rockstars-static.vercel.app/)
[<button>![icon](../logos/tech/netlify.png) Visit Site (Netlify)</button>](https://rockstars.jwvbremen.nl/)

---
