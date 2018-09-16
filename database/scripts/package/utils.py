# coding utf-8

import logging

def init_logger():
    LOGGER = logging.getLogger(__name__)
    LOGGER.setLevel(logging.INFO)
    ST_HAND = logging.StreamHandler()
    ST_HAND.setLevel(logging.INFO)
    FORMATTER = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
    ST_HAND.setFormatter(FORMATTER)

    LOGGER.addHandler(ST_HAND)
    return LOGGER


def install_schema(db_name, from_version="0.0.0"):
    pass
