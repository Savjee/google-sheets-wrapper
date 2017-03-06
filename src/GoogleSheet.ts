import { RowMapper } from "./RowMapper";

export class GoogleSheet {

    // Dependencies
    private googleAuth = require("google-auth-library");
    private google = require("googleapis");
    private sheets = this.google.sheets("v4");
    private authFactory = new this.googleAuth();
    private authClient;
    private fs = require("fs");

    // Attributes
    private options: IGoogleSheetOptions;
    private headerRow: Array<string>;

    constructor(options: IGoogleSheetOptions) {
        if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            throw new Error("Environment variable 'GOOGLE_APPLICATION_CREDENTIALS' not set.");
        }

        if (!this.fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
            throw new Error("Credentials file does not exist.");
        }

        if (!/['"].*['"]![A-Za-z]{1,2}:[A-Za-z]{1,2}/.test(options.range)) {
            throw new Error("Range format was invalid. Should be like: 'name-of-sheet'!A:F");
        }

        this.options = options;
    }

    /**
     * Change the range in which the API should search for data
     * @param range
     */
    public setRange(range: string) {
        // TODO: add some validation here
        this.options.range = range;
    }

    public async getRows(): Promise<any> {
        await this.authenticate();

        return new Promise((resolve, reject) => {
            this.sheets.spreadsheets.values.get({
                auth: this.authClient,
                spreadsheetId: this.options.sheetId,
                range: this.options.range
            }, (err, response) => {
                if (err) { reject(err); }

                if (response && response.values) {
                    resolve(RowMapper.map(response.values));
                }

                reject("Not a valid response: " + response);
            });
        });
    }


    public async appendRows(rows: Array<Object>) {
        let header: string[] = await this.getHeaderRow();
        let sendToGoogle: Array<Array<string>> = [];

        for (let row of rows) {

            let rowForGoogle = [];

            // Check if all properties are in the header
            for (let prop in row) {
                let pos = header.indexOf(prop);

                if (pos === -1) {
                    throw Error(`Property "${prop} does not exist in spreadsheet"`);
                }

                rowForGoogle.splice(pos, 0, row[prop]); // Insert them in correct position
            }

            sendToGoogle.push(rowForGoogle);
        }

        await this.writeToGoogle(sendToGoogle);
    }

    public async getHeaderRow(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            if (this.headerRow) {
                resolve(this.headerRow);
            }

            let rangeFirstRow = this.options.range.split("!")[0] + "!1:1";


            // Go grab it!
            await this.authenticate();

            this.sheets.spreadsheets.values.get({
                auth: this.authClient,
                spreadsheetId: this.options.sheetId,
                range: rangeFirstRow
            }, (err, response) => {
                if (err) { reject(err); }

                if (response && response.values) {
                    this.headerRow = [];

                    for (let header of response.values[0]) {
                        this.headerRow.push(
                            RowMapper.convertToCamelCase(header)
                        );
                    }

                    resolve(this.headerRow);
                }

                reject("Not a valid response: " + response);
            });
        });
    }

    private async writeToGoogle(values) {
        return new Promise((resolve, reject) => {
            this.sheets.spreadsheets.values.append({
                auth: this.authClient,
                spreadsheetId: this.options.sheetId,
                range: this.options.range,
                valueInputOption: "USER_ENTERED",
                insertDataOption: "INSERT_ROWS",
                resource: {
                    values: values
                }
            }, (err, response) => {
                if (err) { reject(err); }

                if (response && response.updates) {
                    resolve(response);
                } else {
                    reject("Did not get the expected response: " + response);
                }
            });
        });
    }

    private async authenticate() {
        return new Promise((resolve, reject) => {

            // Skip authentication is it's already done
            if (this.authClient) {
                resolve();
            }

            this.authFactory.getApplicationDefault((err, authClient) => {
                if (err) {
                    reject("Authentication failed because of " + err);
                }

                this.authClient = authClient;

                // Ask for read/write permissions by default
                let scopes = ["https://www.googleapis.com/auth/spreadsheets"];

                if (this.options.readOnly === true) {
                    scopes = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
                }

                if (authClient.createScopedRequired && authClient.createScopedRequired()) {
                    this.authClient = authClient.createScoped(scopes);
                    resolve();
                }
            });
        });
    }
}