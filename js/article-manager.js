/**
 * Gestion globale des articles et de l'interface d'administration
 */
const ArticleManager = {
    // Articles existants
    defaultArticles: [
        {
            id: 'article-9',
            title: 'Information aux élèves : Remise des bulletins du second trimestre',
            author: 'Richie',
            excerpt: 'Nous vous informons que la remise des bulletins du second trimestre est prévue pour le jeudi 13 mars 2025. Cette remise se déroulera au lycée Luc Okenkali.',
            content: JSON.stringify({
                ops: [
                    { insert: 'Information aux élèves : Remise des bulletins du second trimestre\n', attributes: { header: 1 } },
                    { insert: '\nNous vous informons que la remise des bulletins du second trimestre est prévue pour ' },
                    { insert: 'le jeudi 13 mars 2025', attributes: { bold: true } },
                    { insert: '. Cette remise se déroulera au ' },
                    { insert: 'lycée Luc Okenkali', attributes: { bold: true } },
                    { insert: '.\n\nMerci de votre attention.\n' }
                ]
            }),
            date: '2025-03-10T10:00:00.000Z'
        },
        {
            id: 'article-8',
            title: '⚽️ Résumé des matchs des 5 et 6 mars 2025',
            author: 'Richie',
            excerpt: 'Les 5 et 6 mars 2025 ont été marqués par des rencontres palpitantes dans le cadre des compétitions scolaires. Voici les résultats des matchs.',
            content: JSON.stringify({
                ops: [
                    { insert: '⚽️ Résumé des matchs des 5 et 6 mars 2025 ⚽️\n', attributes: { header: 1 } },
                    { insert: '\nLes 5 et 6 mars 2025 ont été marqués par des rencontres palpitantes dans le cadre des compétitions scolaires. Voici les résultats des matchs :\n\n' },
                    { insert: 'Résultats du 5 mars :\n', attributes: { header: 2 } },
                    { insert: '• 2nde A vs 2nde B : 3-2\n• 1ère C vs 1ère D : 1-1\n\n' },
                    { insert: 'Résultats du 6 mars :\n', attributes: { header: 2 } },
                    { insert: '• Tle A vs Tle B : 2-0\n• 2nde C vs 2nde D : 4-1\n\nFélicitations à tous les participants !\n' }
                ]
            }),
            date: '2025-03-07T09:00:00.000Z'
        }
    ],

    /**
     * Initialise le gestionnaire d'articles
     */
    init() {
        console.log('Initializing ArticleManager...');
        
        // Initialiser l'éditeur
        ArticleEditor.init();
        
        // Gestion de la connexion
        const loginForm = document.getElementById('login-form');
        console.log('Login form found:', loginForm !== null);
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                console.log('Login form submitted');
                this.handleLogin(e);
            });
        } else {
            console.error('Login form not found!');
        }
        
        // Gestion de la déconnexion
        const logoutBtn = document.getElementById('logout-btn');
        console.log('Logout button found:', logoutBtn !== null);
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                console.log('Logout button clicked');
                this.handleLogout();
            });
        }
        
        // Boutons d'action
        document.getElementById('new-article-btn')?.addEventListener('click', () => ArticleEditor.newArticle());
        document.getElementById('export-btn')?.addEventListener('click', this.exportData.bind(this));
        document.getElementById('import-btn')?.addEventListener('click', () => document.getElementById('import-file').click());
        document.getElementById('import-file')?.addEventListener('change', this.importData.bind(this));
        document.getElementById('publish-btn')?.addEventListener('click', this.publishSite.bind(this));
        
        // Gestion de la modal de publication
        const modal = document.getElementById('publish-modal');
        document.querySelector('.close')?.addEventListener('click', () => modal.style.display = 'none');
        document.getElementById('download-site-btn')?.addEventListener('click', this.downloadSite.bind(this));
        
        // Initialiser les articles par défaut s'il n'y en a pas
        this.initDefaultArticles();
        
        // Vérifier si l'utilisateur est déjà connecté
        this.checkLoginStatus();
        
        console.log('ArticleManager initialization complete');
    },

    /**
     * Initialise les articles par défaut si nécessaire
     */
    initDefaultArticles() {
        console.log('Checking for default articles...');
        const articles = ArticleStorage.getArticles();
        if (articles.length === 0) {
            console.log('No articles found, initializing defaults...');
            this.defaultArticles.forEach(article => {
                ArticleStorage.saveArticle(article);
            });
            console.log('Default articles initialized');
        } else {
            console.log('Articles already exist:', articles.length);
        }
    },
    
    /**
     * Vérifie si l'utilisateur est déjà connecté
     */
    checkLoginStatus() {
        console.log('Checking login status...');
        const isLoggedIn = sessionStorage.getItem('admin_logged_in') === 'true';
        console.log('Is logged in:', isLoggedIn);
        
        if (isLoggedIn) {
            this.showAdminPanel();
            this.loadArticleList();
        } else {
            document.getElementById('admin-container').style.display = 'none';
            document.getElementById('login-container').style.display = 'block';
        }
    },
    
    /**
     * Gère la connexion à l'administration
     */
    handleLogin(event) {
        event.preventDefault();
        const password = document.getElementById('password').value;
        console.log('Attempting login...');
        
        if (ArticleStorage.checkAdminPassword(password)) {
            console.log('Login successful');
            sessionStorage.setItem('admin_logged_in', 'true');
            this.showAdminPanel();
            this.loadArticleList();
            document.getElementById('login-error').textContent = '';
        } else {
            console.log('Login failed');
            document.getElementById('login-error').textContent = 'Mot de passe incorrect';
            document.getElementById('password').value = '';
        }
    },
    
    /**
     * Gère la déconnexion
     */
    handleLogout() {
        console.log('Logging out...');
        sessionStorage.removeItem('admin_logged_in');
        document.getElementById('admin-container').style.display = 'none';
        document.getElementById('login-container').style.display = 'block';
        document.getElementById('password').value = '';
        document.getElementById('login-error').textContent = '';
        console.log('Logout complete');
    },
    
    /**
     * Affiche le panneau d'administration
     */
    showAdminPanel() {
        console.log('Showing admin panel');
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('admin-container').style.display = 'block';
    },
    
    /**
     * Charge la liste des articles
     */
    loadArticleList() {
        console.log('Loading article list...');
        const articleList = document.getElementById('article-list');
        articleList.innerHTML = '';
        
        const articles = ArticleStorage.getArticles();
        console.log('Found articles:', articles.length);
        
        if (articles.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = 'Aucun article disponible';
            articleList.appendChild(emptyMessage);
            return;
        }
        
        // Trier les articles par date de modification (plus récent en premier)
        articles.sort((a, b) => new Date(b.lastModified || b.date) - new Date(a.lastModified || a.date));
        
        articles.forEach(article => {
            const li = document.createElement('li');
            li.className = 'article-item';
            li.innerHTML = `
                <div class="article-title">${article.title}</div>
                <div class="article-meta">
                    <span class="article-author">Par ${article.author}</span>
                    <span class="article-date">${this.formatDate(article.lastModified || article.date)}</span>
                </div>
            `;
            
            li.addEventListener('click', () => {
                const fullArticle = ArticleStorage.getArticleById(article.id);
                if (fullArticle) {
                    ArticleEditor.loadArticle(fullArticle);
                }
            });
            
            articleList.appendChild(li);
        });
        console.log('Article list loaded');
    },
    
    /**
     * Formate une date ISO en format lisible
     */
    formatDate(isoDate) {
        const date = new Date(isoDate);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    /**
     * Exporte les données des articles
     */
    exportData() {
        console.log('Exporting data...');
        const data = ArticleStorage.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const filename = `journal_llo_export_${new Date().toISOString().slice(0, 10)}.json`;
        
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        console.log('Data exported:', filename);
    },
    
    /**
     * Importe des données d'articles
     */
    importData(event) {
        console.log('Importing data...');
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const success = ArticleStorage.importData(e.target.result);
            if (success) {
                this.loadArticleList();
                alert('Importation réussie !');
                console.log('Data import successful');
            } else {
                alert('Erreur lors de l\'importation. Format de fichier invalide.');
                console.error('Data import failed');
            }
        };
        reader.readAsText(file);
        
        // Réinitialiser l'input file
        event.target.value = '';
    },
    
    /**
     * Affiche la modal de publication du site
     */
    publishSite() {
        console.log('Opening publish modal');
        document.getElementById('publish-modal').style.display = 'block';
    },
    
    /**
     * Génère et télécharge le site complet
     */
    downloadSite() {
        console.log('Download site requested');
        alert('Fonctionnalité en cours de développement');
        document.getElementById('publish-modal').style.display = 'none';
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de Quill
    const quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['clean']
            ]
        }
    });

    // Éléments du DOM
    const loginForm = document.getElementById('login-form');
    const loginContainer = document.getElementById('login-container');
    const adminPanel = document.getElementById('admin-panel');
    const articleForm = document.getElementById('article-form');
    const articlesContainer = document.getElementById('articles-container');

    // Vérifier si l'utilisateur est déjà connecté
    function checkLoginStatus() {
        if (sessionStorage.getItem('admin_logged_in') === 'true') {
            showAdminPanel();
        }
    }

    // Gérer la connexion
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const password = document.getElementById('password').value;
        
        if (ArticleStorage.checkAdminPassword(password)) {
            sessionStorage.setItem('admin_logged_in', 'true');
            showAdminPanel();
        } else {
            document.getElementById('login-error').textContent = 'Mot de passe incorrect';
        }
    });

    // Afficher le panneau d'administration
    function showAdminPanel() {
        loginContainer.style.display = 'none';
        adminPanel.style.display = 'block';
        loadArticles();
    }

    // Charger les articles
    function loadArticles() {
        const articles = ArticleStorage.getArticles();
        articlesContainer.innerHTML = '';

        articles.forEach(article => {
            const articleElement = document.createElement('div');
            articleElement.className = 'article-item';
            articleElement.innerHTML = `
                <div class="article-info">
                    <h3>${article.title}</h3>
                    <div class="article-meta">
                        <span>Par ${article.author}</span>
                        <span>${new Date(article.date).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="article-actions">
                    <button onclick="editArticle('${article.id}')" class="btn-edit">Modifier</button>
                    <button onclick="deleteArticle('${article.id}')" class="btn-delete">Supprimer</button>
                </div>
            `;
            articlesContainer.appendChild(articleElement);
        });
    }

    // Gérer la soumission du formulaire d'article
    articleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const article = {
            id: Date.now().toString(),
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            excerpt: document.getElementById('excerpt').value,
            content: JSON.stringify(quill.getContents()),
            date: new Date().toISOString()
        };

        ArticleStorage.saveArticle(article);
        loadArticles();
        resetForm();
    });

    // Réinitialiser le formulaire
    window.resetForm = function() {
        articleForm.reset();
        quill.setContents([]);
    };

    // Éditer un article
    window.editArticle = function(id) {
        const article = ArticleStorage.getArticleById(id);
        if (article) {
            document.getElementById('title').value = article.title;
            document.getElementById('author').value = article.author;
            document.getElementById('excerpt').value = article.excerpt;
            quill.setContents(JSON.parse(article.content));
            
            // Changer le formulaire en mode édition
            articleForm.dataset.editId = id;
            document.querySelector('.btn-primary').textContent = 'Mettre à jour';
        }
    };

    // Supprimer un article
    window.deleteArticle = function(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
            ArticleStorage.deleteArticle(id);
            loadArticles();
        }
    };

    // Vérifier le statut de connexion au chargement
    checkLoginStatus();
});
