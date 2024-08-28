const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 12
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-name="${pokemon.name}" data-details="Type: ${pokemon.types.join(', ')}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
        addClickEventToPokemons() 
    })
}

function addClickEventToPokemons() {
    document.querySelectorAll('.pokemon').forEach(card => {
        card.addEventListener('click', function () {
            const modal = document.getElementById('modal');
            const modalDetails = document.getElementById('modalDetails');
            
            // Remove todas as classes de tipo anteriores do modal
            modalDetails.className = 'pokemon modal-content';
            
            // Adiciona a classe do tipo do Pokémon ao modal
            const pokemonType = this.classList[1]; // Obtém o tipo do Pokémon
            modalDetails.classList.add(pokemonType);
            
            // Extrai os tipos diretamente dos elementos
            const types = Array.from(this.querySelectorAll('.type')).map(typeEl => typeEl.textContent);

            // Preenche o modal com as informações do card
            modalDetails.innerHTML = `
                
                <span class="number">${this.querySelector('.number').textContent}</span>
                <h2 class="name">${this.querySelector('.name').textContent}</h2>
                <img src="${this.querySelector('img').src}" alt="${this.querySelector('.name').textContent}">
                <ul class="types">
                    ${types.map(type => `<li class="type ${type.toLowerCase()}">${type}</li>`).join('')}
                </ul>
            `;

            

            modal.style.display = 'block'; // Mostra o modal
        });
    });
}



document.getElementById('closeModal').addEventListener('click', function () {
    document.getElementById('modal').style.display = 'none';
});

window.addEventListener('click', function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})
