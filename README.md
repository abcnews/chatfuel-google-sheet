Chatfuel Google Sheet
=====================

A JSON endpoint to send [Chatfuel](https://chatfuel.com/) user attributes to a
Google Sheet.

Setup
-----
This app is intended for use in AWS Lambda. General setup:

1. Configure this app as an AWS Lambda
2. Set requisite env vars (see below)
3. Expose via a web gateway
4. Set up in Chatfuel as a JSON API card
  * Configure this as a POST endpoint
  * Send through and Chatfuel attributes you wish. Each attribute will be added to a new column in the doc.
  * Add a query param to the url to let the endpoint know which sheet to send to. Eg. `?id=123` where 123 is the id of the sheet, as found in the url.

Environment variables
---------------------
Environment vars for this app are configured from two sources:

1. client_secret.json file from the Google Developers Console. For instructions on setting this up, see step 1 of the [Node quickstart docs](https://developers.google.com/sheets/api/quickstart/nodejs).
2. Once you have the secrets set, run the auth script to get an access token: `node util/auth.js`

Variable name        | Description         
---------------------|---------------------
SHEETS_CLIENT_ID     | Client ID as found in client_secret.json
SHEETS_PROJECT_ID    | Project ID as found in client_secret.json
SHEETS_CLIENT_SECRET | Client Secret as found in client_secret.json
SHEETS_ACCESS_TOKEN  | Value as printed by the auth script.
SHEETS_REFRESH_TOKEN | Value as printed by the auth script.
SHEETS_TOKEN_TYPE    | Value as printed by the auth script.
SHEETS_EXPIRY_DATE   | Value as printed by the auth script.

Chatfuel variables
------------------
It is intended that you can throw any variables you like at this endpoint and
they will be saved as columns in a sheet.

It is worth noting that Google Docs has a limit of 400k cells in a sheet. Therefore
this is not an appropriate tool for larger-scale or long-term data gathering.
