from fastapi import APIRouter, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import Response
from pydantic import BaseModel
from uuid import UUID

import database
from database import data as db
import datetime

router = APIRouter()


class NewProduct(BaseModel):
    productName: str
    productOwnerName: str
    developers: list[str]
    scrumMasterName: str
    startDate: datetime.date
    methodology: str


class Product(NewProduct):
    productId: int


class ProductUpdate(NewProduct):
    productName: str | None = None
    productOwnerName: str | None = None
    developers: list[str] | None = None
    scrumMasterName: str | None = None
    startDate: datetime.date | None = None
    methodology: str | None = None


@router.get("/health")
@router.get("/ping")
async def ping():
    """
    Returns "Pong!" if the API is healthy.
    """
    return Response(content="Pong!", media_type="text/plain")


@router.get("/product/{product_id}",
            response_description="Requested Product")
async def get_product_by_id(product_id: int) -> dict:  # Get a product given its ID and return all information
    """
    Get a product by its productId.

    **product_id**: Desired product's numerical identifier.
    """
    product = db.get(str(product_id), None)
    if product:
        return product
    raise HTTPException(status_code=404, detail=f"Product with id {product_id} not found!")


@router.put("/product",
            status_code=201,
            response_description="Product Created")
async def create_product(product: NewProduct) -> dict:
    """
    Creates a new product.
    All fields are mandatory.

    **productName**: The name of the product.
    **productOwnerName**: The name of the product owner.
    **developers**: A list of developers working on the product.
    **scrumMasterName**: The scrum master assigned to the product
    **startDate**: The product's start date (YYYY-MM-DD)
    **methodology**: The product's development methodology (Agile or Waterfall)
    """
    new_product = jsonable_encoder(product)
    new_product["productId"] = int(list(db)[-1]) + 1
    db.append(new_product)
    # await database.save_data()
    return new_product


@router.post("/product/{product_id}",
             response_description="Product Updated")
async def update_product_information(product_id, product: ProductUpdate) -> dict:
    """
    Updates a product's information.
    All fields are optional.

    **productName**: The name of the product.
    **productOwnerName**: The name of the product owner.
    **developers**: A list of developers working on the product.
    **scrumMasterName**: The scrum master assigned to the product
    **startDate**: The product's start date (YYYY-MM-DD)
    **methodology**: The product's development methodology (Agile or Waterfall)
    """
    db[str(product_id)].update(jsonable_encoder(product))
    # await database.save_data()
    return db[str(product_id)]
