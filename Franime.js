function cleanTitle(title) {
    return title
        .replace(/&#8217;/g, "'")
        .replace(/&#8211;/g, "-")
        .replace(/&#[0-9]+;/g, "");
}

function searchResults(html) {
    const results = [];
    const baseUrl = "https://franime.fr/";

    // Corrected regex to target the anime titles and their links
    const animeListRegex = /<a href="([^"]+)".*?class=".*?">([\s\S]*?)<\/a>/g;
    let match;

    while ((match = animeListRegex.exec(html)) !== null) {
        const href = match[1]; // Anime URL
        const title = match[2]; // Anime title

        if (href && title) {
            results.push({
                title: cleanTitle(title).trim(),
                href: baseUrl + href.trim() // Ensure the full URL
            });
        }
    }

    return results;
}

function extractEpisodes(html) {
    const episodes = [];
    const baseUrl = "https://franime.fr/";

    // Corrected regex to extract episode data
    const episodeLinks = html.match(/<a class=".*?" href="([^"]+)">.*?Episode (\d+)<\/a>/g);
    if (!episodeLinks) {
        return episodes;
    }

    episodeLinks.forEach(link => {
        const hrefMatch = link.match(/href="([^"]+)"/);
        const numberMatch = link.match(/Episode (\d+)/);

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

    return episodes;
}

function extractStreamUrl(html) {
    const sourceRegex = /<source[^>]+id="iframevideo"[^>]+src="([^"]+)"/;
    const match = html.match(sourceRegex);
    return match ? match[1] : null;
}