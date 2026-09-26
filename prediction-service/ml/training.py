import argparse

import pandas as pd
from pathlib import Path
from sklearn.model_selection import RepeatedKFold, cross_validate
from sklearn.linear_model import LinearRegression
import joblib

FEATURES = [
    "square_footage",
    "bedrooms",
    "bathrooms",
    "year_built",
    "lot_size",
    "distance_to_city_center",
    "school_rating",
]


K_FOLDS = RepeatedKFold(n_splits=5, n_repeats=20, random_state=42)

MODEL_FILENAME = "linear_regression.joblib"


def check_dataset_exists(dataset_path: str):

    path = Path(dataset_path)

    if not path.exists():
        raise FileNotFoundError(f"Training dataset file not found: {dataset_path}")

    return path


def check_output_dir(output_dir: str):

    if output_dir is None:
        path = Path(__file__).resolve().parent.parent / "artifacts"
    else:
        path = Path(output_dir)

    if not path.exists():
        print(f"Creating output directory: {path}")
        path.mkdir(parents=True, exist_ok=True)

    return path


def main(args):
    print("Loading dataset...")
    df = pd.read_csv(args.dataset, usecols=FEATURES + ["price"])
    print("Dataset loaded successfully!")

    X = df[FEATURES]
    y = df["price"]

    model = LinearRegression()

    result = cross_validate(
        model,
        X,
        y,
        cv=K_FOLDS,
        scoring={
            "r2": "r2",
            "mse": "neg_mean_squared_error",
        },
        return_train_score=True,
    )

    metrics = {
        "train_r2": {
            "mean": result["train_r2"].mean(),
            "std": result["train_r2"].std(),
        },
        "test_r2": {
            "mean": result["test_r2"].mean(),
            "std": result["test_r2"].std(),
        },
        "train_mse": {
            "mean": -result["train_mse"].mean(),
            "std": result["train_mse"].std(),
        },
        "test_mse": {
            "mean": -result["test_mse"].mean(),
            "std": result["test_mse"].std(),
        },
    }

    print("Cross-validation completed!")
    for name, values in metrics.items():
        print(f"{name}: " f"mean={values['mean']:.4f}, " f"std={values['std']:.4f}")

    print("Model training start...")

    model.fit(X, y)

    print("Model training completed!")

    print(args.output)

    model_path = args.output / MODEL_FILENAME

    artifact = {
        "model": model,
        "features": FEATURES,
        "metrics": metrics,
    }

    joblib.dump(
        artifact,
        model_path,
    )

    print(f"Model artifact saved to: {model_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Load and display dataset information."
    )

    parser.add_argument(
        "--dataset",
        type=check_dataset_exists,
        required=True,
    )
    parser.add_argument(
        "--output",
        type=check_output_dir,
        required=False,
        default=check_output_dir(None),
    )

    args = parser.parse_args()

    main(args)
