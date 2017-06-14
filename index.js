const sheet = require('./lib/sheet');
const querystring = require('querystring');

module.exports = {
  handler(event, context, callback) {
    const config = event.queryStringParameters;
    const body = querystring.parse(event.body);

    let rows = Object.keys(body).map(key => body[key]);
    const sheetId = config.id;

    if (!sheetId) return callback(null, { statusCode: 200, body: 'Specify a spreadsheet with ?id=xxx' });

    if (!rows.length) rows = ['No POST attributes sent'];

    sheet.append(sheetId, rows, (error) => {
      if (error) console.error(error);
    });

    // return a blank callback because we don't need to block user input here
    return callback(null, { statusCode: 200 });
  },
};
