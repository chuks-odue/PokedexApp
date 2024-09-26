function init() {
    getPokemonData(); 
}
async function getPokemonData() {
    if (loading) return; 
         loading=true;showSpinner();
    try {const response = await fetch(`${BASE_URL}?offset=${offset}&limit=${LIMIT}`);
         const data = await response.json();         
         await delay(3000);hideSpinner();
        pokemons = [...pokemons, ...data.results]; 
        renderPokemons(data.results); 
        offset += LIMIT; 
    } catch (error) {console.error('Error loading Pokémon data:', error);
    } finally {
        loading = false; 
    }
}
function renderPokemons(pokemonArray) {
    pokemonArray.forEach(pokemon => {
        fetch(pokemon.url)
            .then(response => response.json())
            .then(pokemonData => {
                const pokemonDiv = createPokemonCard(pokemonData);
                document.getElementById('pokemon-container').appendChild(pokemonDiv);
            })
            .catch(error => console.error('Error fetching Pokémon details:', error));
    });
}
function createPokemonCard(pokemonData) {
    const pokemonDiv = document.createElement('div');
    pokemonDiv.classList.add('pokemon-card');
    totalPokemonDisplayed++;
    const types = pokemonData.types.map(typeInfo => typeInfo.type.name);
    let backgroundColor = '';    
    if (types.length === 1) {
       backgroundColor = typeColors[types[0]]; 
    } else if (types.length === 2) {
        const color1 = typeColors[types[0]];
        const color2 = typeColors[types[1]];
        backgroundColor = `linear-gradient(135deg, ${color1}, ${color2})`; 
    }pokemonDiv.innerHTML = generatePokemonCardHTML(pokemonData, totalPokemonDisplayed);    
    const miniCard = pokemonDiv.querySelector('.mini-card');
    miniCard.style.background = backgroundColor;
    return pokemonDiv;
}
function searchPokemon() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();    
    if (searchInput === '') {
        let LIMIT = 20; 
        offset = 0;
        pokemons = []; 
        document.getElementById('pokemon-container').innerHTML = ''; 
        getPokemonData(); 
        return;
    }
    const filteredPokemons = pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchInput));    
    document.getElementById('pokemon-container').innerHTML = '';    
    renderPokemons(filteredPokemons);
}
function showBasicDetails(pokemonId) {
    const detailsDiv = document.getElementById(`pokemon-details-${pokemonId}`);
    fetch(`${BASE_URL}/${pokemonId}`)
        .then(response => response.json())
        .then(pokemonData => {
            detailsDiv.innerHTML = generateshowBasicDetails(pokemonData);             
            detailsDiv.style.display = 'block';
        })
        .catch(error => console.error('Error fetching Pokémon details:', error));
}
async function showPokemonDetails(pokemonId) {    
    closeOverlay();
    activePokemonIndex = pokemons.findIndex(pokemon => pokemon.url.includes(pokemonId));
    const response = await fetch(`${BASE_URL}/${pokemonId}`);
    const pokemonData = await response.json();    
    const newBackdrop = document.createElement('div');
    newBackdrop.classList.add('modal-backdrop');
    newBackdrop.setAttribute('id', 'modal-backdrop');
    newBackdrop.onclick = closeOverlay;
    const newOverlayDiv = document.createElement('div');
    newOverlayDiv.classList.add('overlay-card', 'fade-in'); 
    newOverlayDiv.innerHTML = generateShowPokemonDetails(pokemonData,pokemonId); 
    newOverlayDiv.onclick = (event) => {
        event.stopPropagation();  };    
    document.body.appendChild(newBackdrop);
    document.body.appendChild(newOverlayDiv);        
    setTimeout(() => newOverlayDiv.classList.remove('fade-in'), 500);
}
function closeOverlay() {
    const overlay = document.querySelector('.overlay-card');
    const backdrop = document.getElementById('modal-backdrop');
    if (overlay) overlay.remove();
     if (backdrop) backdrop.remove();
     
     activePokemonIndex = null;     
}
async function fetchPokemonData(pokemonId) {
    const response = await fetch(`${BASE_URL}/${pokemonId}`);
    return await response.json();
}
async function showNextPokemon() {
    if (activePokemonIndex !== null) {
        if (activePokemonIndex < pokemons.length - 1) {        
            activePokemonIndex++;
        } else {            
            await getPokemonData();            
            if (activePokemonIndex >= pokemons.length) {
                activePokemonIndex = pokemons.length - 1;
            }
        }        
        const nextPokemonId = pokemons[activePokemonIndex].url.split("/").filter(Boolean).pop(); 
        await updateOverlayContent(nextPokemonId);
    }
}

async function showPreviousPokemon() {
    if (activePokemonIndex !== null && activePokemonIndex > 0) {        
        activePokemonIndex--;        
        const prevPokemonId = pokemons[activePokemonIndex].url.split("/").filter(Boolean).pop(); 
        await updateOverlayContent(prevPokemonId);
    }
}
async function updateOverlayContent(pokemonId) {
    const response = await fetch(`${BASE_URL}/${pokemonId}`);
    const pokemonData = await response.json();
    const overlayContent = document.querySelector('.overlay-content');
    overlayContent.innerHTML = generateUpdatedOverlayContent(pokemonData);
}
async function showDamageRelations(pokemonId) {
    try {
        const pokemonData = await fetchPokemonData(pokemonId);
        const damageRelationsArray = await fetchDamageRelationsForTypes(pokemonData.types);
        const damageRelationsHTML = createDamageRelationsHTML(damageRelationsArray);
        renderDamageRelations(damageRelationsHTML);
    } catch (error) {
        console.error('Error showing damage relations:', error);
    }
}
async function fetchPokemonData(pokemonId) {
    const response = await fetch(`${BASE_URL}/${pokemonId}`);
    const pokemonData = await response.json();
    if (!pokemonData.types || pokemonData.types.length === 0) {
        throw new Error("No types found for this Pokémon.");
    }
    return pokemonData;
}

async function fetchDamageRelationsForTypes(types) {
    const damageRelationsArray = [];
    for (let type of types) {
        const typeResponse = await fetch(type.type.url);
        const typeData = await typeResponse.json();
        damageRelationsArray.push(typeData.damage_relations);
    }
    return damageRelationsArray;
}
async function showEvolutionChain(pokemonId) {    
    try {
        const speciesData = await fetch(`${BASE_URL}-species/${pokemonId}`).then(res => res.json());
        const evolutionData = await fetch(speciesData.evolution_chain.url).then(res => res.json());       
        const evolutions = await getFormattedEvolutionChain(evolutionData.chain);
        const evolutionHTML = getEvolutionChainTemplate(evolutions);
        document.querySelector('.overlay-content').innerHTML += evolutionHTML;
    } catch (error) {
        console.error('Error fetching evolution chain:', error);
        const evolutionButton = document.querySelector('#evolution-button');
        if (evolutionButton) {
            evolutionButton.disabled = false;
            evolutionButton.innerHTML = "Show Evolution Chain";
        }
    }
}
async function getFormattedEvolutionChain(chain) {
    const evolutionList = [];
    let current = chain;
    while (current) {
        const speciesName = current.species.name;
        const pokemonData = await fetch(`${BASE_URL}/${speciesName}`).then(res => res.json());
        evolutionList.push({
            name: speciesName,
            image: pokemonData.sprites.front_default,
        });
        current = current.evolves_to[0]; 
    }
    return evolutionList; 
}




