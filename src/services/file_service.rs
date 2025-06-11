// Service de gestion des fichiers
// Contient les fonctions pour lister et manipuler les fichiers et dossiers
use std::fs;
use std::path::PathBuf;
use crate::models::file_item::FileItem;

// liste contenu du dossier
pub fn list_directory_contents(path: &str, base_path: &str) -> std::io::Result<Vec<FileItem>> {
    let full_path = PathBuf::from(base_path).join(path.trim_start_matches('/'));
    
    let mut items = Vec::new();
    
    for entry in fs::read_dir(full_path)? {
        let entry = entry?;
        let path = entry.path();
        let name = path.file_name().unwrap().to_string_lossy().to_string();
        let is_dir = path.is_dir();

        let last_modified = fs::metadata(&path)?.modified()?;
        
        let relative_path = path.strip_prefix(base_path).unwrap();
        let web_path = format!("/{}", relative_path.to_string_lossy());
        
        items.push(FileItem::new(
            name,
            web_path,
            is_dir,
            last_modified,
        ));
    }
    
    items.sort_by(|a, b| {
        if a.is_dir == b.is_dir {
            a.name.cmp(&b.name)
        } else {
            b.is_dir.cmp(&a.is_dir)
        }
    });
    
    Ok(items)
} 