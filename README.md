This project showcases a cryptocurrency dashboard, allowing users to explore and track details about cryptocurrencies. The frontend is built with **React**, and the backend, originally in** Node.js**, has been rewritten in **Rust**.

**Project Structure**

Frontend: React (sourced from Adrian Hajdin's [Cryptoverse project](https://github.com/adrianhajdin/project_cryptoverse)).

Backend: Rust (rewritten from the original Node.js backend). It utilizes RapidAPI for API calls, the same as in the original project.

**Setup Instructions**

Frontend:
1. Navigate to the frontend directory.
2. Run the following commands:

  npm install
  npm start

Backend
1. Navigate to the backend directory.
2. Create a .env file in the backend root directory with the following content:
RAPIDAPI_KEY=your_rapidapi_key_here
3. Run the backend:
  cargo run

**Notes**

You'll need a RapidAPI Key to make API calls. Add it to the .env file in the backend directory.
Original frontend and project idea: Adrian Hajdin.
Backend rewritten in Rust by [Your Name].

**License**
This project follows the original license from the Cryptoverse repository.
