function cleanTitle(title) {
    return title
        .replace(/&#8217;/g, "'")  
        .replace(/&#8211;/g, "-")  
        .replace(/&#[0-9]+;/g, ""); 
}

// Fonction pour extraire les résultats de recherche
function searchResults(html) {
    const results = [];
    const regex = /<div class="anime-item">[\s\S]*?<a href="([^"]+)">[\s\S]*?<h3>([^<]+)<\/h3>/g;
    let match;

    while ((match = regex.exec(html)) !== null) {
        const href = match[1]; // L'URL de l'anime
        const title = match[2]; // Le titre de l'anime
        results.push({
            title: cleanTitle(title).trim(),
            href: "https://franime.fr" + href.trim() // Ajouter le domaine principal pour que le lien soit complet
        });
    }

    return results;
}

// Fonction pour extraire les détails de l'anime
function extractDetails(html) {
    const details = [];

    const descriptionMatch = html.match(/<div class="infodes2 entry-content entry-content-single" itemprop="description">[\s\S]*?<p>([\s\S]*?)<\/p>/);
    let description = descriptionMatch ? descriptionMatch[1] : '';

    const aliasesMatch = html.match(/<h1 class="entry-title" itemprop="name"[^>]*>([^<]+)<\/h1>/);
    let aliases = aliasesMatch ? aliasesMatch[1] : '';

    const airdateMatch = html.match(/<div class="textd">Year:<\/div>\s*<div class="textc">([^<]+)<\/div>/);
    let airdate = airdateMatch ? airdateMatch[1] : '';

    details.push({
        description: description || 'No description available.',
        aliases: aliases || 'N/A',
        airdate: airdate || 'Unknown'
    });

    return details;
}

// Fonction pour extraire les épisodes d'une série
function extractEpisodes(html) {
    const episodes = [];
    const baseUrl = "https://franime.fr/";

    const episodeLinks = html.match(/<a class="infovan"[^>]*href="([^"]+)"[\s\S]*?<div class="centerv">(\d+)<\/div>/g);
    
    if (!episodeLinks) {
        return episodes;
    }

    episodeLinks.forEach(link => {
        const hrefMatch = link.match(/href="([^"]+)"/);
        const numberMatch = link.match(/<div class="centerv">(\d+)<\/div>/);

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

// Fonction pour extraire l'URL de stream
function extractStreamUrl(html) {
    const sourceRegex = /<source[^>]+id="iframevideo"[^>]+src="([^"]+)"/;
    const match = html.match(sourceRegex);
    return match ? match[1] : null;
}