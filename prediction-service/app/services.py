import logging

import joblib
import pandas as pd

from app.schemas import HouseFeatureData, ModelInfoResponse, PredictionResponse

logger = logging.getLogger(__name__)


class ModelService:

    def __init__(self, model_path):
        lib = joblib.load(model_path)

        self.model = lib["model"]
        self.features = lib["features"]
        self.metrics: dict[str, dict[str, float]] = {}

        for name, values in lib["metrics"].items():
            self.metrics[name] = {}
            for metric_name, metric_value in values.items():
                self.metrics[name][metric_name] = float(metric_value)

    def predict(
        self, data: HouseFeatureData | list[HouseFeatureData]
    ) -> PredictionResponse:
        logger.info("Input data: %s", data)
        records = data if isinstance(data, list) else [data]

        dataframe = pd.DataFrame.from_records(
            [record.model_dump() for record in records],
            columns=self.features,
        )

        raw_predictions = self.model.predict(dataframe)
        predictions = [float(value) for value in raw_predictions]

        # add feature contributions
        raw_contributions = dataframe.mul(self.model.coef_, axis="columns")
        contributions = [
            {feature: float(row[feature]) for feature in self.features}
            for _, row in raw_contributions.iterrows()
        ]

        return PredictionResponse(
            predictions=predictions,
            base_value=float(self.model.intercept_),
            contributions=contributions,
        )

    def get_model_info(self) -> ModelInfoResponse:
        coefficients = getattr(self.model, "coef_", None)
        intercept = getattr(self.model, "intercept_", None)
        return ModelInfoResponse(
            intercept=float(intercept),
            coefficients={
                feature: float(coefficient)
                for feature, coefficient in zip(
                    self.features,
                    coefficients,
                    strict=True,
                )
            },
            metrics=self.metrics,
            features=self.features,
        )
