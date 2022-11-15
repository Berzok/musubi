#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use std::fs::{read};
use std::io::{BufReader, Read};
use std::path::PathBuf;
use reqwest::{Body, Error};
use reqwest::Client;
use reqwest::Response;
use reqwest::multipart;
use tempfile::TempPath;
use tide::{Request, Server};
use tide::prelude::*;
use tokio::fs::File;
use tokio_util::codec::{BytesCodec, FramedRead};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
pub fn login(passcode: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", passcode)
}

#[tauri::command]
pub fn connect_to_ip(ip: &str) -> String {
    format!("This is working")
}

#[derive(Debug, Deserialize)]
struct Item {
    name: String,
    legs: u16,
}

pub async fn send_paquet(ip: &str, paquet_path: TempPath) -> Result<Response, Box<dyn std::error::Error>> {
    let file = File::open(&paquet_path).await?;

    // read file body stream
    let stream = FramedRead::new(file, BytesCodec::new());
    let file_body = Body::wrap_stream(stream);

    //make form part of file
    let part = multipart::Part::stream(file_body)
        .file_name("tarball")
        .mime_str("application/octet-stream")?;

    let form = multipart::Form::new()
        .text("name", "bob")
        .part("data", part);

    let client = Client::new();
    let res = client
        .post(ip)
        .multipart(form)
        .send().await?;

    Ok(res)
}

#[tauri::command]
pub async fn start() -> tide::Result<()> {
    let mut app: Server<()> = tide::new();
    app.at("/receive").put(receive_files);
    app.listen("127.0.0.1:7878").await?;
    Ok(())
}

async fn receive_files(mut req: Request<()>) -> tide::Result {
    let Item { name, legs } = req.body_json().await?;
    Ok(format!("Hello, {}! I've put in an order for {} shoes", name, legs).into())
}