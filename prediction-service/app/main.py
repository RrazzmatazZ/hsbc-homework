from fastapi import FastAPI

app = FastAPI(title="Prediction Service")


@app.get("/")
def hello_world() -> dict[str, str]:
    return {"message": "Hello World"}
