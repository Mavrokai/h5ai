// Structure représentant un élément du système de fichiers (fichier ou dossier)
// Utilisée pour stocker les informations sur les fichiers et dossiers affichés dans l'interface
use std::time::SystemTime;
use chrono::{DateTime, Local};

#[derive(Debug)]
pub struct FileItem {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub last_modified: String,
}

impl FileItem {


    pub fn new(name: String, path: String, is_dir: bool, last_modified: SystemTime) -> Self {
        
        let datetime: DateTime<Local> = last_modified.into();
        Self {
            name,
            path,
            is_dir,
            last_modified: datetime.format("%d/%m/%Y %H:%M:%S").to_string(),
        }
    }
} 