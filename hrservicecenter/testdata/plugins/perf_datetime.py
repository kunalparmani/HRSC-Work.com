import datetime

from snowfakery.plugins import SnowfakeryPlugin

from faker import Faker
from faker.providers.date_time import Provider as DateProvider


fake = Faker()


class PerfDateTime(SnowfakeryPlugin):
    class Functions:
        def random_datetime(self, *, start_date, end_date, format):

            return str(datetime.datetime())

        def datetime_between(self, *, start_date, end_date):
            """A YAML-embeddable function to pick a date between two ranges"""

            def try_parse_date(d):
                if not isinstance(d, str) or not DateProvider.regex.fullmatch(d):
                    try:
                        d = parse_date(d)
                    except Exception:  # let's hope its something faker can parse
                        pass
                return d

            start_date = try_parse_date(start_date)
            end_date = try_parse_date(end_date)

            return str(fake.date_time_between(start_date, end_date)).replace(" ", "T")
