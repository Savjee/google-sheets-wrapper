import { GoogleSheet } from "../src/GoogleSheet";
import "mocha";
import "chai";
import { expect } from "chai";

describe("GoogleSheet test", () => {
    describe("Authentication", () => {
        it("Should fail when GOOGLE_APPLICATION_CREDENTIALS is not set", () => {
            delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
            expect(() => {
                new GoogleSheet({
                    sheetId: "xxxxxxxxxx",
                    range: "'Sheet 1'!A:F"
                });
            }).to.throw(Error, /not set/);
        });

        it("Should fail when GOOGLE_APPLICATION_CREDENTIALS is set to a non-existing file", () => {
            process.env.GOOGLE_APPLICATION_CREDENTIALS = "/tmp/credentials_that_dont_exist.json";

            expect(() => {
                new GoogleSheet({
                    sheetId: "xxxxxxxxxx",
                    range: "'Sheet 1'!A:F"
                });
            }).to.throw(Error, /does not exist/);
        });
    });

});