# coding utf-8

import sqlalchemy
from sqlalchemy.engine import Engine, create_engine
from sqlalchemy.orm import sessionmaker
from user_api.db.models import Customer

class SchemaManager(object):

    def __init__(
        self,
        db_url: str
    ):
        self._db_url = db_url.strip("/")

    def get_session(self, database: str = None) -> Engine:
        """
        Get the session object to perform requests.
        Args:
            database (str): The database to connect to (Optionnal).
        Returns:
            (Session): The SQLAlchemy session.
        """
        engine = self.get_engine(database)
        return sessionmaker(engine)()

    def get_engine(self, database: str = None) -> Engine:
        """
        Get the engine object to perform requests.
        Args:
            database (str): The database to connect to (Optionnal).
        Returns:
            (Engine): The SQLAlchemy engine.
        """
        db_url = self._db_url
        if database is not None:
            db_url = "{}/{}".format(db_url, database)
        engine = create_engine(db_url)
        return engine

    def customer_db_exists(self, customer_id: int) -> bool:
        """
        Does check if a customer database exists based on
        his customer id.
        Args:
            customer_id (int): The customer id.
        Returns:
            (bool): Exists or not.
        """
        engine = self.get_engine()
        conn = engine.connect()
        conn.execution_options(isolation_level="AUTOCOMMIT")
        expected_db_name = "app_tenant_{}".format(customer_id)
        cursor = conn.execute(
            "SELECT MAX(id) FROM pg_database WHERE datname = %s",
            expected_db_name
        )
        db_exists = cursor.fetchone()[0] == 0
        cursor.close
        conn.close()
        return db_exists

    def deploy_customer(
        self,
        force: bool = False
    ):
        # Create customer.
        session = self.get_session("user_api")
        customer = Customer()
        session.add(customer)
        session.commit()
        # Create db.
        engine = self.get_engine()
        conn = engine.connect()
        conn.execution_options(isolation_level="AUTOCOMMIT")
        conn.execute("CREATE DATABASE {}".format(
            "app_tenant_{}".format(customer.id)
        ))
        conn.close()
        


        

        
