# Textlytics - A Text Analysis API

**Textlytics** is a comprehensive, containerized backend system built with Python and Django. It provides a full-featured platform for user registration, secure session management, and powerful text analysis. Users can submit large blocks of text, which are processed asynchronously to compute word frequencies, and then retrieve the most relevant paragraphs for any given search term with high efficiency.

This project was developed as a backend assignment for Codemonk, demonstrating proficiency in modern backend architecture, system design, and DevOps practices.


---

## Features

### Core Functionality
- **Secure User Authentication**: Full user registration and login system using **JWT (JSON Web Tokens)** for stateless, secure API access.
- **Multi-Paragraph Submission**: Users can submit a single block of text which is intelligently parsed into individual paragraphs.
- **Asynchronous Text Processing**: Text analysis is offloaded to a **Celery** background worker, ensuring the API remains fast and responsive even with large submissions.
- **Efficient Word Frequency Search**: Retrieve the top 10 paragraphs for a given word, sorted by frequency. The search is highly optimized using advanced database features.
- **Polished User Interface**: A modern, interactive frontend built with HTML and JavaScript, featuring a public landing page and a private user dashboard.

### Technical & Architectural Features
- **Containerized Environment**: The entire application stack (API, Worker, Database, Cache) is containerized with **Docker** and orchestrated with **Docker Compose** for one-command setup and perfect reproducibility.
- **Advanced Database Indexing**: Leverages **PostgreSQL's** `JSONField` and **GIN indexing** for high-performance queries on unstructured text data.
- **Robust Service Orchestration**: Implements **healthchecks** in Docker Compose to prevent race conditions and ensure the database is fully ready before the application starts.
- **Auto-Generated API Documentation**: Includes a live, interactive **Swagger/OpenAPI** documentation endpoint generated automatically from the code.

---

## Tech Stack

| Component             | Technology                                                                                                    | Reason                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Backend Framework** | [Django](https://www.djangoproject.com/) & [Django Rest Framework](https://www.django-rest-framework.org/) | A robust, "batteries-included" framework for rapid and secure development of scalable web APIs.         |
| **Database**          | [PostgreSQL](https://www.postgresql.org/)                                                                     | For its powerful support for `JSONField` and advanced GIN indexing, crucial for the core search feature. |
| **Async Task Queue**  | [Celery](https://docs.celeryq.dev/) & [Redis](https://redis.io/)                                                  | To handle long-running text processing tasks asynchronously, ensuring a non-blocking API experience.      |
| **Containerization**  | [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)                          | For creating a reproducible, isolated, and easy-to-deploy development and production environment.       |
| **API Documentation** | [drf-spectacular](https://drf-spectacular.readthedocs.io/)                                                    | For auto-generating an OpenAPI 3.0 schema and a beautiful Swagger UI for the API.                       |
| **Frontend**          | HTML, Tailwind CSS (via CDN), JavaScript                                                                      | To provide a clean, modern, and interactive user interface to demonstrate the backend functionality.      |

---

## Setup and Installation

This project is fully containerized. The only prerequisite is to have **Docker** and **Docker Compose** installed on your machine.

**1. Clone the repository:**
```bash
git clone <your-repository-url>
cd codemonk-textlytics
```

**2. Build and run the containers:**
Execute the following command from the root of the project directory. This will build the Docker images and start all the necessary services.
```bash
docker-compose up --build
```
The initial build may take a few minutes. Subsequent startups will be much faster.

**3. Access the Application:**
Once all the services are running, you can access the application:
- **Main Website:** [http://localhost:8000](http://localhost:8000)
- **User Dashboard (after login):** [http://localhost:8000/app/](http://localhost:8000/app/)
- **API Documentation (Swagger UI):** [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)

To stop the application, press `Ctrl + C` in the terminal where `docker-compose` is running, and then run:
```bash
docker-compose down
```

---

## Project Structure

The project follows standard Django conventions for a clean and maintainable structure.

```
├── codemonk-textlytics/
│   ├── docker-compose.yml      # Orchestrates all services
│   ├── Dockerfile              # Defines the Python application container
│   ├── manage.py               # Django's command-line utility
│   ├── requirements.txt        # Python dependencies
│   ├── frontend/               # All HTML/JS frontend files
│   ├── textlytics/             # Main Django project configuration
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── celery.py
│   ├── users/                  # Django app for user management & auth
│   │   ├── models.py
│   │   ├── views.py
│   │   └── serializers.py
│   └── paragraphs/             # Django app for text submission & analysis
│       ├── models.py
│       ├── views.py
│       ├── serializers.py
│       └── tasks.py            # Celery tasks for background processing
└── ...
```