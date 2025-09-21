use std::fs::{self, File};
use std::io::Write;
use std::path::Path;
use tauri::AppHandle;
use tauri::Emitter;

#[tauri::command]
pub fn process_stacks(app_handle: AppHandle, folder_path: String, stacks: Vec<String>) -> Result<(), String> {
    for stack in stacks {
        match stack.as_str() {
            // Backends
            "Express" => setup_express(&folder_path)?,
            "FastAPI" => setup_fastapi(&folder_path)?,
            "Django" => setup_django(&folder_path)?,

            // BaaS
            "Supabase" => setup_supabase(&folder_path)?,
            "Firebase" => setup_firebase(&folder_path)?,

            // Databases
            "PostgreSQL" => setup_postgres(&folder_path)?,
            "MongoDB" => setup_mongodb(&folder_path)?,
            "MySQL" => setup_mysql(&folder_path)?,
            "SQLite" => setup_sqlite(&folder_path)?,

            _ => {}
        }
        app_handle.emit("log", format!("✅ Generated files for {stack}")).unwrap();
    }

    app_handle.emit("log", "🎉 All stacks processed!").unwrap();
    Ok(())
}

/* ------------------ Frameworks ------------------ */

fn setup_express(folder_path: &str) -> Result<(), String> {
    let server_file = Path::new(folder_path).join("server.js");
    let mut file = File::create(&server_file).map_err(|e| e.to_string())?;
    let code = r#"
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => res.send('Hello from Express 🚀'));

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
"#;
    file.write_all(code.as_bytes()).map_err(|e| e.to_string())?;

    let package_file = Path::new(folder_path).join("package.json");
    let mut package = File::create(&package_file).map_err(|e| e.to_string())?;
    let package_content = r#"
{
  "name": "express-app",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": { "start": "node server.js" },
  "dependencies": { "express": "^4.18.2" }
}
"#;
    package.write_all(package_content.as_bytes()).map_err(|e| e.to_string())?;

    fs::create_dir_all(Path::new(folder_path).join("routes")).map_err(|e| e.to_string())?;
    fs::create_dir_all(Path::new(folder_path).join("controllers")).map_err(|e| e.to_string())?;
    fs::create_dir_all(Path::new(folder_path).join("models")).map_err(|e| e.to_string())?;

    Ok(())
}

fn setup_fastapi(folder_path: &str) -> Result<(), String> {
    let file = Path::new(folder_path).join("main.py");
    let mut f = File::create(&file).map_err(|e| e.to_string())?;
    let code = r#"
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello from FastAPI 🚀"}
"#;
    f.write_all(code.as_bytes()).map_err(|e| e.to_string())?;
    Ok(())
}

fn setup_django(folder_path: &str) -> Result<(), String> {
    let readme = Path::new(folder_path).join("README.md");
    let mut f = File::create(&readme).map_err(|e| e.to_string())?;
    f.write_all(b"Run `django-admin startproject myproject .` to bootstrap Django").map_err(|e| e.to_string())?;
    Ok(())
}

/* ------------------ BaaS ------------------ */

fn setup_supabase(folder_path: &str) -> Result<(), String> {
    let env_file = Path::new(folder_path).join(".env");
    let mut file = File::create(&env_file).map_err(|e| e.to_string())?;
    let env_content = "SUPABASE_URL=your-supabase-url\nSUPABASE_KEY=your-anon-key\n";
    file.write_all(env_content.as_bytes()).map_err(|e| e.to_string())?;

    let supabase_file = Path::new(folder_path).join("supabase.js");
    let mut supabase = File::create(&supabase_file).map_err(|e| e.to_string())?;
    let supabase_code = r#"
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
"#;
    supabase.write_all(supabase_code.as_bytes()).map_err(|e| e.to_string())?;
    Ok(())
}

fn setup_firebase(folder_path: &str) -> Result<(), String> {
    let file = Path::new(folder_path).join("firebase.js");
    let mut f = File::create(&file).map_err(|e| e.to_string())?;
    let code = r#"
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id"
};

export const app = initializeApp(firebaseConfig);
"#;
    f.write_all(code.as_bytes()).map_err(|e| e.to_string())?;
    Ok(())
}

/* ------------------ Databases ------------------ */

fn setup_postgres(folder_path: &str) -> Result<(), String> {
    let env_file = Path::new(folder_path).join(".env");
    let mut file = File::create(&env_file).map_err(|e| e.to_string())?;
    let env_content = "DATABASE_URL=postgres://user:password@localhost:5432/mydb\n";
    file.write_all(env_content.as_bytes()).map_err(|e| e.to_string())?;

    let sql_file = Path::new(folder_path).join("schema.sql");
    let mut schema = File::create(&sql_file).map_err(|e| e.to_string())?;
    schema.write_all(b"CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT, email TEXT UNIQUE);\n")
        .map_err(|e| e.to_string())?;
    Ok(())
}

fn setup_mongodb(folder_path: &str) -> Result<(), String> {
    fs::create_dir_all(Path::new(folder_path).join("models")).map_err(|e| e.to_string())?;

    let env_file = Path::new(folder_path).join(".env");
    let mut f = File::create(&env_file).map_err(|e| e.to_string())?;
    f.write_all(b"MONGODB_URI=mongodb://localhost:27017/mydb\n").map_err(|e| e.to_string())?;

    let model_file = Path::new(folder_path).join("models").join("User.js");
    let mut model = File::create(&model_file).map_err(|e| e.to_string())?;
    let code = r#"
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true }
});

module.exports = mongoose.model('User', userSchema);
"#;
    model.write_all(code.as_bytes()).map_err(|e| e.to_string())?;
    Ok(())
}

fn setup_mysql(folder_path: &str) -> Result<(), String> {
    let env_file = Path::new(folder_path).join(".env");
    let mut f = File::create(&env_file).map_err(|e| e.to_string())?;
    f.write_all(b"DATABASE_URL=mysql://user:password@localhost:3306/mydb\n").map_err(|e| e.to_string())?;
    Ok(())
}

fn setup_sqlite(folder_path: &str) -> Result<(), String> {
    let db_file = Path::new(folder_path).join("database.sqlite");
    File::create(&db_file).map_err(|e| e.to_string())?;

    let readme_file = Path::new(folder_path).join("README.md");
    let mut readme = File::create(&readme_file).map_err(|e| e.to_string())?;
    readme.write_all(b"SQLite DB file generated: database.sqlite").map_err(|e| e.to_string())?;
    Ok(())
}
