function generatePokemonCardHTML(pokemonData, totalPokemonDisplayed) {    
    const types = pokemonData.types.map(typeInfo => typeInfo.type.name);      
    const typeElements = types.map(type => `<span class="pokemon-type">${type}</span>`).join(' ');
    return `
        <div class="pokemon-number">#${totalPokemonDisplayed}</div>
        <div class="mini-card" data-id="${pokemonData.id}" 
            onmouseenter="showBasicDetails(${pokemonData.id})" 
            onmouseleave="hideBasicDetails(${pokemonData.id})" 
            onclick="showPokemonDetails(${pokemonData.id})">
            <div class="pokemon-details" id="pokemon-details-${pokemonData.id}" style="display:none;"></div>
            <div class="card-image-background">
                <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
            </div>
            <h3>${pokemonData.name}</h3>
            <div class="pokemon-types">${typeElements}</div> <!-- Display Pokémon types here -->
        </div>
    `;
}

function generateshowBasicDetails(pokemonData){
    return`
      <div class="pokemon-basic-details">
                    <p>Height: ${pokemonData.height}</p>
                    <p>Weight: ${pokemonData.weight}</p>
                    <p>Base Experience: ${pokemonData.base_experience}</p>
                </div>

    `;
}
function hideBasicDetails(pokemonId) {
    const detailsDiv = document.getElementById(`pokemon-details-${pokemonId}`);
    detailsDiv.style.display = 'none';
}
function generateShowPokemonDetails(pokemonData,pokemonId){
    return `
    <div class="overlay-content">
            <span class="arrow right-arrow" id="arrows" onclick="showNextPokemon()">&#10095;</span>
            <span class="arrow left-arrow" id="arrows" onclick="showPreviousPokemon()">&#10094;</span>            
            <h2>#${pokemonId} ${pokemonData.name}</h2>
            <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
            <p>Height: ${pokemonData.height}</p>
            <p>Weight: ${pokemonData.weight}</p>
            <p>Base Experience: ${pokemonData.base_experience}</p>
            <p>Abilities: ${pokemonData.abilities.map(ability => ability.ability.name).join(', ')}</p>
            <button onclick="showDamageRelations(${pokemonId})">Damage Relations</button>
            <button onclick="showEvolutionChain(${pokemonId})">Evolution Chain</button>
            
        </div>
    `;
}
function generateUpdatedOverlayContent(pokemonData) {
    return `
        <span class="arrow right-arrow" id="arrows" onclick="showNextPokemon()">&#10095;</span>
        <span class="arrow left-arrow" id="arrows" onclick="showPreviousPokemon()">&#10094;</span>
        <h2>#${pokemonData.id} ${pokemonData.name}</h2>
        <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
        <p>Height: ${pokemonData.height}</p>
        <p>Weight: ${pokemonData.weight}</p>
        <p>Base Experience: ${pokemonData.base_experience}</p>
        <p>Abilities: ${pokemonData.abilities.map(ability => ability.ability.name).join(', ')}</p>
        <button id="butt" onclick="showDamageRelations(${pokemonData.id})">Damage Relations</button>
        <button id="evolution-button" onclick="showEvolutionChain(${pokemonData.id})">Evolution Chain</button>
         
        
    `;
}
// Function to format damage relations into readable lists
function formatDamageRelations(damageRelations) {
    return ` 
        <div class="damage-relations">
            <h4>Double Damage From:</h4>
            <p>${damageRelations.double_damage_from?.map(type => type.name).join(', ') || 'None'}</p>
            
            <h4>Half Damage From:</h4>
            <p>${damageRelations.half_damage_from?.map(type => type.name).join(', ') || 'None'}</p>
            
            <h4>No Damage From:</h4>
            <p>${damageRelations.no_damage_from?.map(type => type.name).join(', ') || 'None'}</p>

            <h4>Double Damage To:</h4>
            <p>${damageRelations.double_damage_to?.map(type => type.name).join(', ') || 'None'}</p>
            <h4>Half Damage To:</h4>
                    <p>${damageRelations.half_damage_to?.map(type => type.name).join(', ') || 'None'}</p>

                    <h4>No Damage To:</h4>
                    <p>${damageRelations.no_damage_to?.map(type => type.name).join(', ') || 'None'}</p>
                </div>
        </div>
    `;
}
function createDamageRelationsHTML(damageRelationsArray) {
    let damageRelationsHTML = '';
    for (let relations of damageRelationsArray) {
        damageRelationsHTML += formatDamageRelations(relations);
    }
    return damageRelationsHTML;
}

function renderDamageRelations(damageRelationsHTML) {
    const damageRelationsDiv = document.createElement('div');
    damageRelationsDiv.classList.add('damage-relations-container');
    damageRelationsDiv.innerHTML = `
        <h3>Damage Relations:</h3>
        ${damageRelationsHTML}
        <button id="butt" onclick="closeOverlay()">Close</button>
    `;

    const overlayContent = document.querySelector('.overlay-content');
    overlayContent.innerHTML = ''; // Clear previous content
    overlayContent.appendChild(damageRelationsDiv);
}
function getEvolutionChainTemplate(evolutions) {
    return `
        <h3>Evolution Chain:</h3>
        <div class="evolution-list">
            ${evolutions.map(pokemon => `
                <div class="evolution-item">
                    <img src="${pokemon.image}" alt="${pokemon.name}" style="width: 50px; height: 50px;">
                    <p>${pokemon.name}</p>
                </div>
            `).join(' ➔ ')}
        </div>
    `;
}
function disableScroll() {
    document.body.style.overflow = 'hidden'; // Disable scrolling
}

function enableScroll() {
    document.body.style.overflow = ''; // Enable scrolling
}
