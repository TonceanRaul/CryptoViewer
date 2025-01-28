use axum::extract::Path;
use axum::{extract::Query, http::StatusCode, response::IntoResponse, Json};
use reqwest::{header::HeaderMap, Client};
use serde_json::Value;
use std::{collections::HashMap, env};

pub async fn get_coin_details_and_history(
    Path((coin_id, time_period)): Path<(String, String)>,
    Query(params): Query<HashMap<String, String>>,
) -> Result<Json<Value>, impl IntoResponse> {
    // Default to "7d" if time_period is empty
    let time_period = if time_period.is_empty() {
        "24h".to_string()
    } else {
        time_period
    };

    // Get the API key from environment variables
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
    let url = format!(
        "https://coinranking1.p.rapidapi.com/coin/{}/history?timePeriod={}",
        coin_id, time_period
    );

    let mut headers = HeaderMap::new();
    headers.insert(
        "x-rapidapi-key",
        reqwest::header::HeaderValue::from_str(&api_key).unwrap(),
    );
    headers.insert(
        "x-rapidapi-host",
        reqwest::header::HeaderValue::from_str("coinranking1.p.rapidapi.com").unwrap(),
    );
    headers.insert(
        "Access-Control-Allow-Origin",
        reqwest::header::HeaderValue::from_str("http://localhost:3000").unwrap(),
    );

    let mut query_params = params.clone();
    query_params.insert(
        "referenceCurrencyUuid".to_string(),
        "yhjMzLPhuIDl".to_string(),
    );

    let client = Client::new();
    let response = match client
        .get(&url)
        .headers(headers)
        .query(&query_params)
        .send()
        .await
    {
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

// API handler for fetching coins
pub async fn get_coins(Query(params): Query<HashMap<String, String>>) -> impl IntoResponse {
    let default_count = "10".to_string();
    let count = params.get("limit").unwrap_or(&default_count); // Default to 10 if no count provided

    match fetch_crypto_data(count).await {
        Ok(data) => Json(data).into_response(),
        Err(err) => (StatusCode::INTERNAL_SERVER_ERROR, format!("Error: {}", err)).into_response(),
    }
}

pub async fn get_coin_by_id(
    Path(coin_id): Path<String>,
    Query(params): Query<HashMap<String, String>>,
) -> Result<Json<Value>, impl IntoResponse> {
    // Fetch API key from environment variables
    let api_key = match env::var("RAPIDAPI_KEY") {
        Ok(key) => key,
        Err(_) => {
            return Err((
                axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                "RAPIDAPI_KEY must be set",
            ))
        }
    };

    // Define the base URL and headers
    let url = format!("https://coinranking1.p.rapidapi.com/coin/{}", coin_id);
    let mut headers = HeaderMap::new();
    headers.insert(
        "x-rapidapi-key",
        reqwest::header::HeaderValue::from_str(&api_key).unwrap(),
    );
    headers.insert(
        "x-rapidapi-host",
        reqwest::header::HeaderValue::from_str("coinranking1.p.rapidapi.com").unwrap(),
    );
    headers.insert(
        "Access-Control-Allow-Origin",
        reqwest::header::HeaderValue::from_str("http://localhost:3000").unwrap(),
    );

    // Add default query parameters
    let mut query_params = params.clone();
    query_params.insert(
        "referenceCurrencyUuid".to_string(),
        "yhjMzLPhuIDl".to_string(),
    );
    query_params.insert("timePeriod".to_string(), "24h".to_string());

    // Create HTTP client and send the request
    let client = Client::new();
    let response = match client
        .get(&url)
        .headers(headers)
        .query(&query_params)
        .send()
        .await
    {
        Ok(res) => res,
        Err(err) => {
            eprintln!("Request failed: {}", err);
            return Err((
                axum::http::StatusCode::BAD_GATEWAY,
                "Failed to fetch coin data",
            ));
        }
    };

    // Parse the response body
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

// Function to fetch crypto data from the external API
async fn fetch_crypto_data(count: &str) -> Result<Value, String> {
    let api_key = env::var("RAPIDAPI_KEY").map_err(|_| "RAPIDAPI_KEY must be set".to_string())?;

    let url = "https://coinranking1.p.rapidapi.com/coins";
    let mut headers = HeaderMap::new();
    headers.insert(
        "x-rapidapi-key",
        reqwest::header::HeaderValue::from_str(&api_key).map_err(|e| e.to_string())?,
    );
    headers.insert(
        "x-rapidapi-host",
        reqwest::header::HeaderValue::from_str("coinranking1.p.rapidapi.com")
            .map_err(|e| e.to_string())?,
    );
    headers.insert(
        "Access-Control-Allow-Origin",
        reqwest::header::HeaderValue::from_str("http://localhost:3000")
            .map_err(|e| e.to_string())?,
    );
    let params = [
        ("limit", count),
        ("referenceCurrencyUuid", "yhjMzLPhuIDl"),
        ("orderBy", "marketCap"),
        ("orderDirection", "desc"),
    ];

    let client = Client::new();
    let response = client
        .get(url)
        .headers(headers)
        .query(&params)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if response.status().is_success() {
        let body = response
            .json::<Value>()
            .await
            .map_err(|e| format!("Failed to parse response: {}", e))?;
        Ok(body)
    } else {
        Err(format!("Request failed with status: {}", response.status()))
    }
}

/*
fn parse_crypto_data(crypto_data: Option<String>) -> Vec<Crypto> {
    match crypto_data {
        Some(data) => {
            println!("Parsing Data: {}", data);
            let parsed: SerdeResult<Value> = serde_json::from_str(&data);
            match parsed {
                Ok(value) => value["data"]["coins"]
                    .as_array()
                    .expect("Expected an array of coins")
                    .iter()
                    .filter_map(|coin| {
                        Some(Crypto {
                            uuid: coin["uuid"].as_str()?.to_string(),
                            symbol: coin["symbol"].as_str()?.to_string(),
                            name: coin["name"].as_str()?.to_string(),
                            price: coin["price"].as_str()?.to_string(),
                        })
                    })
                    .collect(),
                Err(e) => {
                    println!("Error parsing JSON: {:?}", e);
                    vec![]
                }
            }
        }
        None => {
            println!("No data to parse.");
            vec![]
        }
    }
 */
