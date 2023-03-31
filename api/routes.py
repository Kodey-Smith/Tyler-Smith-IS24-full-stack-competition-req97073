import datetime

from fastapi import APIRouter, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import Response, PlainTextResponse
from schemas import Product, ProductUpdate, NewProduct
from database import data as db
import database

# Create a new FastAPI router instance
router = APIRouter()


@router.get("/health", response_class=PlainTextResponse, tags=["Status"])
@router.get("/ping", response_class=PlainTextResponse, tags=["Status"])
async def ping() -> PlainTextResponse:
    """
    Returns "Pong!" if the API is healthy.
    """
    return PlainTextResponse(content="Pong!")  # Wasn't sure what to return here, so I went with plaintext "Pong!"


@router.get("/products",
            name="Search Products", tags=["Products"],
            response_description="Requested Products")
async def get_products_by_filters(product_name: str = None,
                                  product_owner_name: str = None,
                                  developer: str = None,
                                  scrum_master_name: str = None,
                                  start_date: datetime.date = None,
                                  methodology: str = None) -> list[Product]:
    """
    Get a list of products via search filters.
    """
    filters = {
        "productName": product_name,
        "productOwnerName": product_owner_name,
        "developers": developer,
        "scrumMasterName": scrum_master_name,
        "startDate": start_date,
        "methodology": methodology
    }

    def filter_products(product):
        for key, value in filters.items():
            if value is not None:
                if key == 'developers':  # Special handling for developers as they are in a list.
                    if value not in product[key]:
                        return False
                elif product[key] != value:
                    return False
        return True

    products = list(filter(filter_products, list(db.values())))
    return products


@router.get("/products/{product_id}",
            tags=["Products"],
            response_description="Requested Product")
async def get_product_by_id(product_id: int) -> Product:
    """
    Get a product by its productId.
    """
    product = db.get(str(product_id), None)
    if product:
        return product
    raise HTTPException(status_code=404, detail=f"Product with productId {product_id} not found!")


@router.put("/products",
            tags=["Products"],
            status_code=201,
            response_description="Created Product")
async def create_product(response: Response, product: NewProduct) -> Product:
    """
    Creates a new product with the given information.
    All fields are mandatory.
    """
    # Gets the last added product assuming it is the highest ID as ID is automatic, then adds one to it for a new ID
    latest_id = int(list(db)[-1]) + 1
    response.headers["Location"] = router.url_path_for("get_product_by_id", product_id=latest_id)

    new_product = jsonable_encoder(product)
    new_product["productId"] = latest_id
    db[str(latest_id)] = new_product
    await database.save_data()
    return new_product


@router.post("/products/{product_id}",
             tags=["Products"],
             response_description="Updated Product")
async def update_product_information(product_id: int, product: ProductUpdate) -> Product:
    """
    Updates a product with the given information.
    All fields are optional.
    """
    try:
        db[str(product_id)].update(jsonable_encoder(product))  # Update the product with new information
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Product with id {product_id} not found!")
    else:
        await database.save_data()
        return db[str(product_id)]


@router.delete("/products/{product_id}",
               tags=["Products"])
async def delete_product_by_id(product_id: int) -> Response:
    try:
        db.pop(str(product_id))  # Remove item with given ID
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Product with id {product_id} not found!")
    else:
        await database.save_data()
        return Response(status_code=200)
