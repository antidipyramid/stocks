# This tool scrapes the publicly available stock transaction disclosures
# required of all sitting U.S. Senators.

import requests
from bs4 import BeautifulSoup

URL = "https://efdsearch.senate.gov/search/home/"
HOME = "https://efdsearch.senate.gov/search/"
SEARCH = "https://efdsearch.senate.gov/search/report/data/" 

def get_csrf(response):
    soup = BeautifulSoup(response.text, 'lxml')
    return soup.find(lambda tag: tag.name == 'input' and 
                        tag.get("name") == 'csrfmiddlewaretoken').get("value")


def scrape(site):

    # Open a requests session with persistent cookies
    with requests.Session() as session:
        landing = session.get(site)

        # Send a post request to accept the terms of use
        # with csrf token from landing site
        resp = session.post(URL, data = {'prohibition_agreement':'1', 'csrfmiddlewaretoken':get_csrf(landing)},
                        headers={'Referer':URL})

        # POST the JSON data from the site
        # with csrf token from search site
        results = session.post(SEARCH,
                        data={"start":"0",
                              "length":"25",
                              "report_types":"[11]",
                              "filer_types":"[]",
                              "submitted_start_date":"01/01/2012 00:00:00",
                              "submitted_end_date":"",
                              "candidate_state":"",
                              "senator_state":"",
                              "office_id":"",
                              "first_name":"",
                              "last_name":"",
                              "csrfmiddlewaretoken": get_csrf(resp)
                            },
                         headers={'Referer':HOME})

    return results.json()['data']

print(scrape(URL))
