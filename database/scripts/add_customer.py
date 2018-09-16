# coding utf-8

import json
import string
import random
import argparse
from user_api.helpers import init_db, add_user, add_customer
from package.utils import init_logger

LOGGER = init_logger()

parser = argparse.ArgumentParser(description="Add a new customer to the user api.")

parser.add_argument("user", help="JSON representing the user.")
parser.add_argument("jwt_secret", help="The secret used to encode the passwords.")
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

user = json.loads(args.user)

customer_id = add_customer(db_url)

add_user(
    db_url=db_url,
    jwt_secret=args.jwt_secret,
    username=user["username"],
    email=user["email"],
    password=user["password"],
    customer_id=customer_id
)

