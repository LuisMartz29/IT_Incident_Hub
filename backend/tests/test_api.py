
import os

os.environ["DATABASE_URL"] = "sqlite:///./test_incident_hub.db"

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_list_incidents():
    response = client.get("/incidents")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_and_list_incident():
    payload = {
        "title": "No hay conexión de red",
        "description": "La computadora no logra conectarse a Internet.",
        "category": "Redes",
        "priority": "ALTA",
        "reported_by": "Usuario de prueba"
    }

    created = client.post("/incidents", json=payload)

    assert created.status_code == 201

    data = created.json()

    assert data["title"] == payload["title"]
    assert data["status"] == "NUEVO"

    listed = client.get("/incidents")

    assert listed.status_code == 200
    assert any(
        item["id"] == data["id"]
        for item in listed.json()
    )


def test_create_incident_without_title():
    payload = {
        "description": "Incidente de prueba sin título",
        "category": "Redes",
        "priority": "ALTA",
        "reported_by": "Usuario de prueba"
    }

    response = client.post("/incidents", json=payload)

    assert response.status_code in (400, 422)
