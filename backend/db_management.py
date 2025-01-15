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


USER = "devweb_user_admin"
PASSWORD = "lala"
HOST = "localhost"
PORT = "5432"

# Base de données
# DATABASE_URL = "sqlite:///./test.db"  # Utilisation d'une base de données SQLite pour l'exemple
Base = declarative_base()

class PartieDB(Base):
    __tablename__ = 'parties'
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)  # Ajout de autoincrement=True    id_emetteur = Column(Integer, unique=False, nullable=False)
    id_receveur= Column(Integer, unique=False, nullable=False)
    score_receveur = Column(Integer, nullable=True)
    score_emetteur = Column(Integer, nullable=True)
    seed = Column(Integer, nullable=True)
# Modèle de la table User
class UserDB(Base):
    
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email= Column(String)
    motdepasse = Column(String, nullable=False)
    scoreMax = Column(Integer, nullable=True)
    
    # Modèle de la table Partie

    #notification, id notif, id reception, id opposant,
class NotificationDB(Base):
    __tablename__ = 'notifications'
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_receveur = Column(String, unique=True, index=True, nullable=False)
    id_opposant = Column(String, unique=True, index=True, nullable=False)
    gagnant = Column(String, unique=True, index=True, nullable=False)

# Modèle de la table PartieAmis
# class PartieAmisDB(Base):
#     __tablename__ = 'partie_amis'
#     id_partie = Column(Integer, primary_key=True, index=True)
#     idUser1 = Column(Integer, ForeignKey('users.id'), nullable=False)
#     idUser2 = Column(Integer, ForeignKey('users.id'), nullable=False)
#     pointsUser1 = Column(Integer, nullable=True)
#     pointsUser2 = Column(Integer, nullable=True)

# # Fonction pour initialiser la base de données
# def init_db():
#     engine = create_engine(DATABASE_URL)
#     Base.metadata.create_all(bind=engine)
#     return engine

# # Fonction pour obtenir une session
# def get_session(engine):
#     SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
#     return SessionLocal()
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

        # Vérifie et crée les tables si elles n'existent pas
        self.check_and_create_tables()

    def create_db(self):
        create_database(self.engine.url)
        print(f"Database {self.db_name} created!")

    def check_and_create_tables(self):
        # Vérifie si les tables nécessaires existent et les crée si nécessaire
        inspector = sqlalchemy.inspect(self.engine)
        tables_to_check = ["users", "parties", "notifications"]

        tables_missing = [table for table in tables_to_check if not inspector.has_table(table)]
        
        if tables_missing:
            self.create_tables()
            print(f"Tables {', '.join(tables_missing)} created successfully!")
        else:
            print("All necessary tables already exist.")

    def create_tables(self):
        # Crée toutes les tables définies dans les modèles
        Base.metadata.create_all(self.engine)
        with self.engine.connect() as conn:
            # Crée les séquences si elles n'existent pas déjà
            conn.execute(text("CREATE SEQUENCE IF NOT EXISTS partie_id_seq"))
            conn.execute(text("CREATE SEQUENCE IF NOT EXISTS user_id_seq"))
            conn.execute(text("CREATE SEQUENCE IF NOT EXISTS notification_id_seq"))
            print("Sequences created successfully!")

    def drop_table(self, table_name: str):
        # Supprime une table spécifique
        with self.engine.connect() as conn:
            conn.execute(text(f"DROP TABLE IF EXISTS {table_name} CASCADE"))
            print(f"Table {table_name} dropped successfully!")

    def recreate_table(self, table_name: str):
        # Supprime et recrée une table spécifique
        self.drop_table(table_name)
        self.create_tables()


# class database_management:
#     def __init__(self, db_name: str, recreate: bool):
#         self.engine = create_engine(
#             f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{db_name}"
#         )
#         self.db_name = db_name

#         if recreate:
#             if database_exists(self.engine.url):
#                 drop_database(self.engine.url)
#             self.create_db()  # Créer la base de données si nécessaire

#         if not database_exists(self.engine.url):
#             self.create_db()

#         # Crée les tables si elles n'existent pas
#         if not sqlalchemy.inspect(self.engine).has_table("users"):
#             self.create_tables()
#         elif not sqlalchemy.inspect(self.engine).has_table("parties"):
#             self.create_tables()

#     def create_db(self):
#         create_database(self.engine.url)
#         print(f"Database {self.db_name} created!")

#     def create_tables(self):
#         # Crée toutes les tables définies dans les modèles
#         Base.metadata.create_all(self.engine)
#         with self.engine.connect() as conn:
#             # Crée les séquences si elles n'existent pas déjà
#             conn.execute(text("CREATE SEQUENCE IF NOT EXISTS partie_id_seq"))
#             conn.execute(text("CREATE SEQUENCE IF NOT EXISTS user_id_seq"))
            
#             print("Tables created successfully!")
# class database_management:
#     def __init__(self, db_name: str, recreate: bool):
#         self.engine = create_engine(
#             f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{db_name}"
#         )
#         self.db_name = db_name

#         if recreate:
#             if database_exists(self.engine.url):
#                 drop_database(self.engine.url)

#         if not database_exists(self.engine.url):
#             self.create_db()
#         if not sqlalchemy.inspect(self.engine).has_table("users"):
#             self.create_tables()

#     def create_db(self):
#         create_database(self.engine.url)
        
#     def create_tables(self):
#         Base.metadata.create_all(self.engine)
#         with self.engine.connect() as conn:
#             conn.execute(text("CREATE SEQUENCE IF NOT EXISTS  partie_id_seq"))
#             conn.execute(text("CREATE SEQUENCE IF NOT EXISTS  user_id_seq"))
            