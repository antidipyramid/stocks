# This tool scrapes the publicly available stock transaction disclosures
# required of all sitting U.S. Senators.

import requests


URL = "https://efdsearch.senate.gov/search/"

def scrape():
    r = requests.post(URL, )
