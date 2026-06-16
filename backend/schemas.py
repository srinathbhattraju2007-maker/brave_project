from pydantic import BaseModel, ConfigDict
from typing import Optional

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    slug: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


# Product Schemas
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    default_price: Optional[str] = None
    in_stock: bool = True

class ProductCreate(ProductBase):
    category_id: int

class Product(ProductBase):
    id: int
    category_id: int
    category: Optional[Category] = None

    model_config = ConfigDict(from_attributes=True)

class AdminLogin(BaseModel):
    password: str
