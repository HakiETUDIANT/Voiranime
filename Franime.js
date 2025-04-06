function cleanTitle(title) {
    return title
        .replace(/&#8217;/g, "'")  
        .replace(/&#8211;/g, "-")  
        .replace(/&#[0-9]+;/g, ""); 
}

function searchResults(html) {
    const results = [];
    const baseUrl = "https://franime.fr/";

    // Expression régulière pour extraire les cartes d'anime sur la page de recherche
    const filmListRegex = /<div class="anime-card">[\s\S]*?<\/div>/g;
    const items = html.match(filmListRegex) || [];

    items.forEach((itemHtml) => {
        // Extraire le titre et l'URL de l'anime
        const titleMatch = itemHtml.match(/<a class="post-title" href="([^"]+)">([^<]+)<\/a>/);
        const href = titleMatch ? titleMatch[1] : '';
        let title = titleMatch ? titleMatch[2] : '';  
        title = cleanTitle(title);

        // Extraire l'image de couverture
        const imgMatch = itemHtml.match(/<img[^>]*class="lazyload"[^>]*data-src="([^"]+)"[^>]*>/);
        const imageUrl = imgMatch ? imgMatch[1] : '';

        if (title && href) {
            results.push({
                title: title.trim(),
                image: imageUrl.trim(),
                href: href.trim()
            });
        }
    });

    return results;
}

function extractDetails(html) {
    const details = [];

    // Extraire la description
    const descriptionMatch = html.match(/<div class="description">([\s\S]*?)<\/div>/);
    let description = descriptionMatch ? descriptionMatch[1].trim() : '';

    // Extraire les synonymes (alias)
    const aliasesMatch = html.match(/<div class="synonyms">([\s\S]*?)<\/div>/);
    let aliases = aliasesMatch ? aliasesMatch[1].trim() : 'N/A';

    // Extraire l'année de diffusion (saison)
    const airdateMatch = html.match(/<div class="season">Saison: ([\s\S]*?)<\/div>/);
    let airdate = airdateMatch ? airdateMatch[1].trim() : 'N/A';

    if (description && airdate) {
        details.push({
            description: description,
            aliases: aliases || 'N/A',
            airdate: airdate
        });
    }

    return details;
}

function extractEpisodes(html) {
    const episodes = [];
    const baseUrl = "https://franime.fr/";

    // Expression régulière pour extraire les liens des épisodes
    const episodeLinks = html.match(/<a class="episode-link"[^>]*href="([^"]+)"[^>]*>\s*<div class="episode-number">(\d+)<\/div>/g);

    if (!episodeLinks) {
        return episodes;
    }

    episodeLinks.forEach(link => {
        const hrefMatch = link.match(/href="([^"]+)"/);
        const numberMatch = link.match(/<div class="episode-number">(\d+)<\/div>/);

        if (hrefMatch && numberMatch) {
            let href = hrefMatch[1];
            const number = numberMatch[1];

            // Construction de l'URL complète pour chaque épisode
            if (!href.startsWith("https")) {
                href = href.startsWith("/") ? baseUrl + href.slice(1) : baseUrl + href;
            }

            episodes.push({
                href: href,
                number: number
            });
        }
    });

    // Tri des épisodes dans l'ordre croissant
    episodes.reverse();
    return episodes;
}

function extractStreamUrl(html) {
    // Extraire le lien de la vidéo depuis la page de l'épisode
    const sourceRegex = /<source[^>]+src="([^"]+)"/;
    const match = html.match(sourceRegex);
    return match ? match[1] : null;
}