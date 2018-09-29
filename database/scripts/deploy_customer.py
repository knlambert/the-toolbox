# coding utf-8

import json
import string
import random
import argparse
from user_api.helpers import init_db, add_user, add_customer
from package.utils import init_logger
from package.schema_manager import SchemaManager

LOGGER = init_logger()

parser = argparse.ArgumentParser(description="Add a new application schema.")

parser.add_argument("--host", default="127.0.0.1",
                    help="The targeted database.")

parser.add_argument("--username", default="postgres", help="Connection username.")
parser.add_argument("--password", default="postgresql", help="Connection password")

args = parser.parse_args()

db_url = "postgresql://{}:{}@{}".format(
    args.username,
    args.password,
    args.host
)

schema_manager = SchemaManager(db_url)
schema_manager.deploy_customer()


