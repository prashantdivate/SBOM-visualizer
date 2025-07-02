from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os, json
from datetime import datetime

app = FastAPI()
UPLOAD_DIR = "./data"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_spdx(file: UploadFile = File(...)):
    filename = f"{datetime.utcnow().isoformat()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    return {"status": "uploaded", "filename": filename}

@app.get("/packages")
def get_packages():
    files = sorted(os.listdir(UPLOAD_DIR))
    if not files:
        return JSONResponse(content={"created": None, "packages": []}, status_code=200)

    with open(os.path.join(UPLOAD_DIR, files[-1])) as f:
        data = json.load(f)

    # Parse the created date
    created_str = data.get("creationInfo", {}).get("created", None)
    created_date = None
    print("Created_str:", created_str)

    if created_str:
        created_date = datetime.strptime(created_str, "%Y-%m-%dT%H:%M:%SZ")

    packages = []
    for pkg in data.get("packages", []):
        packages.append({
            "name": pkg.get("name"),
            "version": pkg.get("versionInfo"),
            "license": pkg.get("licenseConcluded"),
            "sha": pkg.get("checksumValue", []),
            "externalRefs": pkg.get("externalRefs", [])
        })

    print("Created:", created_date)
    print("Returning:", {
        "created": created_date.isoformat() if created_date else None,
        "packages": packages
    })

    return JSONResponse(content={
        "created": created_date.isoformat() if created_date else None,
        "packages": packages
    })

@app.get("/summary")
def get_summary():
    files = sorted(os.listdir(UPLOAD_DIR))
    if not files:
        return {"total_packages": 0}

    with open(os.path.join(UPLOAD_DIR, files[-1])) as f:
        data = json.load(f)
    return {"total_packages": len(data.get("packages", []))}
