# imb-full-stack-challenge
My attempt at the code challenge for IS 24 Full Stack Developer Posting


# Setup instructions
Ensure python 3.10+ is installed on your local machine. you can get python from the following locations:
 - The official website https://www.python.org/downloads/
 - your distro's package manager
 
Clone the repo or download source and unzip
``cd`` into the downloaded repo, and run ``pip install -r ./api/requirements.txt``, you may need to use ``pip3`` or ``python3 -m pip`` in place of ``pip``, depending on your OS/Repo/Install method
``cd frontend`` and run:
 - for production: ``gatsby build && gatsby serve``
 - for development: ``gatsby develop``

Open a new terminal/command prompt, ``cd`` to the downloaded repo and then ``cd api``, then run ``python main.py`` (You may need to use ``python3`` in place of ``python``

You should now be able to access api documentation at:
 - Swagger: http://localhost:3000/api/api-docs
 - Redoc: http://localhost:3000/api/redoc
 - OpenAPI: http://localhost:3000/openapi.json

You can access the frontend at:
 - Production: http://localhost:9000/
 - Development: http://localhost:8000/

Should you want to access the sample JSON data, it is stored in ``api/database/data.json``
 
