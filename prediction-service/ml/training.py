import argparse

import pandas as pd
from pathlib import Path
from sklearn.model_selection import RepeatedKFold, cross_validate
from sklearn.linear_model import LinearRegression

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


def check_dataset_exists(dataset_path: str):

    path = Path(dataset_path)

    if not path.exists():
        raise FileNotFoundError(f"Training dataset file not found: {dataset_path}")

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
    
    print("Train R2:", result["train_r2"].mean())
    print("Test R2:", result["test_r2"].mean())

    print("Train MSE:", -result["train_mse"].mean())
    print("Test MSE:", -result["test_mse"].mean())

    model.fit(X, y)


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
        type=Path,
        required=False,
    )

    args = parser.parse_args()

    main(args)
