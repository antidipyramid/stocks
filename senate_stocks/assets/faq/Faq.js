import React from 'react';

export default function Faq() {
  return (
    <>
      <h2 className="mb-3 mt-3">Frequently Asked Questions</h2>
      <h4>Where does the data come from?</h4>
      <p>
        All United States senators are required by law to disclose certain
        financial transaction to the public. These disclosures are periodically{' '}
        <a href="https://efdsearch.senate.gov/search/home/">uploaded</a> online
        to a site called eFD (presumably 'e-Financial Disclosures'). eFD has
        disclosures that go back to about the year 2012. The data from that site
        is scraped, cleaned, and stored in a database.
      </p>

      <h4>Does this site only have stock data?</h4>
      <p>
        No. Senators disclose the purchase, sale, and exchange of various
        financial assets including stocks, bonds (both corporate and municipal),
        and other securities.
      </p>

      <h4>Can I see the code?</h4>
      <p>
        Yes! Check out the{' '}
        <a href="https://github.com/antidipyramid/stocks">Github repo</a>.
      </p>

      <h4>Is this data complete?</h4>
      <p>
        No, not yet. Most of the disclosures are uploaded in plaintext in HTML
        tables which can easily be scraped. However, some of them are uploaded
        as PDFs of document scans, which can't be easily parsed with code. It's
        possible to do this work manually, but hopefully in the near future, we
        will be albe to use tools like Optical Character Recognition (OCR) to
        parse this data automatically.
      </p>
    </>
  );
}
