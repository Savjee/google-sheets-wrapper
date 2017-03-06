# google-sheets-node

[![Current version](https://img.shields.io/npm/v/google-sheets-wrapper.svg)](https://www.npmjs.com/package/google-sheets-wrapper)
[![Downloads on npm](https://img.shields.io/npm/dt/google-sheets-wrapper.svg)](https://www.npmjs.com/package/google-sheets-wrapper)
[![License](https://img.shields.io/npm/l/google-sheets-wrapper.svg)](/LICENSE)
[![Build status](https://img.shields.io/travis/Savjee/google-sheets-wrapper.svg)](https://travis-ci.org/Savjee/google-sheets-wrapper)
[![Dependencies](https://img.shields.io/david/savjee/google-sheets-wrapper.svg)](https://www.npmjs.com/package/google-sheets-wrapper)

Work in progress... Stay tuned.

# Usage
The library supports 2 ways of interacting with a Google Sheet: getting rows and writing rows.

## Authentication
Follow step 1 of the official "Node.js Quickstart": [https://developers.google.com/sheets/api/quickstart/nodejs](https://developers.google.com/sheets/api/quickstart/nodejs). This will walk you through enabling the Sheets API and creating credentials (JSON file).

Afterwards set the environment variable ``GOOGLE_APPLICATION_CREDENTIALS`` so that it contains the path to your credentials file. Could be something like this:

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/my/credentials.json
```

## Getting rows
```javascript
// Open spreadsheet with ID XXXX-XXXX-XXXX and work with columns A to F in worksheet "Sheet 1"
let sheet = new GoogleSheet({
    sheetId: "XXXXXXXXXX-XXXXXXXXX-XXXXXXXX",
    range: "'Sheet 1'!A:C"
});

// Get the data
let data = await sheet.getRows();

// Show it
console.log(data);
```

This will map your rows to objects, using the first row of your spreadsheet as name for the values.
Here is an example output for a simple spreadsheet:

![Example spreadsheet](examples/simple-spreadsheet.png)

```
[ 
    { id: '1', date: '02-03-2017', description: 'Just a test' },
    { id: '2', date: '04-03-2017', description: 'Another test' } 
]
```

# Contributing & License
Feel free to fork this library, improve it or create issues and pull requests.