from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os, json, tarfile, shutil
import zstandard as zstd
from datetime import datetime

app = FastAPI()
UPLOAD_DIR = "./data"
EXTRACT_DIR = "./data/extracted"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(EXTRACT_DIR, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def decompress_zst_tar(zst_path, extract_dir):
    temp_tar_path = zst_path.replace(".zst", "")
    # Decompress .zst to .tar
    with open(zst_path, 'rb') as zst_in, open(temp_tar_path, 'wb') as tar_out:
        dctx = zstd.ZstdDecompressor()
        dctx.copy_stream(zst_in, tar_out)

    # Extract tar archive
    with tarfile.open(temp_tar_path, 'r') as tar:
        tar.extractall(path=extract_dir)

    os.remove(temp_tar_path)

@app.post("/upload")
async def upload_spdx(file: UploadFile = File(...)):
    filename = f"{datetime.utcnow().isoformat()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    # Save the uploaded file
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Save the filename for later processing
    with open(os.path.join(UPLOAD_DIR, "latest_upload.txt"), "w") as f:
        f.write(filename)

    return {"status": "uploaded", "filename": filename}

@app.post("/process")
async def process_spdx():
    try:
        # Read latest uploaded filename
        with open(os.path.join(UPLOAD_DIR, "latest_upload.txt")) as f:
            latest_filename = f.read().strip()
            latest_file_path = os.path.join(UPLOAD_DIR, latest_filename)
    except Exception:
        return JSONResponse(status_code=400, content={"error": "No uploaded file found"})

    if not os.path.exists(latest_file_path):
        return JSONResponse(status_code=400, content={"error": "Uploaded file missing"})

    # Clear old extraction folder and extract new
    if os.path.exists(EXTRACT_DIR):
        shutil.rmtree(EXTRACT_DIR)
    os.makedirs(EXTRACT_DIR, exist_ok=True)

    decompress_zst_tar(latest_file_path, EXTRACT_DIR)

    return {"status": "processed", "filename": latest_filename}

@app.get("/packages")
def get_packages():
    json_files = [f for f in os.listdir(EXTRACT_DIR) if f.endswith(".json")]
    if not json_files:
        return JSONResponse(content={"created": None, "packages": []}, status_code=200)

    packages = []
    created_date = None

    for fname in sorted(json_files):
        with open(os.path.join(EXTRACT_DIR, fname)) as f:
            data = json.load(f)

        if not created_date:
            created_str = data.get("creationInfo", {}).get("created", None)
            if created_str:
                created_date = datetime.strptime(created_str, "%Y-%m-%dT%H:%M:%SZ")

        for pkg in data.get("packages", []):
            packages.append({
                "name": pkg.get("name"),
                "version": pkg.get("versionInfo"),
                "license": pkg.get("licenseDeclared"),
                "sha": pkg.get("checksumValue", []),
                "externalRefs": pkg.get("externalRefs", [])
            })

    return JSONResponse(content={
        "created": created_date.isoformat() if created_date else None,
        "packages": packages
    })

@app.get("/summary")
def get_summary():
    json_files = [f for f in os.listdir(EXTRACT_DIR) if f.endswith(".json")]
    total = 0
    for fname in json_files:
        with open(os.path.join(EXTRACT_DIR, fname)) as f:
            data = json.load(f)
            total += len(data.get("packages", []))
    return {"total_packages": total}
