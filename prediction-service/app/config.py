import os
from pathlib import Path

SERVICE_DIR = Path(__file__).resolve().parent.parent
REPOSITORY_ROOT = SERVICE_DIR.parent

DATA_DIR = Path(os.environ.get("DATA_DIR", REPOSITORY_ROOT / "data")).resolve()

MODEL_DIR = Path(os.environ.get("MODEL_DIR", SERVICE_DIR / "artifacts")).resolve()

MODEL_FILENAME = os.environ.get("MODEL_FILENAME", "linear_regression.joblib")
