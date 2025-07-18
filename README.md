# Gradely - AI-Powered Essay Feedback

Gradely is a full-stack web application designed to provide instant, AI-driven feedback on student essays. Users can upload their essays in various formats (PDF prefered) and receive detailed analysis, including suggestions for improvement, grammar checks, and structural advice, powered by Google's Gemini API.

## Features

-   **Essay Upload:** Supports `.txt` and `.pdf` file formats.
-   **AI-Generated Feedback:** Get instant, comprehensive feedback on your writing.
-   **Similarity Check:** Compares new submissions against a user's past essays to encourage originality.
-   **Secure & Private:** User authentication ensures that essays and feedback are private.
-   **Dockerized:** Easy setup and deployment using Docker.

## Tech Stack

-   **Backend:** Node.js, Express.js
-   **Frontend:** Modern JavaScript Framework (e.g., React, Vue, Svelte)
-   **Database:** SQL Database (e.g., PostgreSQL, MySQL)
-   **AI:** Google Gemini API
-   **Containerization:** Docker, Docker Compose

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:

-   Node.js (v18.x or later recommended)
-   npm or yarn
-   Docker
-   Git

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/gradely.git
    cd gradely
    ```

2.  **Set up Server Environment Variables:**
    -   Navigate to the `server` directory: `cd server`
    -   Create a `.env` file by copying the example (if one exists): `cp .env.example .env`
    -   Open the `.env` file and add the necessary credentials:
        ```env
        # Server Port
        PORT=5000

        # Database Connection URL
        DATABASE_URL="postgresql://user:password@host:port/database"

        # JWT Secret for Authentication
        JWT_SECRET="your_super_secret_jwt_key"

        # Google Gemini API Key
        GEMINI_API_KEY="your_gemini_api_key_here"
        ```

3.  **Set up Client Environment Variables:**
    -   Navigate to the `client` directory: `cd ../client`
    -   Create a `.env` file by copying the example (if one exists): `cp .env.example .env`
    -   Open the `.env` file and add the server's API URL. For Vite, the variable must be prefixed with `VITE_`.
        ```env
        VITE_API_BASE_URL="http://localhost:5000"
        ```

4.  **Install Dependencies:**
    -   Install server dependencies:
        ```bash
        cd ../server
        npm install
        ```
    -   Install client dependencies:
        ```bash
        cd ../client
        npm install
        ```

## Running the Application

You can run the application using Docker (recommended for ease of use) or by running the client and server separately.

### Method 1: Using Docker (Recommended)

From the root directory of the project, simply run:

```bash
docker-compose up --build
```

The application will be available in your configured client port. The server will be running on port 5000.

### Method 2: Running Locally

You will need two separate terminal windows.

-   **In the first terminal, start the server:**
    ```bash
    cd server
    npm run dev
    ```
    The server will be running on `http://localhost:5000`.

-   **In the second terminal, start the client:**
    ```bash
    cd client
    npm run dev
    ```
    The client application will be available at `http://localhost:5173` (or another port specified by your frontend tool).

## Project Structure

The project is organized as a monorepo with two main directories:

```
.
├── client/     # Contains the frontend application
├── server/     # Contains the backend API and database logic
├── .gitignore
├── docker-compose.yml
└── README.md
```

