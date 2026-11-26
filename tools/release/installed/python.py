import os
from pathlib import Path

from himring import Himring

with Himring(base_url=os.environ["HIMRING_API_URL"]) as client:
    deployed = {op["id"] for op in client.list_operations()["operations"]}
    for operation in Path("operations.txt").read_text().splitlines():
        if operation not in deployed or not callable(getattr(client, operation, None)):
            raise ValueError(f"Missing operation {operation}")
