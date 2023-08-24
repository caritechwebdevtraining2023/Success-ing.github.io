const poke_container = document.getElementById("poke_container");
const pokedex = document.getElementById('pokedex');
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
    searchPokemons.forEach((pokemon) => createPokemonCard(pokemon));

    if (searchPokemons.length > 0) {
        const firstResult = document.querySelector(".pokemon");
        if (firstResult) {
            firstResult.scrollIntoView({ behavior: "smooth" });
        }
    }
};

const getAllPokemon = async (id) => {
    const res = await fetch(`${url}/${id}`);
    const pokemon = await res.json();
    pokemons = [...pokemons, pokemon];
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
            image: data.sprites['front_default'],
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
            <small class="type">${pokeman.type}</small>
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
    fetchPokemon(); // Call fetchPokemon once all Pokémon data is loaded
};

fetchPokemons();

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = search.value;
    if (searchTerm) {
        getPokemon(searchTerm);
        search.value = "";
    } else if (searchTerm === "") {
        pokemons = [];
        removePokemon();
        fetchPokemons();
    }
});