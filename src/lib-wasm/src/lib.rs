use wasm_bindgen::prelude::*;

mod misc;

// JS -> Rust
#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

// Export Rust -> JS/TS
#[wasm_bindgen]
pub fn greet(str: &str) {
    alert(&format!("Hello, {}!", str));
}