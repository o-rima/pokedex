document.addEventListener("DOMContentLoaded", () => {
    const favoritesList = document.getElementById("favoritesList");
    const backToSearchButton = document.getElementById("backToSearchButton");
    let favoritePokemon = [];

    // ローカルストレージでお気に入りポケモンのリストを取得
    if (localStorage.getItem('favoritePokemon')) {
        favoritePokemon = JSON.parse(localStorage.getItem('favoritePokemon'));
    }

    // お気に入りポケモンを表示
    displayFavorites();

    backToSearchButton.addEventListener("click", () => {
        window.location.href = 'index.html'; // ポケモン検索ページに戻る
    });

    function displayFavorites() {
        const favoritesHTMLString = favoritePokemon.map(pokemon => `
            <li class="card">
                <img class="card-image" src="${pokemon.image}"/>
            </li>
        `).join('');
        favoritesList.innerHTML = favoritesHTMLString;
    }
});
