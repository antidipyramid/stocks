# This tool scrapes the publicly available stock transaction disclosures
# required of all sitting U.S. Senators.

import requests
from bs4 import BeautifulSoup
import pandas as pd
import pdb

BASE = "https://efdsearch.senate.gov/"

URL = "https://efdsearch.senate.gov/search/home/"
HOME = "https://efdsearch.senate.gov/search/"
SEARCH = "https://efdsearch.senate.gov/search/report/data/" 

def get_csrf(response):
    soup = BeautifulSoup(response.text, 'lxml')
    return soup.find(lambda tag: tag.name == 'input' and 
                        tag.get("name") == 'csrfmiddlewaretoken').get("value")


def scrape_results(session, site):

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

def extract_data(html):
    # Get table from html

    soup = BeautifulSoup(html,'lxml')
    table = soup.find('table')

    #pdb.set_trace()

    raw_rows = soup.find_all('tr')[1:]
    rows = []
    for line in raw_rows:
        rows.append([x.get_text().strip() for x in line.find_all('td')])


    df = pd.DataFrame(rows)
    print(df)

def parse(session, json):

    # The search data is received as a list of results
    # with links to the report for each senator

    for result in json:
        # Get the URL
        report_url = f'{BASE}{result[3].split(" ",2)[1][6:-1]}'
        report = session.get(report_url)

        extract_data(report.text)

def main():
    with requests.Session() as session:
        json = scrape_results(session,URL)
        #print(json)
        parse(session,json)


if __name__ == '__main__':
    main()
