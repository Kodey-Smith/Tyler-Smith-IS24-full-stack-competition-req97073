import json
import aiofiles
import os


with open(os.path.dirname(__file__) + "\\data.json", "r") as f:
    data = json.load(f)


async def load_data():
    global data
    async with aiofiles.open(os.path.dirname(__file__) + "\\data.json", "r") as f:
        contents = await f.read()
    data = json.loads(contents)


async def save_data():
    contents = json.dumps(data)
    async with aiofiles.open(os.path.dirname(__file__) + "\\data.json", "w") as f:
        await f.write(contents)
    print("saved")
