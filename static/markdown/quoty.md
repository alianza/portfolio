# Quoty Quotes Network - React

![homepage](../projects/quoty/quoty.webp)

As you know by now I like to experiment with different API's.
This time built using the [*ReactJS*](https://reactjs.org/) web framework.
The application has been created for the coding assignment for the Kabisa company.
The goal of this project was to improve my understanding of the workings of the *ReactJS* framework.

---

## Technologies & Frameworks

- ReactJS [![icon](../logos/tech/react.png)](https://reactjs.org/)
- React-Router [![icon](../logos/tech/react-router.png)](https://reactrouter.com/)
- Sass [![icon](../logos/tech/sass.png)](https://sass-lang.com/)
- Node.js [![icon](../logos/tech/nodejs.png)](https://www.nodejs.org/)
- Git(hub) [![icon](../logos/tech/github.png)](https://www.github.com/)
- Progressive Web Application [![icon](../logos/tech/pwa.png)](https://web.dev/progressive-web-apps/)
- Google Firebase [![icon](../logos/tech/firebase.png)](https://firebase.google.com/)
- Netlify [![icon](../logos/tech/netlify.png)](https://netlify.com/)

---

## Summary

The Quoty Quotes Network is a Progressive Web Application and social network aimed at sharing ratings on different Quotes.
The Quotes are retrieved from the [*StormConsultancy Quotes API*](http://quotes.stormconsultancy.co.uk/). The application allows
anonymous users to view (random) Quotes and see the average ratings from other users on it. They are also able to share Quotes
on different social media platforms. Data like (average) ratings on quotes are updated in realtime without having to refresh the page.
This is achieved with the [*Google Firebase Realtime Database*](https://firebase.google.com/docs/database) and the data Snapshots functionality.

Users that log-in using an email and password combination or via their Google account gain the ability to rate Quotes based on stars.
Logged-in users can also view their account information and previously rated Quotes. The application also has the ability to
listen to the theme settings of the target device to decide what theme to show to the user. The application has both a light 
and dark theme.

The application is fully responsive and installable as a Progressive Web Application. The data storage and authentication
is done using [*Google Firebase*](https://firebase.google.com/) Authentication and the Realtime Database. The application is
hosted using the [Netlify](https://netlify.com/) deployment platform. For performance optimization the application uses code splitting and lazy loads all pages using [`React.lazy()`](https://reactjs.org/docs/code-splitting.html).
To keep track of the current logged in user the application uses the `[React Context API`](https://reactjs.org/docs/context.html) as well.

---

## Screens

![flex screenshot](../projects/quoty/quoty_1.webp)
![flex screenshot](../projects/quoty/quoty_2.webp)
![flex screenshot](../projects/quoty/quoty_3.webp)
![flex screenshot](../projects/quoty/quoty_4.webp)
![flex screenshot](../projects/quoty/quoty_5.webp)

---

<details>
  <summary>Code Snippets</summary>
<div>

The following are some code snippets of pieces of code I'm proud of from this project. The snippets demonstrate clean, concise and powerful code. _(Code has been compacted)_

**App component**\
The App component is responsible for housing the application content, getting logged-in user information from Google Firebase
and showing the correct pages based on route. 

```
// Components
import Loader from "./components/Loader/Loader";
import Footer from "./components/Layout/Footer/Footer"
import Header from "./components/Layout/Header/Header"
import Menu from "./components/Layout/Menu/Menu"
import Loading from "./components/Loading/Loading"

// Lazy loaded pages
const Home = React.lazy(() => import("./components/Pages/Home/Home"))
const Quote = React.lazy(() => import("./components/Pages/Quote/Quote"))
const SignIn = React.lazy(() => import("./components/Pages/SignIn/SignIn"))
const MyQuotes = React.lazy(() => import("./components/Pages/MyQuotes/MyQuotes"))
const Popular = React.lazy(() => import("./components/Pages/Popular/Popular"))
const FourOhFour = React.lazy(() => import("./components/Pages/404/404"))
const About = React.lazy(() => import("./components/Pages/About/About"))

// Lazy loaded components
const LogoutDialog = React.lazy(() => import("./components/LogoutDialog/LogoutDialog"))

const darkThemeKey = 'darkTheme'

export const UserContext = React.createContext({})

function App() {
    const [open, setOpenLogoutDialog] = useState(false)
    const [darkTheme, setDarkTheme] = useState(localStorageService.getValue(darkThemeKey))
    const [user, setUser] = useState()
    const auth = getAuth()

    useEffect(() => { // Listen to the Firebase Auth state and set the local state.
        const unregisterAuthObserver = onAuthStateChanged(auth, user => { setUser(user) })
        return () => unregisterAuthObserver() // Make sure we un-register Firebase observers when the component unmounts.
    }, [auth])

    useTheme(darkTheme)

    useEventListeners()

    const toggleMenu = () => { document.getElementById("app").classList.toggle("menu-active") }

    const toggleTheme = () => { localStorageService.setKeyValue(darkThemeKey, !darkTheme); setDarkTheme(prevTheme => !prevTheme) }

    const logOut = () => {
        logout().then(() => {
            setOpenLogoutDialog(true)
                setTimeout(() => {
                    setOpenLogoutDialog(false)
                }, 1500)
            }
        )
    }

    return (
        <Router>
        <UserContext.Provider value={user}>
            <div id="app">
                <Header onMenuClick={toggleMenu} title={'Quoty'}/>

                <Menu logOut={logOut} onMenuClick={toggleMenu}/>

                <div className={'content'}>
                        <React.Suspense fallback={Loading()}>

                    <Switch>
                        <Route exact path={['/']} component={Home}/>

                        <Route exact path={['/quote/:quoteId']} component={Quote}/>

                        <Route exact path={['/quotes']} component={MyQuotes}/>

                        <Route exact path={['/popular']} component={Popular}/>

                        <Route exact path={['/login', '/profile']}><SignIn logOut={logOut}/></Route>

                        <Route exact path={['/about']} component={About}/>

                        <Route component={FourOhFour}/>
                    </Switch>

                        <LogoutDialog open={open}/>
                        </React.Suspense>
                </div>

                <Footer darkTheme={darkTheme} onThemeButtonClick={toggleTheme}/>

                <Loader/>

            </div>
        </UserContext.Provider>
        </Router>
    )
}
```

**QuoteCard component**\
This code snippet demonstrates the QuoteCard component. It takes a Quote as props to present in the DOM towards the user.
The Quote card also facilitates functionality like sharing via social media, visiting the permalink of the quote, getting
information about the ratings on a particular quote and lastly when logged in rating a quote yourself.

```
function QuoteCard(props) {
    const [rating, setRating] = useState({ rating: 0, timestamp: null })
    const [averageRating, setAverageRating] = useState(0)
    const [numberOfRatings, setNumberOfRatings] = useState(0)
    const [anchorEl, setAnchorEl] = useState(null)
    const shareUrl = `https://${window.location.host}/quote/${props.quote.id}`

    const location = useLocation()

    const user = useContext(UserContext)

    const openShareMenu = (event) => { setAnchorEl(event.currentTarget) }

    const closeShareMenu = () => { setAnchorEl(null) }

    useEffect(() => { // Initial data fetch
        setRating(0) // Reset rating every time
        getQuoteRatings(props.quote, user, setRating, setAverageRating, setNumberOfRatings)
    }, [props.quote, user] )

    const createRating = (rating) => {
        setRating(rating)
        if (rating) { addRating(rating, props.quote.id, user.uid) // Update rating
        } else { removeRating(props.quote.id, user.uid) } // Remove rating
    }

    return (
        <blockquote className="quoteCard">
            <p className="quote">❝ {props.quote.quote}❞</p>
            <div className="info">
                <cite className="author">
                    {props.quote.author}<RecordVoiceOverIcon style={{marginLeft: '6px'}} fontSize={"small"}/>
                </cite>
                <button className="link" onClick={openShareMenu}>Share<ShareIcon style={{marginLeft: '6px'}} fontSize={"small"}/></button>
                {!location.pathname.includes('/quote/') && <NavLink to={`/quote/${props.quote.id}`}>permalink<LinkIcon style={{marginLeft: '6px'}} fontSize={"small"}/></NavLink>}
            </div>
                <div data-tip={!user ? 'Log in to vote!' : 'Your rating!'} className="rating tooltip">
                    {rating?.timestamp && <center className="ratingDate">Rated on: <b>{new Date(rating?.timestamp).toLocaleString(getLanguage())}</b></center>}
                    {!!user && <StarRating quoteId={props.quote.id} value={rating?.rating} onChange={(event, newValue) => { createRating(newValue) }}/>}
                    <div className="averageRating">Average rating: <span className="ratingValue">{Math.round(averageRating * 100) / 100 || 'Not yet rated'}</span>
                    {!!averageRating && <span className="ratingAmount">Based on {numberOfRatings} vote{numberOfRatings > 1 && 's'}!</span>}
                    </div>
                </div>
            <ShareMenu anchorEl={anchorEl} onClose={closeShareMenu} urlToShare={shareUrl} quote={props.quote}/>
        </blockquote>
    )
}
```
          
**QuoteService.js**\
This code snippet demonstrates the QuoteService JavaScript file. It is responsible for all communication with the StormConsultancy Quotes API like retrieving popular or particular Quotes using the fetch API. The Quotes API is not SSL protected so it is redirected to '/api' in production and redirected using Netlify redirects defined in the 'netlify.toml' file (See snippet below).
          
```
[[redirects]]
from = "/api/*"
to = "http://quotes.stormconsultancy.co.uk/:splat"
status = 200
force = true
```

```
const QuoteService = {
    baseUrlProd: "/api", // Redirected to http://quotes.stormconsultancy.co.uk/:splat by netlify according to netlify.toml file
    baseUrlDev: "http://quotes.stormconsultancy.co.uk",
    baseUrl: '',

    doLoad(url) { // Base method for doing http Get requests
        if (!this.baseUrl) {
            this.baseUrl = window.location.hostname === "localhost" ||
                           window.location.hostname === "127.0.0.1" ||
                           window.location.hostname.includes('192.168.')
                           ? this.baseUrlDev : this.baseUrlProd }

        if (!url.includes(this.baseUrl)) { url = this.baseUrl + url }

        // console.log(url)
        return fetch(url).then(response => {
            if (response.status === 404) { return '' }
            if (response.status === 200) { return response.json() }})
            .then(data => {
                // console.log(data)
                return data}).catch(e => { console.log('Error', e) })
    },

    getQuotes() {
        return this.doLoad('/quotes.json').then(jsonData => {
            return jsonData
        }).catch(e => { console.log('Error', e) })
    },

    getPopularQuotes() {
        return this.doLoad('/popular.json').then(jsonData => {
            return jsonData
        }).catch(e => { console.log('Error', e) })
    },

    getQuote(quoteId) {
        return this.doLoad(`/quotes/${quoteId}.json`).then(jsonData => {
            return jsonData
        }).catch(e => { console.log('Error', e) })
    },

    getRandomQuote() {
        return this.doLoad("/random.json").then(jsonData => {
            return jsonData
        }).catch(e => { console.log('Error', e) })
    },
}

export default QuoteService;
```

</div>
</details>

---

## Check out the project

[<button>![icon](../logos/tech/github.png) Github</button>](https://github.com/alianza/quoty-quotes-network)
[<button>![icon](../projects/quoty/quoty.webp) Visit Site</button>](https://quotes.jwvbremen.nl/)

---
