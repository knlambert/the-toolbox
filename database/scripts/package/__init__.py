# coding utf-8

def init_logger():
    LOGGER = logging.getLogger(__name__)
    LOGGER.setLevel(logging.INFO)
    ST_HAND = logging.StreamHandler()
    ST_HAND.setLevel(logging.INFO)
    FORMATTER = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
    ST_HAND.setFormatter(FORMATTER)

    LOGGER.addHandler(ST_HAND)