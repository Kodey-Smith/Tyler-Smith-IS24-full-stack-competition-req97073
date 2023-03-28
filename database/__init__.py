import json
import aiofiles


with open("data.json", "r") as f:
    data = json.load(f)


async def load_data():
    global data
    with aiofiles.open("data.json", "r") as f:
        data = json.load(f)


async def save_data():
    with aiofiles.open("data.json", "w") as f:
        json.dump(data, f)
