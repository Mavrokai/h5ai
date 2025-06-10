// Gestionnaires de routes pour les fichiers et dossiers
// Contient les fonctions qui gèrent les requêtes HTTP pour l'affichage des fichiers et la navigation dans les dossiers


use axum::{
    response::Html,
    extract::Path as AxumPath,
};
use std::path::PathBuf;
use std::sync::Arc;
use askama::Template;
use crate::models::template::IndexTemplate;
use crate::services::file_service::list_directory_contents;


// affiche dossier racine
pub async fn index(base_path: Arc<String>) -> Html<String> {
    let current_path = String::from("/");
    let items = list_directory_contents(&current_path, &base_path).unwrap_or_default();
    let root_dir_name = PathBuf::from(&*base_path)
        .file_name()
        .and_then(|name| name.to_str())
        .unwrap_or(&base_path)
        .to_string();
    
    let template = IndexTemplate {
        current_path,
        parent_path: String::new(),
        items,
        root_dir: root_dir_name,
    };
    
    Html(template.render().unwrap())
}



// affiche dossier courant
pub async fn directory_handler(path: AxumPath<String>, base_path: Arc<String>) -> Html<String> {
    let current_path = format!("/{}", path.0);
    let parent_path = if current_path != "/" {
        current_path.trim_end_matches(|c| c != '/').to_string()
    } else {
        String::new()
    };
    
    let items = list_directory_contents(&current_path, &base_path).unwrap_or_default();
    let root_dir_name = PathBuf::from(&*base_path)
        .file_name()
        .and_then(|name| name.to_str())
        .unwrap_or(&base_path)
        .to_string();
    
    let template = IndexTemplate {
        current_path,
        parent_path,
        items,
        root_dir: root_dir_name,
    };
    
    Html(template.render().unwrap())
} 