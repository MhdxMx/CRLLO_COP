/**
 * Système de stockage pour les articles du journal
 */
const ArticleStorage = {
    // Clé utilisée pour stocker les articles dans localStorage
    STORAGE_KEY: 'llo_journal_articles',
    
    // Mot de passe d'administration (à changer pour plus de sécurité)
    ADMIN_PASSWORD: 'admin123',
    
    /**
     * Vérifie si le mot de passe d'administration est correct
     * @param {string} password - Mot de passe à vérifier
     * @returns {boolean} true si correct, false sinon
     */
    checkAdminPassword(password) {
        return password === this.ADMIN_PASSWORD;
    },
    
    /**
     * Récupère tous les articles stockés
     * @returns {Array} Liste des articles
     */
    getArticles() {
        const articlesJSON = localStorage.getItem(this.STORAGE_KEY);
        return articlesJSON ? JSON.parse(articlesJSON) : [];
    },
    
    /**
     * Récupère un article par son ID
     * @param {string} id - ID de l'article
     * @returns {Object|null} L'article ou null si non trouvé
     */
    getArticleById(id) {
        const articles = this.getArticles();
        return articles.find(article => article.id === id) || null;
    },
    
    /**
     * Enregistre un article (nouveau ou mise à jour)
     * @param {Object} article - L'article à sauvegarder
     */
    saveArticle(article) {
        const articles = this.getArticles();
        const index = articles.findIndex(a => a.id === article.id);
        
        if (index !== -1) {
            // Mise à jour d'un article existant
            articles[index] = article;
        } else {
            // Nouvel article
            articles.push(article);
        }
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(articles));
    },
    
    /**
     * Supprime un article
     * @param {string} id - ID de l'article à supprimer
     */
    deleteArticle(id) {
        const articles = this.getArticles();
        const filteredArticles = articles.filter(article => article.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredArticles));
    }
};
