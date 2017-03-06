interface IGoogleSheetOptions {

    /**
     * ID of the spreadsheet that you want to work with
     */
    sheetId: string;

    /**
     * Range of your data (eg Where is your data stored)
     * Example: 'Sheet1'!A:F fetches column A to F in Sheet 1
     */
    range: string;

    /**
     * Set to true if you only want to read and deny writes
     */
    readOnly?: boolean;
}