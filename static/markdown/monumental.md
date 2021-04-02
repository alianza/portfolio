# Monumental - Android

![homepage](../projects/monumental/monumental.png)



---

## Technologies

- Android Framework [![icon](../logos/tech/android.png)](https://developer.android.com/)
- Kotlin programming language [![icon](../logos/tech/kotlin.png)](https://kotlinlang.org/)

---

## Features

The application features a sleek design that is very responsive. It boasts a slide in/out menu that floats over the UI on mobile devices.
The application allows you to brows through pages of Pokémons on the homepage. Also you are able to browse pokémons by type and see a random Pokémon from the API.
Every Pokémon can be opened and viewed in detail with its detail page. There the Pokémon's profile, types and statistics are displayed.
From here you are also able to view other Pokémons from the same type(s).
On top of that every Pokémon can be _'Caught'_ from the detail page which when you do this will show up in the _'My Pokémons'_ list.

The Application is fully routed so deeplinking to any page is supported. The UI is fully responsive and all css is writtes in Sass.
_'Caught'_ Pokémons are saved in local storage so loading is fast and persistent. All API endpoints have separated interfaces, so the architecture is loosely coupled.
The biggest file is for styling, and the largest component is 173 lines of code.

---

## Screens

![flex screenshot](../projects/monumental/monumental_1.png)
![flex screenshot](../projects/monumental/monumental_2.png)
![flex screenshot](../projects/monumental/monumental_3.png)

---

## Used Techniques

- [MVVM](https://developer.android.com/jetpack/guide)
- [MVVM](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

## Code Snippets

```
  loadTypes = () => {
      Loader.showLoader();
      PokémonService.getTypes().then(json => {
      this.setState({jsonData: json});
      Loader.hideLoader();
    });
  }
```
