const routes = {
  champions: "http://sdw24.sa-east-1.elasticbeanstalk.com/champions",
  ask: "http://sdw24.sa-east-1.elasticbeanstalk.com/champions/{id}/ask"
};

const apiService = {
  async getChampions () {
    const route = routes.champions  ;
    const respose = await fetch(route);
    return await respose.json();
  },
  async postAskChampion(id, message) {
    const route = routes.ask.replace("{id}", id);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question: message
      })
    };

    const response = await fetch(route, options);
    return await response.json();
  }
};

const state = {
  values: {
    champions: [],
  },
  views: {
    fade: document.querySelector("#fade"),
    closeModalButton: document.querySelector("#modal__button-exit"),
    modal: document.querySelector("#modal"),
    avatar: document.querySelector(".modal-header__avatar__image"),
    response: document.querySelector(".response"),
    question: document.querySelector("#question"),
    carousel: document.querySelector(".champions__list"),
    championQuote: document.querySelector("#champion-quote")
  }
}

async function main() {
  
  [state.views.closeModalButton, state.views.fade].forEach((el) => {
    el.addEventListener("click", () => {
      state.views.fade.classList.toggle("hide");
      state.views.modal.classList.toggle("hide");
      state.views.response.textContent = "";
      state.views.question.value = "";
    });
  });

  await loadChampions();
  await renderChampions();
}

async function loadChampions() {
  const data = await apiService.getChampions();
  state.values.champions = data;
}

async function renderChampions() {
  const championsData = state.values.champions;
  const elements = championsData.map(
    (champion) => 
        `<li class="champion" 
          onclick="openModal(${champion.id}, '${champion.imageUrl}')"
        >
        <img class="champion_asset" src="${champion.imageUrl}" alt="">
        <div>
            <div class="champion_name_role">
                <span class="champion_name">${champion.name}</span> - 
                <span class="champion_role">${champion.role}</span>
            </div>
            <p class="champion_lore">${champion.lore}</p>
        </div>
    </li>`
  );
  state.views.carousel.innerHTML = elements.join(" ");
}

async function openModal(id, imageUrl) {
  state.views.modal.classList.toggle("hide");
  state.views.fade.classList.toggle("hide");
  state.views.avatar.style.backgroundImage = `url(${imageUrl})`;
  state.views.avatar.dataset.id = id;
  state.views.championQuote.textContent = await getRandomQuote();
}

async function getRandomQuote() {
  const quotes = [
    "Manda ver meu nobre",
    "Pode vir quente que eu to fervendo",
    "Aguardo sua pergunta",
    "Espero anciosamente pela sua pergunta",
    "Estou começando a ficar com tédio ...",
    "Tenho vidas a salvar, vá depressa com isso",
    "Não vai ficar ai o dia todo vai ?",
    "Talvez seja melhor ir jogar Dota ...",
    "Ainda to tentando entender como essa giringonça funciona",
    "Vamo que vamo meu chapa",
  ]
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

async function fetchAskChampion() {
  document.body.style.cursor = "wait";
  const id = state.views.avatar.dataset.id;
  const message = state.views.question.value;
  const response = await apiService.postAskChampion(id, message);
  state.views.response.textContent = response.answer;
  state.views.response.style.display = 'block'; 
  document.body.style.cursor = "default";
}

main();
