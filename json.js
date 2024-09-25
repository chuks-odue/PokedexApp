const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
let LIMIT = 20; 
let offset = 0;
let loading = false; 
let pokemons = []; 
let activePokemon = null; 
let totalPokemonDisplayed = 0;
let activePokemonIndex = null;
let typeColors = {
    normal: '#A8A77A', 
    fire: '#EE8130',   
    water: '#6390F0',    
    electric: '#F7D02C', 
    grass: '#7AC74C',    
    ice: '#96D9D6',      // Ice
    fighting: '#C22E28', // Fighting
    poison: '#A33EA1',   // Poison
    ground: '#E2BF65',   // Ground
    flying: '#A98FF3',   // Flying
    psychic: '#F95587',  // Psychic
    bug: '#A6B91A',      // Bug
    rock: '#B6A136',     // Rock
    ghost: '#735797',    // Ghost
    dragon: '#6F35FC',   // Dragon
    dark: '#705746',     // Dark
    steel: '#B7B7CE',    // Steel
    fairy: '#D685AD'     // Fairy
};
