use std::fs::{File, metadata, read, ReadDir, write};
use std::fs::read_dir;
use std::io::Read;
use std::path::PathBuf;
use std::str::FromStr;

use flate2::Compression;
use flate2::write::GzEncoder;
use image::imageops::CatmullRom;
use image::{ImageError, ImageResult};
use image::io::Reader as ImageReader;
use reqwest::blocking::Response;
use tempfile::NamedTempFile;

use crate::utils::http::send_paquet;
use crate::utils::structs::CommandResult;

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
    let u8 = read(path);
    Ok(u8.unwrap())
}

#[tauri::command]
pub fn write_file(path: &str, content: Vec<u8>) -> CommandResult<()> {
    println!("path: {}", path);
    write(path, content)?;
    Ok(())
}

#[tauri::command]
pub async fn send_directory(ip: &str, path: &str) -> CommandResult<String> {
    let entries = read_dir(path).unwrap();
    let tarball = prepare_tarball(entries);
    println!("path: {}", tarball.path().display());

    // let file = tarball.keep().unwrap().0;
    let tarball_path = tarball.into_temp_path();

    let mut res = send_paquet(ip, tarball_path).await.unwrap();
    let content = res.text().await.unwrap();

    Ok(content)
}

fn save_paquet(paquet: NamedTempFile) -> (File, PathBuf) {
    let saved = paquet.keep().unwrap();
    saved
}

//Create a file inside of `std::env::temp_dir()`.
fn create_temp_tar_file() -> NamedTempFile {
    // let app_data_path = confy::load("AppData;";
    // NamedTempFile::new_in(app_data_path.variable()).unwrap()
    //NamedTempFile::new_in("C:/Users/u.friedrich/AppData/Roaming/musubi").unwrap()
    NamedTempFile::new().unwrap()
}


/// Prepare a tarball and returns it as a temporary file
/// * `entries` - Content of the tarball
fn prepare_tarball(entries: ReadDir) -> NamedTempFile {
    let paquet = create_temp_tar_file();
    let enc = GzEncoder::new(paquet, Compression::default());
    let mut tar = tar::Builder::new(enc);
    // tar.append_dir_all(".", path).unwrap();
    for entry in entries {
        let entry = entry.unwrap();
        let mut f = File::open(entry.path()).unwrap();
        tar.append_file(entry.file_name(), &mut f).unwrap();
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
