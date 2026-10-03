# HSBC Homework

A property valuation and market analysis application.

## 1. Project Modules

| Directory | Technology | Purpose |
|---|---|---|
| `prediction-service` | Python, FastAPI, scikit-learn | Loads the pre-trained model and provides property price predictions |
| `analysis-service` | Java 21, Spring Boot | Provides property queries, statistics, what-if analysis and exports |
| `portal` | Next.js, React | Provides the property estimator and market analysis pages |
| `data` | CSV | Contains the property data used for training and analysis |

## 2. Run and Deployment

### Local Development

Start the three services in separate terminals and in the following order.

```bash
# Prediction service
cd prediction-service
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

```bash
# Analysis service
cd analysis-service
mvn spring-boot:run
```

```bash
# Portal
cd portal
npm ci
npm run dev
```

Regenerate the model after changing the dataset or training code:

```bash
cd prediction-service
python -m ml.training --dataset ../data/House_Price_Dataset.csv --output artifacts
```

### Docker Compose (Recommended)

Ensure that the pre-trained model exists at:

```text
prediction-service/artifacts/linear_regression.joblib
```

Build and start the application from the repository root:

```bash
docker compose up --build -d --wait
```

| Service | URL |
|---|---|
| Portal | http://localhost:3000 |
| Prediction Swagger | http://localhost:8000/docs |
| Analysis Swagger | http://localhost:8080/swagger-ui.html |

Stop the application with:

```bash
docker compose down
```

Override the host ports when the defaults are unavailable:

```bash
PORTAL_PORT=3100 PREDICTION_PORT=8100 ANALYSIS_PORT=8180 \
docker compose up --build -d --wait
```

## 3. Configuration

| Module | Configuration | Default | Purpose |
|---|---|---|---|
| Prediction | `MODEL_DIR` | `prediction-service/artifacts` | Model directory; `/app/artifacts` in Docker Compose |
| Prediction | `MODEL_FILENAME` | `linear_regression.joblib` | Model artifact filename |
| Prediction | `LOG_LEVEL` | `INFO` | Application log level |
| Analysis | `PROPERTY_DATA_PATH` | `file:../data/House_Price_Dataset.csv` | Property dataset location |
| Analysis | `PREDICTION_SERVICE_PREDICT_URL` | `http://localhost:8000/predict` | Prediction endpoint used by what-if analysis |
| Analysis | `app.cache.maximum-size` | `500` | Maximum entries in each Caffeine cache |
| Analysis | `app.cache.expire-after-access` | `10m` | Caffeine cache expiry after the last access |
| Portal | `PREDICTION_SERVICE_URL` | `http://localhost:8000` | Server-side Prediction service URL |
| Portal | `ANALYSIS_SERVICE_URL` | `http://localhost:8080` | Server-side Analysis service URL |
| Docker Compose | `PREDICTION_LOG_LEVEL` | `INFO` | Log level passed to the Prediction service |
| Docker Compose | `PORTAL_PORT` | `3000` | Portal host port |
| Docker Compose | `PREDICTION_PORT` | `8000` | Prediction service host port |
| Docker Compose | `ANALYSIS_PORT` | `8080` | Analysis service host port |

The Analysis service cache settings are stored in
`analysis-service/src/main/resources/application.yml`.
