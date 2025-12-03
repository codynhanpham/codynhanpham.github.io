use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::{future_to_promise, js_sys::Promise};
use serde::{Serialize, Deserialize};

/// Result after successfully executing a Brainfuck program.
#[derive(Serialize, Deserialize)]
pub struct BFOutput {
    pub raw: Vec<u8>, // Raw output bytes
    pub lossy_string: String, // Output as a lossy string
}


#[derive(Serialize, Deserialize)]
pub struct BFExecutionResult {
    pub success: bool,
    pub output: Option<BFOutput>,
    pub error: Option<String>,
}


#[wasm_bindgen]
pub fn bf_execute(src: String, input: Option<String>) -> Promise {
    future_to_promise(async move {
        let mut input_bytes = input.as_deref().unwrap_or("").as_bytes();
        let mut output = Vec::new();
        
        let result = bf_async(src, &mut input_bytes, &mut output).await;
        
        serde_wasm_bindgen::to_value(&result)
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {:?}", e)))
    })
}

async fn bf_async(src: String, input: &mut &[u8], output: &mut Vec<u8>) -> BFExecutionResult {
    // Yield control to allow UI updates, hopefully preventing UI freezes...
    wasm_bindgen_futures::JsFuture::from(Promise::resolve(&JsValue::UNDEFINED))
        .await
        .ok();
    
    let result = match heliometer::execute(&src, input, output) {
        Ok(_) => {
            let lossy_string = String::from_utf8_lossy(&output).to_string();
            let bf_result = BFOutput {
                raw: output.to_vec(),
                lossy_string,
            };
            BFExecutionResult {
                success: true,
                output: Some(bf_result),
                error: None,
            }
        }
        Err(e) => BFExecutionResult {
            success: false,
            output: None,
            error: Some(format!("[WASM] Brainfuck Execution Error:\n{:#?}", e)),
        }
    };
    
    result
}