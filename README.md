
# imb-full-stack-challenge
My attempt at the code challenge for IS 24 Full Stack Developer Posting


# Setup instructions
Ensure python 3.10+ is installed on your local machine. you can get python from the following locations:
 - The official website https://www.python.org/downloads/
 - your distro's package manager
 
Open a terminal and navigate to the directory you wish to download the project to, then run the following commands:
 - ``git clone https://github.com/Kodey-Smith/Tyler-Smith-IS24-full-stack-competition-req97073``
 - ``cd Tyler-Smith-IS24-full-stack-competition-req97073``
 - ``pip install -r ./api/requirements.txt`` NOTE: you may need to use ``pip3`` or ``python3 -m pip`` in place of ``pip``, depending on your OS/Repo/Install method
 - ``cd frontend``
 - ``npm install``
 - for production: ``gatsby build && gatsby serve``, or for development: ``gatsby develop``

Open a new terminal/command prompt, ``cd`` back to the downloaded repo and run:
 - ``cd api``
 - ``python main.py`` (You may need to use ``python3`` in place of ``python``)

You should now be able to access api documentation in your web browser at:
 - Swagger: http://localhost:3000/api/api-docs
 - Redoc: http://localhost:3000/api/redoc
 - OpenAPI: http://localhost:3000/openapi.json

You can access the frontend in the same way at:
 - Production: http://localhost:9000/
 - Development: http://localhost:8000/

Should you want to access the sample JSON data, it is stored in ``api/database/data.json``
 
