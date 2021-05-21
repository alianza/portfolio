# PokéDex - React

![homepage](../projects/pokedexreact/pokedexreact.webp)

As you know by now I like to experiment with the [*PokéApi*](https://pokeapi.co/). This project is the third Pokémon related application I have built.
This time built using the [*ReactJS*](https://reactjs.org/) web framework. This was my first ever *ReactJS* application I have created.
I have developed the application by myself over the span of a few days. After that I kept tweaking and adding some more features to it off and on for a couple more months.
The goal of this project was to teach myself the workings of the *ReactJS* framework.

---

## Technologies & Frameworks

- ReactJS [![icon](../logos/tech/react.png)](https://reactjs.org/)
- React-Router [![icon](../logos/tech/react-router.png)](https://reactrouter.com/)
- Sass [![icon](../logos/tech/sass.png)](https://sass-lang.com/)

---

## Features

The application features a sleek design that is very responsive. It boasts a slide in/out menu that floats over the UI on mobile devices.
The application allows you to brows through pages of Pokémons on the homepage. Also you are able to browse pokémons by type and see a random Pokémon from the API.
Every Pokémon can be opened and viewed in detail with its detail page. There the Pokémon's profile, types and statistics are displayed.
From here you are also able to view other Pokémons from the same type(s).
On top of that every Pokémon can be _'Caught'_ from the detail page which when you do this will show up in the _'My Pokémons'_ list.

The Application is fully routed so deeplinking to any page is supported. The UI is fully responsive and all css is written in Sass.
_'Caught'_ Pokémons are saved in local storage so loading is fast and persistent. All API endpoints have separated interfaces, so the architecture is loosely coupled.
The biggest file is for styling, and the largest component is 173 lines of code.

---

## Screens

![flex screenshot](../projects/pokedexreact/pokedexreact_1.webp)
![flex screenshot](../projects/pokedexreact/pokedexreact_2.webp)

---

## Techniques & Libraries

- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [react-router-transition](https://github.com/maisano/react-router-transition)
- [NodeJS](https://nodejs.org/)
- [JSON](https://json.org/)

---

<details>
  <summary>Code Snippets</summary>
<div>
The following are some code snippets of pieces of code I'm proud of from this project. The snippets demonstrate clean, consice and powerful code.

**Retrieving Pokémon types**\
Retrieving remote Pokémon types from the _PokéApi_ using the PokémonService interface and assigning it to the current state.
```
  loadTypes = () => {
      Loader.showLoader();
      PokémonService.getTypes().then(json => {
      this.setState({jsonData: json});
      Loader.hideLoader();
    });
  }
```

**Catch Service**\
Create, read and destroy interface for the LocalStorage API with support for Json Objects. (Used for the _'Caught'_ Pokémon functionality)
```
const CatchService = {
    add(pokémon)  { // Add to the array and save in local storage
        let pokémons = this.getAll() || []; // Retrieve all
        pokémons.unshift(pokémon); // Add pokémon to beginning of array
        localStorage.setItem('pokémons', JSON.stringify(pokémons)); // Save in local storage
    },

    remove(pokémonName)  { // Remove from the array and save in local storage
        let pokémons = this.getAll() || []; // Retrieve all
        pokémons.forEach(function (pokémon, index) { // Iterate though all
            if (pokémon.name === pokémonName) { pokémons.splice(index, 1); } // Compare names, if match remove it
        });
        localStorage.setItem('pokémons', JSON.stringify(pokémons)); // Save in local storage
    },

    get(pokémonName) { // Get array and find specific pokémon based on name
        let pokémons = this.getAll() || []; // Retrieve all
        pokémons.forEach(function (pokémon) { // Iterate though all
            if (pokémon.name === pokémonName) { return pokémon; } // Compare name, if match return it
        });
    },

    getAll() { // Get the entire array of pokémon and parse it
        return JSON.parse(localStorage.getItem('pokémons')); // Retrieve all
    }
}
```
</div>
</details>

---

## Check out the project

[<button>![icon](../logos/tech/github.png) Github</button>](https://github.com/alianza/pokedex_react)
[<button>Visit Site</button>](https://pokedexreact.jwvbremen.nl/)

---
