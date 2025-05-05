def parse_csv_param(param, type_cast=float):
    if param is None:
        return None
    if isinstance(param, str):
        return [type_cast(x) for x in param.split(',') if x]
    return param 