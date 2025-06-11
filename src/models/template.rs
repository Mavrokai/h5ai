// Structure du template principal de l'application
// Définit les données nécessaires pour le rendu de la page d'accueil et la navigation dans les dossiers
use askama::Template;
use crate::models::file_item::FileItem;

// template dossier racine/courant
#[derive(Template)]
#[template(path = "index.html")]
pub struct IndexTemplate {
    pub current_path: String,
    pub parent_path: String,
    pub items: Vec<FileItem>,
    pub root_dir: String,
} 