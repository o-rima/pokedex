document.addEventListener("DOMContentLoaded", () => {
    const pokedex = document.getElementById("pokedex");
    const searchBar = document.getElementById("searchBar");
    const favoriteButton = document.getElementById("favoriteButton");
    const favoritesListButton = document.getElementById("favoritesListButton");
    const backButton = document.getElementById("backButton");
    let allPokemon = [];
    let displayedPokemon = [];
    let favoritePokemon = [];

// ローカルストレージでお気に入りポケモンのリストを取得
if (localStorage.getItem('favoritePokemon')) {
    favoritePokemon = JSON.parse(localStorage.getItem('favoritePokemon'));
}

    searchBar.addEventListener("keyup", (e) => {
        const searchString = e.target.value.toLowerCase();
        const filteredPokemon = allPokemon.filter(pokemon => {
            return pokemon.name.toLowerCase().includes(searchString);
        });
        displayedPokemon = filteredPokemon;
        displayPokemon(filteredPokemon);
    });

    favoriteButton.addEventListener("click", () => {
        if (displayedPokemon.length > 0) {
            const favoritePokemonData = displayedPokemon[0]; // 最初のポケモンのデータを取得
            if (!favoritePokemon.some(pokemon => pokemon.id === favoritePokemonData.id)) {
                favoritePokemon.push(favoritePokemonData);
                localStorage.setItem('favoritePokemon', JSON.stringify(favoritePokemon));
                alert(`${favoritePokemonData.name} has been added to favorites!`);
            } else {
                alert(`${favoritePokemonData.name} is already in favorites.`);
            }
        }
    });

    favoritesListButton.addEventListener("click", () => {
        window.location.href = 'favorites.html'; // お気に入りリスト表示ページに遷移
    });

    // backButton.addEventListener("click", () => {
    //     searchBar.value = '';
    //     displayedPokemon = allPokemon;
    //     displayPokemon(allPokemon);
    // });

    const fetchPokemon = () => {
        const promises = [];
        for(let i = 1; i < 899; i++) {
            const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
            promises.push(
                fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    const speciesUrl = data.species.url;
                    return fetch(speciesUrl).then((res) => res.json()).then((speciesData) => {
                        const jpNameEntry = speciesData.names.find(name => name.language.name === 'ja');
                        const jpName = jpNameEntry ? jpNameEntry.name : data.name; 
                        return {
                            name: jpName,
                            id: data.id,
                            image: data.sprites['front_default'],
                            type: data.types.map((type) => type.type.name).join(', ') //日本語名に変換
                        };
                    });
                })
            );
        }

        Promise.all(promises).then(results => {
            allPokemon = results;
            displayedPokemon = allPokemon;
            displayPokemon(allPokemon);
        });
    };

    const displayPokemon = (pokemon) => {
        const pokemonHTMLString = pokemon.map(pokemon => `
            <li class="card">
                <img class="card-image" src="${pokemon.image}"/> 
                <h2 class="card-title">${pokemon.id}. ${pokemon.name}</h2>
            </li>
        `).join('');
        pokedex.innerHTML = pokemonHTMLString;
    };

    fetchPokemon();
});

// スクロールトップボタンをクリックした時の処理
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

