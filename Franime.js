function searchResults(html) {
    const results = [];
    
    // Mise à jour du regex pour capturer les <a> avec les liens et titres d'anime
    const searchResultsRegex = /<a href="([^"]+)"[^>]*class=".*?">([\s\S]*?)<\/a>/g; 
    const items = html.match(searchResultsRegex) || [];

    items.forEach((itemHtml, index) => {
        // Extraire l'URL et le titre depuis le lien <a>
        const hrefMatch = itemHtml.match(/href="([^"]+)"/);
        const titleMatch = itemHtml.match(/>(.*?)<\/a>/);

        const href = hrefMatch ? hrefMatch[1] : '';
        const title = titleMatch ? titleMatch[1].trim() : '';

        if (title && href) {
            results.push({
                title: title,
                href: href
            });
        }
    });

    return results;
}

function extractDetails(html) {
    const details = [];
    
    // Extraire la description de l'anime
    const descriptionMatch = html.match(/<div class="description">([\s\S]*?)<\/div>/);
    let description = descriptionMatch ? descriptionMatch[1].trim() : 'N/A';

    // Extraire le titre alternatif
    const aliasesMatch = html.match(/<h1 class="anime-title">([\s\S]*?)<\/h1>/);
    let aliases = aliasesMatch ? aliasesMatch[1].trim() : 'N/A';

    // Extraire la date de diffusion
    const airdateMatch = html.match(/<div class="airdate">[\s\S]*?(\d{4})[\s\S]*?<\/div>/);
    let airdate = airdateMatch ? airdateMatch[1] : 'N/A';

    details.push({
        description: description,
        aliases: aliases,
        airdate: airdate
    });

    return details;
}

function extractEpisodes(html) {
    const episodes = [];
    
    // Regex pour extraire les épisodes de l'HTML
    const episodeLinks = html.match(/<a href="([^"]+)"[^>]*class="episode-link">[\s\S]*?<div class="episode-number">(\d+)<\/div>/g);
    
    episodeLinks.forEach(link => {
        const hrefMatch = link.match(/href="([^"]+)"/);
        const numberMatch = link.match(/<div class="episode-number">(\d+)<\/div>/);

        const href = hrefMatch ? hrefMatch[1] : '';
        const number = numberMatch ? numberMatch[1] : '';

        if (href && number) {
            episodes.push({
                href: href,
                number: number
            });
        }
    });

    return episodes.reverse();
}

function extractStreamUrl(html) {
    const streamUrlMatch = html.match(/<source[^>]+src="([^"]+)"/);
    return streamUrlMatch ? streamUrlMatch[1] : null;
}