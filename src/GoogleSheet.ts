import { RowMapper } from './RowMapper';

export class GoogleSheet{

    // Dependencies    
    private googleAuth = require('google-auth-library');
    private google = require('googleapis');
    private sheets = this.google.sheets('v4');
    private authFactory = new this.googleAuth();
    private authClient;
    
    // Attributes
    private sheetId: string;    
    private range: string;

    
    constructor(sheetId: string, range: string) {

        // Check if authentication is set
        if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            throw new Error('Environment variable "GOOGLE_APPLICATION_CREDENTIALS" not set');
        }

        this.sheetId = sheetId;
        this.range = range;
    }

    /**
     * Change the range in which the API should search for data
     * @param range 
     */    
    public setRange(range: string) {
        // TODO: add some validation here
        this.range = range;
    }
    
    public async getRows() : Promise<any> {
        await this.authenticate();
        
        return new Promise((resolve, reject) => {
            this.sheets.spreadsheets.values.get({
                auth: this.authClient,
                spreadsheetId: this.sheetId,
                range: this.range
            }, (err, response) => {
                if (err) { reject(err) }

                if (response && response.values) {
                    resolve(RowMapper.map(response.values));
                }

                reject('Not a valid response: ' + response);
            });
     
       });
    }

    /**
     * Appends new row(s) to the current spreadsheet, in the currently active range
     * @param rows 
     */    
    public async appendRows(rows: Array<Array<string|number>>) {
        await this.authenticate();

        return new Promise((resolve, reject) => {
            this.sheets.spreadsheets.values.append({
                auth: this.authClient,
                spreadsheetId: this.sheetId,
                range: this.range,
                valueInputOption: "USER_ENTERED",
                insertDataOption: "INSERT_ROWS",
                resource: {
                    values: rows
                }
            }, (err, response) => {
                if (err) { reject(err) }

                if (response && response.updates) {
                    resolve(response);
                } else {
                    reject('Did not get the expected response: ' + response);
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
                    reject('Authentication failed because of ' + err)
                }

                this.authClient = authClient;                
                
                if (authClient.createScopedRequired && authClient.createScopedRequired()) {
                    var scopes = ['https://www.googleapis.com/auth/spreadsheets'];
                    this.authClient = authClient.createScoped(scopes);
                    resolve();
                }
            });
        });
    }
    
}