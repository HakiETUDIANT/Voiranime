function cleanTitle(title) {
    return title
        .replace(/&#8217;/g, "'")  
        .replace(/&#8211;/g, "-")  
        .replace(/&#[0-9]+;/g, ""); 
}

function searchResults(html) {
    const results = [];
    const baseUrl = "https://franime.fr/";

    // Utilisation d'une expression régulière pour extraire les éléments d'anime sur la page de recherche
    const filmListRegex = /<div class="post-item"[\s\S]*?<\/div>/g;
    const items = html.match(filmListRegex) || [];

    items.forEach((itemHtml) => {
        const titleMatch = itemHtml.match(/<a class="title" href="([^"]+)">([^<]+)<\/a>/);
        const href = titleMatch ? titleMatch[1] : '';
        let title = titleMatch ? titleMatch[2] : '';  
        title = cleanTitle(title);
        const imgMatch = itemHtml.match(/<img[^>]*class="lazy"[^>]*src="([^"]+)"[^>]*>/);
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

    const descriptionMatch = html.match(/<div class="description">([\s\S]*?)<\/div>/);
    let description = descriptionMatch ? descriptionMatch[1].trim() : '';

    const aliasesMatch = html.match(/<div class="synonyms">([\s\S]*?)<\/div>/);
    let aliases = aliasesMatch ? aliasesMatch[1].trim() : 'N/A';

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

    const episodeLinks = html.match(/<a class="episode-link"[^>]*href="([^"]+)"[\s\S]*?<div class="episode-number">(\d+)<\/div>/g);

    if (!episodeLinks) {
        return episodes;
    }

    episodeLinks.forEach(link => {
        const hrefMatch = link.match(/href="([^"]+)"/);
        const numberMatch = link.match(/<div class="episode-number">(\d+)<\/div>/);

        if (hrefMatch && numberMatch) {
            let href = hrefMatch[1];
            const number = numberMatch[1];

            if (!href.startsWith("https")) {
                href = href.startsWith("/") ? baseUrl + href.slice(1) : baseUrl + href;
            }

            episodes.push({
                href: href,
                number: number
            });
        }
    });
    episodes.reverse();
    return episodes;
}

function extractStreamUrl(html) {
    const sourceRegex = /<source[^>]+src="([^"]+)"/;
    const match = html.match(sourceRegex);
    return match ? match[1] : null;
}
