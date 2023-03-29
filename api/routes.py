import datetime

from fastapi import APIRouter, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import Response, PlainTextResponse
from schemas import Product, ProductUpdate, NewProduct, ProductSearch
from database import data as db

router = APIRouter()


@router.get("/health", response_class=PlainTextResponse, tags=["Status"])
@router.get("/ping", response_class=PlainTextResponse, tags=["Status"])
async def ping() -> PlainTextResponse:
    """
    Returns "Pong!" if the API is healthy.
    """
    return PlainTextResponse(content="Pong!")


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
    def search_filter(product):
        if product_name is not None and product_name != product["productName"]:
            return False
        elif product_owner_name is not None and product_owner_name != product["productOwnerName"]:
            return False
        elif developer is not None and developer != product["developer"]:
            return False
        elif scrum_master_name is not None and scrum_master_name != product["scrumMasterName"]:
            return False
        elif str(start_date) is not None and str(start_date) != product["startDate"]:
            return False
        elif methodology is not None and methodology != product["methodology"]:
            return False
        return True

    products = list(filter(search_filter, list(db.values())))
    if len(products) > 0:
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


@router.put("/product",
            tags=["Products"],
            status_code=201,
            response_description="Created Product")
async def create_product(response: Response, product: NewProduct) -> Product:
    """
    Creates a new product with the given information.
    All fields are mandatory.
    """
    new_id = int(list(db)[-1]) + 1
    response.headers["Location"] = router.url_path_for("get_product_by_id", product_id=new_id)
    new_product = jsonable_encoder(product)
    new_product["productId"] = new_id
    db[str(new_id)] = new_product
    # await database.save_data()
    return new_product


@router.post("/products/{product_id}",
             tags=["Products"],
             response_description="Updated Product")
async def update_product_information(product_id: int, product: ProductUpdate) -> Product:
    """
    Updates a product with the given information.
    All fields are optional.
    """
    db[str(product_id)].update(jsonable_encoder(product))
    # await database.save_data()
    return db[str(product_id)]


@router.delete("/products/{product_id}",
               tags=["Products"])
async def delete_product_by_id(product_id: int) -> Response:
    try:
        db.pop(str(product_id))
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Product with id {product_id} not found!")
    else:
        return Response(status_code=200)
