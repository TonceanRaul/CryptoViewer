use axum::http::{self, HeaderValue};
use axum::{routing::get, Router};
use http::Method;
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};

#[path = "api/crypto_prices.rs"]
mod crypto_prices;
use crypto_prices::get_coin_by_id;
use crypto_prices::get_coin_details_and_history;
use crypto_prices::get_coins;
#[path = "api/crypto_news.rs"]
mod crypto_news;
use crypto_news::get_crypto_news;

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();

    // Build the Axum router
    let app = Router::new()
        .route("/coins", get(get_coins))
        .route("/coin/:coinId", get(get_coin_by_id))
        .route(
            "/coin/:coinId/:timePeriod",
            get(get_coin_details_and_history),
        )
        .route("/news", get(get_crypto_news))
        .layer(
            CorsLayer::new()
                .allow_origin(vec![
                    "http://localhost:3000".parse::<HeaderValue>().unwrap(),
                    "http://192.168.64.1:3000".parse::<HeaderValue>().unwrap(),
                ])
                .allow_methods([Method::GET, Method::POST])
                .allow_headers([http::header::AUTHORIZATION, http::header::ACCEPT])
                .allow_headers(Any)
                .max_age(std::time::Duration::from_secs(60) * 10), // Include any other necessary headers
        );

    // Start the server
    let addr = SocketAddr::from(([127, 0, 0, 1], 3001));
    println!("Server running at http://{}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();

    axum::serve(listener, app).await.unwrap();
}
