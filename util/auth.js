const sheet = require('./lib/sheet');

sheet.auth((error) => {
  if (error) console.error(error);
});
