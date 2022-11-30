use serde::{ser::Serializer, Deserialize, Serialize};

// create the error type that represents all errors possible in our program
#[derive(Debug, thiserror::Error)]
pub enum CommandError {
    #[error(transparent)]
    Io(#[from] std::io::Error)

}

// we must manually implement serde::Serialize
impl Serialize for CommandError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
        where
            S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

pub type CommandResult<T, E = CommandError> = anyhow::Result<T, E>;


#[derive(Serialize, Deserialize)]
pub struct Item {
    pub id: String,
    pub name: String,
    pub paths: Vec<ItemPath>,
}

#[derive(Serialize, Deserialize)]
pub struct ItemPath {
    pub id: String,
    pub path: String,
}


#[derive(Serialize, Deserialize)]
struct MyConfig {
    version: u8,
    api_key: String,
}