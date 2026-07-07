import os
import uuid
import time
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session
from app.api import deps
from app.core import security
from app.core.config import settings
from app.db.models.user import User

router = APIRouter()

# For MVP, we simulate S3 pre-signed URLs by creating a JWT-signed path
# In production, this would use boto3.client('s3').generate_presigned_url or GCS equivalent.

@router.get("/presigned-url")
def get_presigned_url(
    filename: str,
    content_type: str,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get a pre-signed URL for direct-to-storage uploads.
    """
    if not content_type.startswith("image/") and not content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="Invalid file type")
        
    file_id = str(uuid.uuid4())
    ext = filename.split(".")[-1]
    storage_key = f"incidents/{current_user.id}/{file_id}.{ext}"
    
    # Create a JWT token that acts as a pre-signed signature
    expires = time.time() + 3600 # 1 hour
    signature = security.create_access_token(
        subject=storage_key, expires_delta=None
    )
    
    # In a real setup, this would be an S3/GCS URL
    upload_url = f"/api/v1/uploads/direct?key={storage_key}&signature={signature}"
    
    return {
        "upload_url": upload_url,
        "storage_key": storage_key,
        "expires": expires
    }

@router.put("/direct")
def handle_direct_upload(
    key: str,
    signature: str,
    file: UploadFile = File(...),
) -> Any:
    """
    Mock endpoint simulating the S3 bucket receiving the file via pre-signed URL.
    """
    # Verify the signature
    try:
        from jose import jwt
        payload = jwt.decode(signature, settings.SECRET_KEY, algorithms=["HS256"])
        if payload.get("sub") != key:
            raise HTTPException(status_code=403, detail="Invalid signature key")
    except Exception:
        raise HTTPException(status_code=403, detail="Invalid or expired signature")
        
    # Save the file locally for MVP
    upload_dir = "/tmp/sentinel_uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, key.replace("/", "_"))
    
    with open(file_path, "wb") as f:
        f.write(file.file.read())
        
    return {"status": "success", "file_url": f"local://{file_path}"}
