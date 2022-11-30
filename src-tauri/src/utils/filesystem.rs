use std::fs::{DirBuilder, File, metadata, read, ReadDir, write};
use std::fs::read_dir;
use std::path::PathBuf;
use std::str::FromStr;

use flate2::Compression;
use flate2::read::GzDecoder;
use flate2::write::GzEncoder;
use image::imageops::CatmullRom;
use image::io::Reader as ImageReader;
use tar::Archive;
use tauri::api::path::download_dir;
use tempfile::{NamedTempFile, TempPath};

use crate::utils::http::{retrieve_paquet, send_paquet};
use crate::utils::structs::CommandResult;
use crate::utils::structs::ItemPath;

#[tauri::command]
pub fn is_directory(path: &str) -> bool {
    let md = metadata(path).unwrap();
    println!("is dir: {}", md.is_dir());
    println!("is file: {}", md.is_file());
    md.is_dir()
}

#[tauri::command]
pub fn directory_content(path: &str) -> CommandResult<Vec<PathBuf>> {
    let mut entries = Vec::<PathBuf>::new();
    for entry_result in read_dir(path)? {
        let entry = entry_result;//.unwrap().map_err(|e| e.to_string());
        entries.push(entry.unwrap().path());
    }
    Ok(entries)
}

#[tauri::command]
pub fn read_file(path: &str) -> CommandResult<Vec<u8>> {
    match read(path) {
        Ok(u8) => {
            Ok(u8)
        }
        Err(e) => {
            println!("Error: {}", e.to_string());
            Ok(Vec::<u8>::new())
            // ... sk is not available, and e explains why ...
        }
    }
}

#[tauri::command]
pub fn write_file(path: &str, content: Vec<u8>) -> CommandResult<()> {
    println!("path: {}", path);
    write(path, content)?;
    Ok(())
}

#[tauri::command]
pub async fn send_file(ip: &str, path: &str) -> CommandResult<String> {
    let filepath = PathBuf::from_str(path).unwrap();
    let temp_path = TempPath::from_path(filepath);
    let res = send_paquet(ip, "bob", temp_path).await.unwrap();
    let content = res.text().await.unwrap();

    Ok(content)
}

#[tauri::command]
pub async fn send_item(ip: &str, name: &str, item_paths: Vec<ItemPath>) -> CommandResult<String> {
    //One tarball to store them all

    //For each resource of the item, we create a tarball and store it in tarball_store
    // for p in item_paths.iter() {
    //     let id = &p.id;
    //     let path = &p.path;
    //     let entries = read_dir(path).unwrap();
    //     let tarball = prepare_tarball(entries);
    //     tarball_store.push(tarball);
    // }
    let tarball = prepare_tarball(item_paths);

    let tarball_path = tarball.into_temp_path();

    let res = send_paquet(ip, name.clone(), tarball_path).await.unwrap();
    let content = res.text().await.unwrap();

    Ok(content)
}


#[tauri::command]
pub async fn retrieve_item(ip: &str, item_paths: Vec<ItemPath>) -> CommandResult<String> {
    let response = retrieve_paquet(ip).unwrap();
    let mut temp_file = tempfile::Builder::new().prefix("musubi").tempfile()?;
    let mut content = response.into_reader();

    let download_directory = download_dir().unwrap();
    let save_path = download_directory.join(temp_file.path().file_name().unwrap());
    DirBuilder::new()
        .recursive(true)
        .create(save_path.clone()).unwrap();

    std::io::copy(&mut content, &mut temp_file).expect("Error writing to tempfile");

    let tar_gz = File::open(temp_file.path())?;
    let tar = GzDecoder::new(tar_gz);
    let mut archive = Archive::new(tar);
    archive.unpack(save_path.clone()).unwrap();

    //let (file, pathbuf) = temp_file.keep().expect("Error persisting tempfile");

    Ok(save_path.into_os_string().into_string().unwrap())
}

///Create a file inside of `std::env::temp_dir()`.
/// Exact location depends on the OS.
fn create_temp_tar_file() -> Result<NamedTempFile, std::io::Error> {
    NamedTempFile::new()
}

/// Prepare a tarball and return it as a temporary file
/// * `entries` - Content of the tarball
fn prepare_tarball(entries: Vec<ItemPath>) -> NamedTempFile {
    let paquet = create_temp_tar_file().expect("Error when creating temp file.");
    let enc = GzEncoder::new(paquet, Compression::default());
    let mut tar = tar::Builder::new(enc);

    // tar.append_dir_all(".", path).unwrap();
    for entry in entries.iter() {
        println!("Entry path: {}", &entry.path);
        let path_buf = PathBuf::from(&entry.path);

        //Either it's a single file
        if path_buf.is_file() {
            let mut f = File::open(&entry.path).unwrap();
            let mut archive_path = entry.id.clone();

            let filename = path_buf.file_name().unwrap().to_str().unwrap();
            println!("Filename: {}", filename);

            archive_path.push_str("/");
            archive_path.push_str(filename);
            println!("archive_path: {}", archive_path);

            tar.append_file(archive_path, &mut f).unwrap();
        }
        //or a directory
        else {
            tar.append_dir_all(&entry.id, &entry.path).unwrap();
        }
    }
    tar.into_inner().unwrap().finish().unwrap()
}

#[tauri::command]
pub fn optimise_image(path: &str) -> CommandResult<()> {
    let img = ImageReader::open(path).unwrap().with_guessed_format().unwrap().decode().unwrap();
    // let resized_image = img.thumbnail(250, 250);
    let resized_image = img.resize(500, 500, CatmullRom);
    resized_image.save(path).unwrap();
    Ok(())
}
