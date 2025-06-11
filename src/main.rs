// Point d'entrée principal de l'application
// Gère l'initialisation du serveur, la configuration des routes et le démarrage du serveur web

use std::env;
use std::path::Path;
use std::sync::Arc;
use axum::{
    Router,
    routing::get,
};
use tower_http::services::ServeDir;

mod models;
mod services;
mod handlers;


#[tokio::main]
async fn main() {
    let args: Vec<String> = env::args().collect();
    
    if args.len() != 2 {
        eprintln!("Usage: {} <chemin_du_dossier>", args[0]);
        std::process::exit(1);
    }

    let chemin = Arc::new(args[1].clone());
    let path = Path::new(&*chemin);

    if !path.exists() {
        eprintln!("Erreur: Le chemin '{}' n'existe pas", chemin);
        std::process::exit(1);
    }

    if !path.is_dir() {
        eprintln!("Erreur: '{}' n'est pas un dossier", chemin);
        std::process::exit(1);
    }

    println!("Démarrage du serveur sur http://localhost:3000");
    println!("Dossier servi: {}", chemin);

    let chemin_clone = Arc::clone(&chemin);
    let chemin_clone2 = Arc::clone(&chemin);
    let app = Router::new()
        .route("/", get(move || handlers::file_handlers::index(Arc::clone(&chemin_clone))))
        .route("/{*path}", get(move |path| handlers::file_handlers::directory_handler(path, Arc::clone(&chemin))))
        .fallback_service(ServeDir::new(&*chemin_clone2).append_index_html_on_directories(true));

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await.unwrap();
    
    println!("Serveur démarré avec succès!");
    axum::serve(listener, app).await.unwrap();
}