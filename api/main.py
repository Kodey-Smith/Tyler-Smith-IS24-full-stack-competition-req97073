import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router

# OpenAPI tags
tags_metadata = [
    {
        "name": "Status",
        "description": "Check API status",
    },
    {
        "name": "Products",
        "description": "Create, Read, Update, and Delete product entries.",
    },
]

# Create fastapi instance
app = FastAPI(
    title="BC Web Application Manager",
    description="Backend API for my attempt at the IS 24 Full Stack Developer Posting",
    version="0.0.1",
    docs_url="/api/api-docs",
    redoc_url="/api/redoc",
    contact={
        "name": "Tyler Smith",
        "email": "tylerkodey@me.com",
    },
    openapi_tags=tags_metadata
)


# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow the frontend to access the backend.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add the routes from the router in routes.py
app.include_router(router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run(app, port=3000)  # run uvicorn on port 3000.
