# WhoAmI? - React

![homepage](../projects/whoami/whoami.webp)

As you know by now I like to experiment with different API's. This time we are predicting properties of people based on their name!
The application has been created for my own enjoyment and to improve my skills regarding quick prototyping, API data fetching
and some minor animations. Built using the [*ReactJS*](https://reactjs.org/) web framework.
---

## Technologies & Frameworks

- ReactJS [![icon](../logos/tech/react.png)](https://reactjs.org/)
- React-Router [![icon](../logos/tech/react-router.png)](https://reactrouter.com/)
- React-Router-Transition [![icon](../logos/tech/react-router.png)](http://maisano.github.io/react-router-transition/)
- Sass [![icon](../logos/tech/sass.png)](https://sass-lang.com/)
- Node.js [![icon](../logos/tech/nodejs.png)](https://www.nodejs.org/)
- Git(hub) [![icon](../logos/tech/github.png)](https://www.github.com/)
- Progressive Web Application [![icon](../logos/tech/pwa.png)](https://web.dev/progressive-web-apps/)
- TailwindCSS [![icon](../logos/tech/tailwindcss.png)](https://tailwindcss.com/)
- Netlify [![icon](../logos/tech/netlify.png)](https://netlify.com/)

---

## Summary

The WhoAmI application is a Progressive Web Application that is able to predict your age, gender and nationality based on your name. 
It's also possible to supply your nationality to increase accuracy of the other metrics. The predictions are supplied by three
different API endpoints that have different responsibilities. There is an API endpoint for the Age, Gender and Nationality predictions.
These API's are [*Agify.io*](http://Agify.io/), [*Genderize.io*](http://Genderize.io/)  and [*Nationalize.io*](http://Nationalize.io/) respectively.

The application is fast, easy to use and looks good! Using TailwindCSS for styling the application was built in only two days!
The user interface is fully responsive, fully routed and features transitions between pages. 
The application is hosted using the [Netlify](https://netlify.com/) deployment platform.

Try it out and enjoy!

---

## Screens

![flex screenshot](../projects/whoami/whoami_1.webp)
![flex screenshot](../projects/whoami/whoami_2.webp)
<video autoplay muted loop playsinline controls src="../projects/whoami/whoami.webm"></video>

---

## Lighthouse Audit Score ![icon](../logos/tech/lighthouse.png)

![flex screenshot](../projects/whoami/lighthouse.png)

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

**API Service**\
This code snippet demonstrates the API Service JavaScript file. It performs API requests to each of the different endpoints
based on a supplied name or name & nationality. It then performs and combined the different results of each API request into a single
promise to be consumed by the application.

```
const ApiService = {
    doLoad(url) { // Base method for doing http Get requests and returning the result
        return fetch(url).then(response => {
            if (response.status === 404) { return '' }
            if (response.status === 200) { return response.json() }})
            .then(data => {
                return data
            })
    },

    async lookUpByName(name) {
        const [ageResult, genderResult, nationalityResult] = await Promise.all([
            AgeService.getAgeByName(name),
            GenderService.getGenderByName(name),
            NationalityService.getNationalityByName(name)
        ]);

        return {ageResult, genderResult, nationalityResult}
    },

    async lookUpByNameAndCountry(name, countryCode) {
        const [ageResult, genderResult] = await Promise.all([
            AgeService.getAgeByNameAndCountry(name, countryCode),
            GenderService.getGenderByNameAndCountry(name, countryCode)
        ]);

        return {ageResult, genderResult}
    }
}
```

**Age Service**\
This code snippet demonstrates the Age Service JavaScript file. It performs API requests to the [*Agify.io*](http://Agify.io/) endpoint
based on a supplied name or name & nationality. It then returns the results or catches and throws a user-friendly error.

```
const AgeService = {
    baseUrl: "https://api.agify.io",

    getAgeByName(name) {
        return ApiService.doLoad(`${this.baseUrl}?name=${name}`).then(jsonData => {
            return jsonData
        }).catch(e => {
            console.log('Error', e)
            alert('Error retrieving age by name... \nPlease try again later!',)
        })
    },

    getAgeByNameAndCountry(name, countryCode) {
        return ApiService.doLoad(`${this.baseUrl}?name=${name}&country_id=${countryCode}`).then(jsonData => {
            return jsonData
        }).catch(e => {
            console.log('Error', e)
            alert('Error retrieving age by name and country... \nPlease try again later!',)
        })
    },
}
```

</div>
</details>

---

## Check out the project

[<button>![icon](../logos/tech/github.png) Github</button>](https://github.com/alianza/who_am_i)
[<button>![icon](../projects/whoami/whoami.webp) Visit Site</button>](https://whoami.jwvbremen.nl/)
[<button>![icon](../logos/tech/lighthouse.png) Lighthouse audit</button>](/projects/whoami/lighthouse.html)

---
