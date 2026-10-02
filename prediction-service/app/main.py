import logging
import os
from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Body, Depends, FastAPI, Request, Response, status

from app.config import MODEL_DIR, MODEL_FILENAME
from app.schemas import (
    HealthResponse,
    HealthStatus,
    ModelInfoResponse,
    PredictionRequest,
    PredictionResponse,
)
from app.services import ModelService

LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO").upper()

logging.basicConfig(
    level=LOG_LEVEL,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)


logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up the application")

    app.state.model_service = None
    app.state.health_status = HealthStatus.PENDING

    model_path = MODEL_DIR / MODEL_FILENAME

    try:
        app.state.model_service = ModelService(model_path=model_path)
        app.state.health_status = HealthStatus.READY

        logger.info("Model loaded from %s", model_path)
    except Exception:
        app.state.health_status = HealthStatus.ERROR

        logger.exception(
            "Unable to load model from %s",
            model_path,
        )

    yield

    app.state.model_service = None
    logger.info("Shutting down the application")


app = FastAPI(title="Prediction Service", lifespan=lifespan)


def get_model_service(request: Request) -> ModelService:
    return request.app.state.model_service


@app.get("/model-info", response_model=ModelInfoResponse)
def model_info(
    model_service: Annotated[ModelService, Depends(get_model_service)],
) -> ModelInfoResponse:
    return model_service.get_model_info()


@app.post("/predict", response_model=PredictionResponse)
def predict(
    request: Annotated[
        PredictionRequest,
        Body(
            openapi_examples={
                "single": {
                    "summary": "Single prediction",
                    "value": {
                        "data": {
                            "square_footage": 1550,
                            "bedrooms": 3,
                            "bathrooms": 2,
                            "year_built": 1997,
                            "lot_size": 6800,
                            "distance_to_city_center": 4.1,
                            "school_rating": 7.6,
                        }
                    },
                },
                "batch": {
                    "summary": "Batch prediction",
                    "value": {
                        "data": [
                            {
                                "square_footage": 1550,
                                "bedrooms": 3,
                                "bathrooms": 2,
                                "year_built": 1997,
                                "lot_size": 6800,
                                "distance_to_city_center": 4.1,
                                "school_rating": 7.6,
                            },
                            {
                                "square_footage": 2200,
                                "bedrooms": 4,
                                "bathrooms": 2.5,
                                "year_built": 2008,
                                "lot_size": 9600,
                                "distance_to_city_center": 7.0,
                                "school_rating": 8.8,
                            },
                        ]
                    },
                },
            }
        ),
    ],
    model_service: Annotated[ModelService, Depends(get_model_service)],
) -> PredictionResponse:
    return model_service.predict(request.data)


@app.get("/health", response_model=HealthResponse)
def health(
    request: Request,
    response: Response,
) -> HealthResponse:
    health_status = request.app.state.health_status

    if health_status is not HealthStatus.READY:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    return HealthResponse(status=health_status)
