// Fonction pour afficher les résultats dans le DOM
function displayResults(animeList) {
  const resultsContainer = document.getElementById('anime-results');
  resultsContainer.innerHTML = '';  // Vide les résultats précédents

  // Vérifier s'il y a des résultats
  if (animeList.length === 0) {
    resultsContainer.innerHTML = "<p>Aucun anime trouvé.</p>";
    return;
  }

  // Pour chaque anime de la liste, créer et ajouter un élément HTML
  animeList.forEach(anime => {
    const animeElement = document.createElement('div');
    animeElement.classList.add('anime-item');

    // Créer un titre
    const titleElement = document.createElement('h3');
    titleElement.textContent = anime.title;

    // Créer une description
    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = anime.description || "Pas de description disponible.";

    // Créer un lien vers la source
    const linkElement = document.createElement('a');
    linkElement.href = anime.source_url;
    linkElement.target = "_blank";
    linkElement.textContent = 'Voir plus';

    // Créer une image pour l'affiche de l'anime
    const imageElement = document.createElement('img');
    imageElement.src = anime.affiche;
    imageElement.alt = anime.title;
    imageElement.width = 150;  // Optionnel, ajuste la taille de l'image

    // Créer un élément pour la note
    const ratingElement = document.createElement('p');
    ratingElement.textContent = `Note: ${anime.note || "N/A"}`;

    // Ajouter tous les éléments à l'élément anime
    animeElement.appendChild(titleElement);
    animeElement.appendChild(descriptionElement);
    animeElement.appendChild(ratingElement);
    animeElement.appendChild(linkElement);
    animeElement.appendChild(imageElement);

    // Ajouter l'élément anime à la page
    resultsContainer.appendChild(animeElement);
  });
}

// Fonction pour effectuer une recherche d'anime
function searchAnime() {
  const query = document.getElementById('search-query').value.trim();  // Récupérer la requête de recherche

  if (!query) {
    alert("Veuillez entrer un terme de recherche.");
    return;
  }

  // URL de l'API de recherche, ajuste-la si nécessaire
  const apiUrl = `https://kitsu.app/api/edge/anime?filter[text]=${encodeURIComponent(query)}`;

  // Requête vers l'API pour obtenir les résultats
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const animeList = data.data || [];  // Assurez-vous que les données existent
      displayResults(animeList);
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des données:', error);
      alert('Une erreur est survenue. Veuillez réessayer plus tard.');
    });
}