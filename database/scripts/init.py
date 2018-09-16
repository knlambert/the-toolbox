# coding utf-8

import string
import random
import argparse
from user_api.helpers import init_db, add_user, add_customer
from package.utils import init_logger

LOGGER = init_logger()

parser = argparse.ArgumentParser(description="Deploy the toolbox db.")

parser.add_argument("--host", default="127.0.0.1",
                    help="The targeted database.")

parser.add_argument("--username", default="postgres", help="Connection username.")
parser.add_argument("--password", default="postgresql", help="Connection password")
parser.add_argument("--drop-before", help="Do drop items first or not.")

args = parser.parse_args()

db_url = "postgresql://{}:{}@{}".format(
    args.username,
    args.password,
    args.host
)
init_db(db_url=db_url, drop_before=True)

LOGGER.info("User api created.")