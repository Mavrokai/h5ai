// Structure représentant un élément du système de fichiers (fichier ou dossier)
// Utilisée pour stocker les informations sur les fichiers et dossiers affichés dans l'interface
#[derive(Debug)]
pub struct FileItem {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
} 