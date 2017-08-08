module.exports = function (config, body) {
  // rows to add to the sheet
  const rows = [];
  if (config.timestamp === 'true') rows.push((new Date()).toISOString());
  if (config.customvalues) rows.push(...config.customvalues.split(','));

  Object.keys(body).forEach(key => rows.push(body[key]));

  if (!rows.length) rows.push('No attributes sent');

  return rows;
};
