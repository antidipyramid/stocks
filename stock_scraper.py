# This tool scrapes the publicly available stock transaction disclosures
# required of all sitting U.S. Senators.

import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.keys import Keys


URL = "https://efdsearch.senate.gov/search/home/"
HOME = "https://efdsearch.senate.gov/search/"
SEARCH = "https://efdsearch.senate.gov/search/report/data/" 

def get_csrf(response):
    soup = BeautifulSoup(response.text, 'lxml')
    return soup.find(lambda tag: tag.name == 'input' and 
                        tag.get("name") == 'csrfmiddlewaretoken').get("value")


def scrape(site):

    # Open a requests session to the search homepage
    # and get csrftoken in cookies and csrfmiddlewaretoken in form
    # both are required to connect
    r = requests.Session()
    landing = r.get(site)
    
    # Send a post request to accept the terms of use
    resp = r.post(URL, data = {'prohibition_agreement':'1', 'csrfmiddlewaretoken':get_csrf(landing)},
                    headers={'Referer':URL})

    results = r.post(SEARCH,
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

    print(results.json()['data'])

scrape(URL)
