const poke_container = document.getElementById("poke_container");
const url = "https://pokeapi.co/api/v2/pokemon";
const pokemons_number = 151;
const search = document.getElementById("search");
const form = document.getElementById("form");

let pokemons = [];

const removePokemon = () => {
    const pokemonELs = document.getElementsByClassName("pokemon");
    let removablePokemons = [];
    for (let i = 0; i < pokemonELs.length; i++) {
        const pokemonEL = pokemonELs[i];
        removablePokemons = [...removablePokemons, pokemonEL];
    }
    removablePokemons.forEach((remPoke) => remPoke.remove());
};

const getPokemon = async (id) => {
    const searchPokemons = pokemons.filter((poke) => poke.name === id);
    removePokemon();
    displayPokemon(searchPokemons);
};

const getAllPokemon = async (id) => {
    const res = await fetch(`${url}/${id}`);
    const pokemon = await res.json();
    pokemons = [...pokemons, {
        name: pokemon.name,
        id: pokemon.id,
        image: pokemon.sprites.front_default,
        type: pokemon.types.map((type) => type.type.name).join(', ')
    }];
};

const fetchPokemon = () => {
    const promises = [];
    for (let i = 1; i <= 150; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then((res) => res.json()));
    }

    Promise.all(promises).then((results) => {
        const pokemon = results.map((data) => ({
            name: data.name,
            id: data.id,
            image: data.sprites.front_default,
            type: data.types.map((type) => type.type.name).join(', ')
        }));
        displayPokemon(pokemon);
    });
};

const displayPokemon = (pokemon) => {
    const pokemonHTMLString = pokemon
        .map(
            (pokeman) =>
            `
    <li class="pokemon">
        <div class="img-container">
            <img src="${pokeman.image}" alt="${pokeman.name}"/>
        </div>
        <div class="info">
            <span class="number">#${pokeman.id}</span>
            <h3 class="name">${pokeman.name}</h3>
            <small class="type">Type = ${pokeman.type}</small>
        </div>
    </li>
    `
        )
        .join('');
    poke_container.innerHTML = pokemonHTMLString;
};

const fetchPokemons = async () => {
    for (let i = 1; i <= pokemons_number; i++) {
        await getAllPokemon(i);
    }
    fetchPokemon();
};

fetchPokemons();

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchTerm = search.value; 
    if (searchTerm) {
        const searchResult = pokemons.find(pokemon => pokemon.name === searchTerm.toLowerCase());

        if (searchResult) {
            const pokemonCardHTML = createPokemonCard(searchResult);
            poke_container.innerHTML = pokemonCardHTML;
        } else {
            poke_container.innerHTML = "<p>No matching Pokemon found.</p>";
        }

        search.value = "";
    }
});

function createPokemonCard(pokemon) {
    return `
        <div class="pokemon">
            <div class="img-container">
                <img src="${pokemon.image}" alt="${pokemon.name}"/>
            </div>
            <div class="info">
                <span class="number">#${pokemon.id}</span>
                <h3 class="name">${pokemon.name}</h3>
                <small class="type">Type = ${pokemon.type}</small>
            </div>
        </div>
    `;
}
