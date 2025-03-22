export function generateArticleHTML(article) {
  // Remove file system operations
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${article.title} | QuickPronounce</title>
        <meta name="description" content="${article.description}">
        <meta name="keywords" content="${article.tags?.join(", ")}">
        <meta name="author" content="${article.author}">
        <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
        <header>
            <h1>${article.title}</h1>
            <p>By <strong>${article.author}</strong> | Published on ${
    article.date
  }</p>
        </header>
        
        <main>
            <img src="${article.image}" alt="${
    article.title
  }" class="article-image">
            <article>
                ${article.content}
            </article>
        </main>
  
        <footer>
            <p>© ${new Date().getFullYear()} QuickPronounce</p>
        </footer>
    </body>
    </html>
    `;
}
