"""Backend Model-First Database management with schema models."""
import sqlalchemy.dialects.mysql.pymysql
import sqlalchemy
from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
    create_engine,
    text,
    Sequence,
    DateTime,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy_utils import create_database, database_exists, drop_database


USER = "devweb_user_admin_olivia"
PASSWORD = "tutu"
HOST = "localhost"
PORT = "5432"

# Base de données
Base = declarative_base()

class Partie_a_deuxDB(Base):
    __tablename__ = 'parties_a_deux'
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_emetteur= Column(Integer, unique=False, nullable=False)
    id_receveur= Column(Integer, unique=False, nullable=False)
    score_receveur = Column(Integer, nullable=True)
    score_emetteur = Column(Integer, nullable=True)
    seed = Column(Integer, nullable=True)


class UserDB(Base):
    
    __tablename__ = 'users' 
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email= Column(String)
    motdepasse = Column(String, nullable=False)
    scoreMax = Column(Integer, nullable=True)
    

class NotifDB(Base):
    __tablename__ = 'notifs'
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_receveur = Column(Integer, unique=False, index=True, nullable=False)
    id_opposant = Column(Integer, unique=False, index=True, nullable=False)
    gagnant = Column(Boolean, unique=False, index=True, nullable=False)




# class MultiplayerScore(BaseModel):
#     user_id = Column(String, unique=True, index=True, nullable=False)
#     score = Column(String, unique=True, index=True, nullable=False)

from sqlalchemy import text

class database_management:
    def __init__(self, db_name: str, recreate: bool):
        self.engine = create_engine(
            f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{db_name}"
        )
        self.db_name = db_name

        if recreate:
            if database_exists(self.engine.url):
                drop_database(self.engine.url)
                print(f"Database {self.db_name} dropped!")

        if not database_exists(self.engine.url):
            self.create_db()

        self.check_and_create_tables()

    def create_db(self):
        create_database(self.engine.url)
        print(f"Database {self.db_name} created!")

    def check_and_create_tables(self):
        inspector = sqlalchemy.inspect(self.engine)
        tables_to_check = ["users", "parties_a_deux", "notifs"]

        tables_missing = [table for table in tables_to_check if not inspector.has_table(table)]
        
        if tables_missing:
            self.create_tables()
            print(f"Tables {', '.join(tables_missing)} created successfully!")
        else:
            print("All necessary tables already exist.")

    def create_tables(self):
        Base.metadata.create_all(self.engine)
        with self.engine.connect() as conn:
            conn.execute(text("CREATE SEQUENCE IF NOT EXISTS parties_a_deux_id_seq"))
            conn.execute(text("CREATE SEQUENCE IF NOT EXISTS user_id_seq"))
            conn.execute(text("CREATE SEQUENCE IF NOT EXISTS notif_id_seq"))
            print("Sequences created successfully!")

    def drop_table(self, table_name: str):
        with self.engine.connect() as conn:
            conn.execute(text(f"DROP TABLE IF EXISTS {table_name} CASCADE"))
            print(f"Table {table_name} dropped successfully!")

    def recreate_table(self, table_name: str):
        self.drop_table(table_name)
        self.create_tables()

