import base64
import hashlib
import json
from django.conf import settings


def generate_x_verify(payload: dict, endpoint: str):

    payload_json = json.dumps(payload)
    base64_payload = base64.b64encode(payload_json.encode()).decode()

    string_to_hash = base64_payload + endpoint + settings.PHONEPE_SALT_KEY

    sha256 = hashlib.sha256(string_to_hash.encode()).hexdigest()

    x_verify = sha256 + "###" + str(settings.PHONEPE_SALT_INDEX)

    return base64_payload, x_verify