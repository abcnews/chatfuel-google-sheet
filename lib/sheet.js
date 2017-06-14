const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const GoogleAuth = require('google-auth-library');

const sheetModule = {

  auth(callback) {
    // If modifying these scopes, delete your previously saved credentials
    // at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
    const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
    const TOKEN_DIR = `${process.env.HOME || process.env.HOMEPATH ||
      process.env.USERPROFILE}/.credentials/`;
    const TOKEN_PATH = `${TOKEN_DIR}sheets.googleapis.com-nodejs-quickstart.json`;

    /**
     * Store token to disk be used in later program executions.
     *
     * @param {Object} token The token to store to disk.
     */
    function storeToken(token) {
      console.log('Environment variables follow:');
      Object.keys(token).forEach(key => console.log(`SHEETS_${key.toUpperCase()}="${token[key]}"`));
    }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   *
   * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback to call with the authorized
   *     client.
   */
    function getNewToken(oauth2Client, tCallback) {
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      });
      console.log('Authorize this app by visiting this url: ', authUrl);
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oauth2Client.getToken(code, (err, token) => {
          if (err) {
            return tCallback(new Error('Error while trying to retrieve access token', err));
          }
          oauth2Client.credentials = token;
          storeToken(token);
          return tCallback(null, oauth2Client);
        });
      });
    }

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     *
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, aCallback) {
      const clientSecret = credentials.installed.client_secret;
      const clientId = credentials.installed.client_id;
      const redirectUrl = credentials.installed.redirect_uris[0];
      const auth = new GoogleAuth();
      const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

      // Credentials are stored in env var.
      if (process.env.SHEETS_ACCESS_TOKEN) {
        const token = {
          access_token: process.env.SHEETS_ACCESS_TOKEN,
          refresh_token: process.env.SHEETS_REFRESH_TOKEN,
          token_type: process.env.SHEETS_TOKEN_TYPE,
          expiry_date: process.env.SHEETS_EXPIRY_DATE,
        };
        oauth2Client.credentials = token;
        return aCallback(null, oauth2Client);
      }

      return getNewToken(oauth2Client, aCallback);
    }

    const secrets = {
      installed: {
        client_id: process.env.SHEETS_CLIENT_ID,
        project_id: process.env.SHEETS_PROCESS_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://accounts.google.com/o/oauth2/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_secret: process.env.SHEETS_CLIENT_SECRET,
        redirect_uris: ['urn:ietf:wg:oauth:2.0:oob', 'http://localhost'],
      },
    };

    return authorize(secrets, callback);
  },

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
  append(spreadsheetId, row, callback) {
    sheetModule.auth((error, oauth2Client) => {
      const sheets = google.sheets('v4');
      sheets.spreadsheets.values.append({
        spreadsheetId,
        auth: oauth2Client,
        range: 'Sheet1',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [row],
        },
      }, (err) => {
        if (err) return callback(new Error(`The API returned an error: ${err}`));
        return callback();
      });
    });
  },
};

module.exports = sheetModule;
