/**
 * Gestionnaire de l'éditeur d'articles
 */
const ArticleEditor = {
    quill: null,
    currentArticle: null,

    /**
     * Initialise l'éditeur
     */
    init() {
        this.quill = new Quill('#editor', {
            theme: 'snow',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'header': 1 }, { 'header': 2 }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'script': 'sub'}, { 'script': 'super' }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'font': [] }],
                    [{ 'align': [] }],
                    ['link', 'image'],
                    ['clean']
                ]
            },
            placeholder: 'Rédigez votre article ici...'
        });

        // Event listeners
        document.getElementById('save-article-btn').addEventListener('click', () => this.saveArticle());
        document.getElementById('preview-article-btn').addEventListener('click', () => this.previewArticle());
        document.getElementById('back-to-edit-btn').addEventListener('click', () => this.showEditor());
        document.getElementById('delete-article-btn').addEventListener('click', () => this.deleteArticle());
    },

    /**
     * Crée un nouvel article
     */
    newArticle() {
        this.currentArticle = null;
        document.getElementById('article-title').value = '';
        document.getElementById('article-author').value = '';
        document.getElementById('article-excerpt').value = '';
        this.quill.setContents([]);
        this.showEditor();
        document.getElementById('delete-article-btn').style.display = 'none';
    },

    /**
     * Charge un article existant dans l'éditeur
     * @param {Object} article - L'article à charger
     */
    loadArticle(article) {
        this.currentArticle = article;
        document.getElementById('article-title').value = article.title;
        document.getElementById('article-author').value = article.author;
        document.getElementById('article-excerpt').value = article.excerpt;
        this.quill.setContents(JSON.parse(article.content));
        this.showEditor();
        document.getElementById('delete-article-btn').style.display = 'block';
    },

    /**
     * Sauvegarde l'article courant
     */
    saveArticle() {
        const title = document.getElementById('article-title').value.trim();
        const author = document.getElementById('article-author').value.trim();
        const excerpt = document.getElementById('article-excerpt').value.trim();

        if (!title || !author || !excerpt) {
            alert('Veuillez remplir tous les champs obligatoires (titre, auteur et extrait)');
            return;
        }

        const article = {
            id: this.currentArticle ? this.currentArticle.id : undefined,
            title: title,
            author: author,
            excerpt: excerpt,
            content: JSON.stringify(this.quill.getContents())
        };

        ArticleStorage.saveArticle(article);
        window.location.reload(); // Recharger la page pour mettre à jour la liste
    },

    /**
     * Affiche la prévisualisation de l'article
     */
    previewArticle() {
        const title = document.getElementById('article-title').value.trim();
        const author = document.getElementById('article-author').value.trim();
        const content = this.quill.getContents();

        document.getElementById('preview-title').textContent = title;
        document.getElementById('preview-author').textContent = `Par ${author}`;
        
        const previewQuill = new Quill('#preview-content', {
            readOnly: true,
            theme: 'bubble'
        });
        previewQuill.setContents(content);

        document.getElementById('editor-form').style.display = 'none';
        document.getElementById('preview-container').style.display = 'block';
    },

    /**
     * Retourne à l'éditeur depuis la prévisualisation
     */
    showEditor() {
        document.getElementById('editor-form').style.display = 'block';
        document.getElementById('preview-container').style.display = 'none';
    },

    /**
     * Supprime l'article courant
     */
    deleteArticle() {
        if (!this.currentArticle || !confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
            return;
        }

        if (ArticleStorage.deleteArticle(this.currentArticle.id)) {
            window.location.reload(); // Recharger la page pour mettre à jour la liste
        }
    }
};