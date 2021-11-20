def get_id_from_soql_result(result):
    if result["totalSize"] > 0:
        record = result["records"][0]
        return record["Id"]
    return None
