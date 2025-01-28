use axum::{http::StatusCode, response::IntoResponse, Json};
use reqwest::{header::HeaderMap, Client};
use serde_json::Value;
use std::env;

pub async fn get_crypto_news() -> Result<Json<Value>, impl IntoResponse> {
    let api_key = match env::var("RAPIDAPI_KEY") {
        Ok(key) => key,
        Err(_) => {
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                "RAPIDAPI_KEY must be set",
            ))
        }
    };

    // Create the base URL for your API request (replace with actual API endpoint)
    let url = format!("https://cryptocurrency-news2.p.rapidapi.com/v1/cryptodaily",);

    let mut headers = HeaderMap::new();
    headers.insert(
        "x-rapidapi-key",
        reqwest::header::HeaderValue::from_str(&api_key).unwrap(),
    );
    headers.insert(
        "x-rapidapi-host",
        reqwest::header::HeaderValue::from_str("cryptocurrency-news2.p.rapidapi.com").unwrap(),
    );
    headers.insert(
        "Access-Control-Allow-Origin",
        reqwest::header::HeaderValue::from_str("http://localhost:3000").unwrap(),
    );

    let client = Client::new();
    let response = match client.get(&url).headers(headers).send().await {
        Ok(res) => res,
        Err(err) => {
            eprintln!("Request failed: {}", err);
            return Err((
                axum::http::StatusCode::BAD_GATEWAY,
                "Failed to fetch coin data",
            ));
        }
    };

    if response.status().is_success() {
        match response.json::<Value>().await {
            Ok(body) => Ok(Json(body)),
            Err(err) => {
                eprintln!("Failed to parse response body: {}", err);
                Err((
                    axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                    "Failed to parse response",
                ))
            }
        }
    } else {
        let error = "API error with status";
        eprintln!("API returned error status: {}", response.status());
        Err((axum::http::StatusCode::BAD_GATEWAY, error))
    }
}
