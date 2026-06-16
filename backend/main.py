import re
from typing import List, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
from database import Base, engine, SessionLocal, get_db

# Helper function to generate clean slugs from category names
def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text

# Complete Seed Inventory Data representing the 30 clean retail domains
SEED_DATA = {
    "Grains & Cereals": ["Rice (all varieties)", "Wheat", "Atta (whole wheat flour)", "Maida", "Suji/Rava", "Poha", "Vermicelli", "Oats", "Corn flour", "Millet products (jowar, bajra, ragi)"],
    "Pulses & Lentils": ["Toor dal", "Moong dal", "Urad dal", "Chana dal", "Masoor dal", "Rajma", "Kabuli chana", "Black chana", "Green gram", "Peas"],
    "Spices & Seasonings": ["Turmeric", "Red chili powder", "Coriander powder", "Cumin seeds", "Mustard seeds", "Fenugreek", "Garam masala", "Pepper", "Cardamom", "Cloves", "Cinnamon", "Bay leaves", "Asafoetida (hing)", "Curry powder", "Chaat masala", "Rock salt", "Table salt"],
    "Cooking Oils & Fats": ["Sunflower oil", "Groundnut oil", "Mustard oil", "Coconut oil", "Rice bran oil", "Palm oil", "Ghee", "Butter", "Vanaspati"],
    "Sugar & Sweeteners": ["Sugar", "Jaggery", "Brown sugar", "Mishri", "Honey", "Artificial sweeteners"],
    "Dry Fruits & Nuts": ["Almonds", "Cashews", "Pistachios", "Walnuts", "Raisins", "Dates", "Figs", "Peanuts"],
    "Baking Supplies": ["Baking powder", "Baking soda", "Yeast", "Cocoa powder", "Vanilla essence", "Custard powder", "Food colors"],
    "Sauces & Condiments": ["Tomato ketchup", "Soy sauce", "Vinegar", "Chili sauce", "Green chutney", "Tamarind paste", "Mayonnaise", "Mustard sauce"],
    "Pickles & Preserves": ["Mango pickle", "Lemon pickle", "Mixed pickle", "Fruit jams", "Marmalades"],
    "Tea, Coffee & Beverages": ["Tea leaves", "Tea bags", "Instant coffee", "Filter coffee", "Health drinks", "Fruit syrups", "Soft drinks", "Packaged juices"],
    "Dairy Products": ["Milk", "Curd", "Paneer", "Butter", "Cheese", "Cream", "Flavored milk"],
    "Breakfast Foods": ["Corn flakes", "Muesli", "Chocos", "Oats", "Bread", "Peanut butter", "Jam"],
    "Snacks & Namkeen": ["Chips", "Mixtures", "Murukku", "Bhujia", "Sev", "Khakra", "Popcorn", "Roasted nuts"],
    "Biscuits & Cookies": ["Glucose biscuits", "Cream biscuits", "Cookies", "Crackers", "Rusks"],
    "Chocolates & Confectionery": ["Chocolates", "Candies", "Toffees", "Chewing gum", "Lollipops", "Mints"],
    "Instant Foods": ["Instant noodles", "Pasta", "Macaroni", "Ready-to-cook mixes", "Soup packets", "Frozen snacks"],
    "Baby Care": ["Baby food", "Infant formula", "Baby cereal", "Diapers", "Baby wipes", "Baby soap", "Baby oil"],
    "Personal Care": ["Soap", "Shampoo", "Conditioner", "Toothpaste", "Toothbrush", "Face wash", "Talcum powder", "Deodorant", "Shaving cream", "Razors", "Hair oil", "Hair color"],
    "Feminine Hygiene": ["Sanitary pads", "Tampons", "Panty liners", "Menstrual cups"],
    "Health & OTC Products": ["Bandages", "Cotton", "Antiseptic liquid", "Pain relief balms", "ORS packets", "Thermometers", "Basic first-aid items"],
    "Laundry Products": ["Detergent powder", "Liquid detergent", "Fabric conditioner", "Stain removers", "Laundry bars"],
    "Cleaning Supplies": ["Floor cleaner", "Toilet cleaner", "Dishwash liquid", "Dishwash bars", "Glass cleaner", "Surface cleaner", "Bleaching powder"],
    "Household Consumables": ["Garbage bags", "Aluminium foil", "Cling wrap", "Tissue paper", "Paper napkins", "Kitchen towels", "Matchboxes", "Candles"],
    "Kitchen Essentials": ["Papad", "Fryums", "Coconut powder", "Tamarind", "Saffron", "Ready masalas", "Soup mixes"],
    "Fresh Produce": ["Fruits", "Vegetables", "Herbs", "Ginger", "Garlic", "Green chilies"],
    "Frozen Foods": ["Frozen peas", "Frozen corn", "Frozen parathas", "Frozen snacks", "Ice cream"],
    "Pet Supplies": ["Dog food", "Cat food", "Pet treats"],
    "Stationery & Utility Items": ["Pens", "Pencils", "Notebooks", "Batteries", "Adhesives", "Envelopes"],
    "Religious & Festival Items": ["Agarbatti", "Camphor", "Diyas", "Cotton wicks", "Puja oil", "Kumkum", "Turmeric packets"],
    "Miscellaneous Household Items": ["Buckets", "Mugs", "Brooms", "Mops", "Scrubbers", "Clothes clips", "Storage containers"]
}

def seed_database(db: Session):
    # Verify if database has already been seeded to avoid duplicates
    if db.query(models.Category).first() is not None:
        print("Database already seeded. Skipping...")
        return
        
    print("Database is empty. Initiating seeding for 30 retail domains...")
    for category_name, product_list in SEED_DATA.items():
        # Create category
        category = models.Category(
            name=category_name,
            slug=slugify(category_name)
        )
        db.add(category)
        db.flush()  # Obtain the category.id
        
        # Add corresponding seed products
        for prod_name in product_list:
            product = models.Product(
                category_id=category.id,
                name=prod_name,
                description=f"Fresh and high-quality {prod_name.lower()} available at Naga Pavan Kirana and General Merchants.",
                default_price="Market Price",
                in_stock=True
            )
            db.add(product)
            
    db.commit()
    print("Seeding completed successfully.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on app startup
    Base.metadata.create_all(bind=engine)
    # Seed categories and products
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

# Initialize FastAPI with metadata for swagger/redoc documentation
app = FastAPI(
    title="Naga Pavan Kirana and General Merchants - Showcase API",
    description="Backend API for inventory visibility, catalog search, and retail stock management.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for communication with frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API ROUTES ---

@app.get("/api/categories", response_model=List[schemas.Category])
async def get_categories(db: Session = Depends(get_db)):
    """Fetch all available inventory categories."""
    categories = db.query(models.Category).order_by(models.Category.name).all()
    return categories

@app.get("/api/products", response_model=List[schemas.Product])
async def get_products(category_id: Optional[int] = None, db: Session = Depends(get_db)):
    """
    Fetch all products. 
    Supports optional category filtering via query string `?category_id=`.
    """
    query = db.query(models.Product)
    if category_id is not None:
        query = query.filter(models.Product.category_id == category_id)
    return query.order_by(models.Product.name).all()

@app.get("/api/search", response_model=List[schemas.Product])
async def search_products(query: str, db: Session = Depends(get_db)):
    """
    Perform a real-time, case-insensitive substring database lookup 
    across product name and description fields.
    """
    if not query.strip():
        return []
    
    search_pattern = f"%{query}%"
    results = db.query(models.Product).filter(
        (models.Product.name.ilike(search_pattern)) |
        (models.Product.description.ilike(search_pattern))
    ).order_by(models.Product.name).all()
    
    return results

@app.post("/api/products", response_model=schemas.Product, status_code=status.HTTP_201_CREATED)
async def create_product(product_in: schemas.ProductCreate, db: Session = Depends(get_db)):
    """Insert new retail coordinates / product entry validated via Pydantic schema."""
    # Check if the associated category exists
    category = db.query(models.Category).filter(models.Category.id == product_in.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Category with ID {product_in.category_id} does not exist."
        )
        
    db_product = models.Product(
        category_id=product_in.category_id,
        name=product_in.name,
        description=product_in.description,
        default_price=product_in.default_price,
        in_stock=product_in.in_stock
    )
    
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.delete("/api/products/{id}", status_code=status.HTTP_200_OK)
async def delete_product(id: int, db: Session = Depends(get_db)):
    """Cleanly remove an explicit product record matching the primary index coordinate."""
    product = db.query(models.Product).filter(models.Product.id == id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {id} not found."
        )
    
    db.delete(product)
    db.commit()
    return {"detail": f"Product with ID {id} has been successfully deleted."}

@app.post("/api/auth/login")
async def admin_login(payload: schemas.AdminLogin):
    """Validate admin password and return a session token."""
    if payload.password == "nagapavan123":
        return {"token": "nagapavan_admin_secret_token", "role": "admin"}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials. Access Denied."
    )

@app.patch("/api/products/{id}/toggle-stock", response_model=schemas.Product)
async def toggle_product_stock(id: int, db: Session = Depends(get_db)):
    """Instantly toggle the stock availability state (in_stock) of a product."""
    product = db.query(models.Product).filter(models.Product.id == id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {id} not found."
        )
    
    product.in_stock = not product.in_stock
    db.commit()
    db.refresh(product)
    return product
