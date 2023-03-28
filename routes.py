from fastapi import APIRouter, HTTPException
from database import data as db

router = APIRouter()


@router.get("/")
async def read_root():
    return {"Hello": "World"}


@router.get("/product/{product_id}")
async def read_item(product_id: int):
    if len(db) > product_id >= 0:
        return db[product_id]
    raise HTTPException(status_code=404, detail=f"Product with id {product_id} not found!")
