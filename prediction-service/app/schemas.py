from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class HealthStatus(StrEnum):
    READY = "ready"
    PENDING = "pending"
    ERROR = "error"


class HouseFeatureData(BaseModel):
    """house feature data structure"""

    model_config = ConfigDict(extra="forbid")

    square_footage: int = Field(ge=0)
    bedrooms: int = Field(ge=0)
    bathrooms: float = Field(ge=0)
    year_built: int = Field(le=datetime.now().year)
    lot_size: int = Field(ge=0)
    distance_to_city_center: float = Field(ge=0)
    school_rating: float = Field(ge=0, le=10)


class PredictionRequest(BaseModel):
    """prediction request data structure, both single and batch numbers are supported"""

    model_config = ConfigDict(extra="forbid")

    data: HouseFeatureData | list[HouseFeatureData]


class PredictionResponse(BaseModel):
    """prediction response data structure, returns a list of predictions for each input data point"""

    predictions: list[float]


class HealthResponse(BaseModel):
    """health response data structure, returns the current health status of the service"""

    # todo maybe add more information
    status: HealthStatus


class ModelInfoResponse(BaseModel):
    """model info response data structure, returns model performance metrics and features"""

    intercept: float
    coefficients: dict[str, float]
    metrics: dict[str, dict[str, float]]
    features: list[str]
