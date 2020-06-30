# This tool scrapes the publicly available stock transaction disclosures
# required of all sitting U.S. Senators.

import requests
import pandas as pd
import pdb
import time
from functools import partial
from bs4 import BeautifulSoup


BASE = "https://efdsearch.senate.gov/"
URL = "https://efdsearch.senate.gov/search/home/"
HOME = "https://efdsearch.senate.gov/search/"
SEARCH = "https://efdsearch.senate.gov/search/report/data/"

ENTRIES = 25
SLEEPLENGTH = 2

class SenateDataScraper:

    def __init__(self, session, start_date):
        self.start_date = start_date
        self.session = session

    def get_csrf(self, response):
        soup = BeautifulSoup(response.text, 'lxml')
        return soup.find(lambda tag: tag.name == 'input' and
                            tag.get("name") == 'csrfmiddlewaretoken').get("value")


    def getURLS(self, token, start):

        # POST the JSON data from the site
        # with csrf token from search site

        results = self.session.post(SEARCH, data={
                "start":str(start),
                "length":str(start+ENTRIES),
                "report_types":"[11]",
                "filer_types":"[]",
                "submitted_start_date":self.start_date,
                "submitted_end_date":"",
                "candidate_state":"",
                "senator_state":"",
                "office_id":"",
                "first_name":"",
                "last_name":"",
                "csrfmiddlewaretoken":token 
                },
            headers={'Referer':HOME})

        return results.json()['data']

    def scrape_results(self, site):
        # Record keeping begins on 01/01/2012 00:00:00

        landing = self.session.get(site)

        # Send a post request to accept the terms of use
        # with csrf token from landing site

        resp = self.session.post(URL, data = {
                'prohibition_agreement':'1',
                'csrfmiddlewaretoken':self.get_csrf(landing)
                },
            headers={'Referer':URL})


        start = 0
        fullResults = []
        nextResults = self.getURLS(self.get_csrf(resp),start)
        while nextResults:
            fullResults.extend(nextResults)
            nextResults = self.getURLS(self.get_csrf(resp),start+ENTRIES)
            start += ENTRIES

            time.sleep(SLEEPLENGTH)

        #for nextResult in iter(partial(self.getURLS,self.get_csrf(resp),start+ENTRIES),[]):
        #    print(nextResult)
        #    fullResults.extend(nextResult)
        #    start += ENTRIES

        #    time.sleep(SLEEPLENGTH)

        return fullResults

    def extract_data(self, html):
        # Get table from html
        soup = BeautifulSoup(html, 'lxml')

        if soup('table'):
            dfs = pd.read_html(html)
            print(dfs[0])

            return dfs[0]
        else:
            return None

    def parse(self, json):

        # The search data is received as a list of results
        # with links to the report for each senator
        pics = [] #remember what filings must be entered manually
        for result in json:
            # Get the URL
            report_url = f'{BASE}{result[3].split(" ",2)[1][6:-1]}'
            report = self.session.get(report_url)

            time.sleep(SLEEPLENGTH)

            data = self.extract_data(report.text)

            if type(data) is not pd.DataFrame:
                pics.append(report_url)

        print(len(pics))
        print(pics)





def main():
    with requests.Session() as session:
        start_date = "01/01/2020 00:00:00"

        scraper = SenateDataScraper(session=session, 
                                    start_date=start_date)

        json = scraper.scrape_results(URL)
        scraper.parse(json)


if __name__ == '__main__':
    main()
