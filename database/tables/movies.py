from datetime import datetime

from sqlalchemy.schema import Column, Table
from sqlalchemy.types import DateTime, Integer, String

from database import metadata


Movies = Table(
    'movies',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('title', String(255), nullable=False),
    Column('plot', String(750), nullable=False),
    Column('watch_on', String(100), nullable=False),
    Column('released_at', DateTime, nullable=False),
    Column('created_at', DateTime, default=datetime.now(), nullable=False),
    Column('updated_at', DateTime, default=datetime.now(), onupdate=datetime.now(), nullable=False)
)
