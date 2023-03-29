from pydantic import BaseModel
import datetime


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


class ProductSearch(ProductUpdate):
    productId: int
