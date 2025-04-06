function cleanTitle(title) {
    return title
        .replace(/&#8217;/g, "'")  
        .replace(/&#8211;/g, "-")  
        .replace(/&#[0-9]+;/g, "") 
        .trim();
}

function searchResults(html) {
    const results = [];
    const items = html.match(/<div class="animation-2 items.*?<\/div>\s*<\/div>/gs) || [];

    items.forEach((item) => {
        const titleMatch = item.match(/<h2><a[^>]*>(.*?)<\/a><\/h2>/);
        const hrefMatch = item.match(/<a href="(https:\/\/v6\.voiranime\.com\/[^"]+)"/);
        const imageMatch = item.match(/<img[^>]+src="([^"]+)"[^>]*>/);

        if (titleMatch && hrefMatch && imageMatch) {
            results.push({
                title: cleanTitle(titleMatch[1]),
                href: hrefMatch[1],
                image: imageMatch[1]
            });
        }
    });

    return results;
}

function extractDetails(html) {
    const descriptionMatch = html.match(/<p style="text-align: justify;">(.*?)<\/p>/);
    const aliasesMatch = html.match(/Alias(?:es)?:<\/strong>\s*([^<]+)/);
    const airdateMatch = html.match(/Année:\s*<\/strong>\s*(\d{4})/);

    return {
        description: descriptionMatch ? descriptionMatch[1].trim() : "Aucune description",
        aliases: aliasesMatch ? aliasesMatch[1].trim() : "N/A",
        airdate: airdateMatch ? airdateMatch[1].trim() : "N/A"
    };
}

function extractEpisodes(html) {
    const episodes = [];
    const matches = html.match(/<li class="wp-manga-chapter[^>]*>[\s\S]*?<\/li>/g) || [];

    matches.forEach(match => {
        const hrefMatch = match.match(/href="([^"]+)"/);
        const numMatch = match.match(/>([^<]+)<\/a>/);

        if (hrefMatch && numMatch) {
            const href = hrefMatch[1];
            const number = numMatch[1].replace(/[^\d]/g, '');
            episodes.push({ href, number });
        }
    });

    episodes.reverse(); // Pour avoir l'épisode 1 en premier
    return episodes;
}

function extractStreamUrl(html) {
    const iframeMatch = html.match(/<iframe[^>]+src="([^"]+)"[^>]*>/);
    if (!iframeMatch) return null;

    const iframeUrl = iframeMatch[1];
    return iframeUrl.startsWith("http") ? iframeUrl : `https:${iframeUrl}`;
}
