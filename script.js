const formulario = document.querySelector("#form-busca");
const campoNome = document.querySelector("#nome-pokemon");
const resultado = document.querySelector("#resultado");

async function buscarPokemon(nome) {
  const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);

  if (!resposta.ok) {
    throw new Error("Pokémon não encontrado. Confira o nome ou número.");
  }

  return resposta.json();
}

function mostrarMensagem(texto) {
  resultado.innerHTML = `<p>${texto}</p>`;
}

function mostrarCarta(pokemon) {
  const nomePokemon = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const tipos = pokemon.types.map((item) => {
    return `<span>${item.type.name}</span>`;
  }).join(" ");

  const nomesAtributos = {
    hp: "HP",
    attack: "Ataque",
    defense: "Defesa",
    speed: "Velocidade"
  };

  const atributos = ["hp", "attack", "defense", "speed"].map((nome) => {
    const atributo = pokemon.stats.find((item) => item.stat.name === nome);

    return `
      <li>
        <div class="atributo-nome">
          <span>${nomesAtributos[nome]}</span>
          <span>${atributo.base_stat}</span>
        </div>
        <div class="fundo-barra">
          <div class="barra" style="width: ${atributo.base_stat / 255 * 100}%"></div>
        </div>
      </li>
    `;
  }).join("");

  const imagem = pokemon.sprites.other["official-artwork"].front_default
    || pokemon.sprites.front_default;

  resultado.innerHTML = `
    <p>#${pokemon.id} ${nomePokemon}</p>
    <img class="imagem" src="${imagem}" alt="Imagem de ${nomePokemon}">
    <div class="tipos">${tipos}</div>
    <div class="medidas">
      <p>Altura: ${(pokemon.height / 10).toFixed(1)} m</p>
      <p>Peso: ${(pokemon.weight / 10).toFixed(1)} kg</p>
    </div>
    <h3>Atributos</h3>
    <ul class="lista-atributos">${atributos}</ul>
  `;
}

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const nome = campoNome.value.trim().toLowerCase();

  if (!nome) {
    mostrarMensagem("Digite o nome ou número de um Pokémon.");
    campoNome.focus();
    return;
  }

  mostrarMensagem("Carregando...");

  try {
    const pokemon = await buscarPokemon(nome);
    mostrarCarta(pokemon);
  } catch (erro) {
    if (erro.name === "TypeError") {
      mostrarMensagem("Falha na conexão. Tente novamente.");
    } else {
      mostrarMensagem(erro.message);
    }
  }

  campoNome.focus();
});