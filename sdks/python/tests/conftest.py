from __future__ import annotations

from collections.abc import Iterator

import pytest

from himring import Himring

from .contract_api import ContractApi
from .stand_in_server import StandInServer

API_KEY = "hk_test_python_sdk"
PROJECT_ID = "prj_" + "1" * 32
KNOWLEDGE_BASE_ID = "kb_" + "2" * 32


@pytest.fixture(scope="session")
def contract_server() -> Iterator[ContractApi]:
    server = ContractApi()
    try:
        yield server
    finally:
        server.stop()


@pytest.fixture
def contract(contract_server: ContractApi) -> ContractApi:
    contract_server.reset()
    return contract_server


@pytest.fixture
def himring(contract: ContractApi) -> Iterator[Himring]:
    with Himring(api_key=API_KEY, base_url=contract.base_url) as client:
        yield client


@pytest.fixture
def stand_in() -> Iterator[StandInServer]:
    server = StandInServer()
    try:
        yield server
    finally:
        server.stop()


@pytest.fixture
def storage() -> Iterator[StandInServer]:
    server = StandInServer()
    try:
        yield server
    finally:
        server.stop()
