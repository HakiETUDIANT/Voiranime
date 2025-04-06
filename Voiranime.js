function cleanTitle(title) {
    return title
        .replace(/&#8217;/g, "'")
        .replace(/&#8211;/g, "-")
        .replace(/&#[0-9]+;/g, "");
}

function searchResults(html) {
    const results = [];
    const baseUrl = "https://franime.fr/";

    // Modification de l'expression régulière pour trouver les animes dans les résultats de recherche
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

    // Extraction de la description de l'anime
    const descriptionMatch = html.match(/<div class="post-content">([\s\S]*?)<\/div>/);
    let description = descriptionMatch ? descriptionMatch[1] : '';

    // Extraction des alias (si disponible)
    const aliasesMatch = html.match(/<h1 class="post-title" itemprop="name">([^<]+)<\/h1>/);
    let aliases = aliasesMatch ? aliasesMatch[1] : '';

    // Extraction de l'année de sortie
    const airdateMatch = html.match(/<div class="post-meta"><span>Année :<\/span>\s*([^<]+)<\/div>/);
    let airdate = airdateMatch ? airdateMatch[1] : '';

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

    // Extraction des épisodes
    const episodeLinks = html.match(/<a class="episode-link"[^>]*href="([^"]+)"/g);
    if (!episodeLinks) {
        return episodes;
    }

    episodeLinks.forEach(link => {
        const hrefMatch = link.match(/href="([^"]+)"/);

        if (hrefMatch) {
            let href = hrefMatch[1];
            if (!href.startsWith("https")) {
                href = href.startsWith("/") ? baseUrl + href.slice(1) : baseUrl + href;
            }

            episodes.push({
                href: href,
                number: episodes.length + 1
            });
        }
    });

    return episodes.reverse();
}

function extractStreamUrl(html) {
    const sourceRegex = /<source[^>]+src="([^"]+)"/;
    const match = html.match(sourceRegex);
    return match ? match[1] : null;
}