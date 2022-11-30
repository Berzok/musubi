#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use reqwest::Client;
use reqwest::multipart;
use tokio_util::codec::{BytesCodec, FramedRead};

use tempfile::TempPath;

pub async fn send_paquet(ip: &str, name: &str, paquet_path: TempPath) -> Result<reqwest::Response, Box<dyn std::error::Error>> {
    let file = tokio::fs::File::open(&paquet_path).await?;

    //read file body stream
    let stream = FramedRead::new(file, BytesCodec::new());
    let file_body = reqwest::Body::wrap_stream(stream);

    //make form part of file
    let part = multipart::Part::stream(file_body)
        .file_name("tarball")
        .mime_str("application/octet-stream")?;

    let form = multipart::Form::new()
        .text("name", name.to_owned())
        .part("data", part);

    let client = Client::new();
    let res = client
        .post(ip)
        .multipart(form)
        .send().await?;

    Ok(res)
}

pub fn retrieve_paquet(ip: &str) -> Result<ureq::Response, Box<dyn std::error::Error>> {
    let response = ureq::get(ip).call()?;

    Ok(response)

    /*
    let (mut dest) = {
        let fname = response
            .url()
            .path_segments()
            .and_then(|segments| segments.last())
            .and_then(|name| if name.is_empty() { None } else { Some(name) })
            .unwrap_or("tmp.bin");

        println!("file to download: '{}'", fname);
        let fname = tmp_dir.path().join(fname);
        println!("will be located under: '{:?}'", fname);
        (fname, std::fs::File::create(&fname)?)
    };
     */

    // let content =  response.bytes().await?;
    // Ok(content.to_vec())
    //copy(&mut content.as_bytes(), &mut dest)?;

}