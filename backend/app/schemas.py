from datetime import datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field

Status = Literal["NUEVO", "ASIGNADO", "EN_PROCESO", "RESUELTO", "CERRADO"]
Priority = Literal["BAJA", "MEDIA", "ALTA", "CRITICA"]

class CommentCreate(BaseModel):
    author: str = Field(min_length=1, max_length=120)
    comment: str = Field(min_length=1, max_length=3000)

class CommentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    incident_id: int
    author: str
    comment: str
    created_at: datetime

class IncidentCreate(BaseModel):
    title: str = Field(min_length=3, max_length=160)
    description: str = Field(min_length=3, max_length=5000)
    category: str = Field(min_length=2, max_length=80)
    priority: Priority = "MEDIA"
    reported_by: str = Field(min_length=1, max_length=120)
    assigned_to: str | None = Field(default=None, max_length=120)

class IncidentUpdate(BaseModel):
    status: Status | None = None
    assigned_to: str | None = Field(default=None, max_length=120)

class IncidentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str
    category: str
    priority: Priority
    reported_by: str
    assigned_to: str | None
    status: Status
    created_at: datetime

class IncidentDetail(IncidentOut):
    comments: list[CommentOut] = []
