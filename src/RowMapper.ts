export class RowMapper {

    static map(input: Array<Array<string>>) {
        let header = input.shift();

        for (let i = 0; i < header.length; i++) {
            header[i] = RowMapper.convertToCamelCase(header[i]);
        }

        let output = [];

        for (let row of input) {
            let obj = {};

            for (let i = 0; i < row.length; i++) {
                obj[header[i]] = row[i];
            }

            output.push(obj);
        }

        return output;
    }

    static convertToCamelCase(content: string): string {
        // content = content.charAt(0).toLowerCase() + content.slice(1);
        // content = contennt.replace(/\s/g, '');
        // return content.toLowerCase();
        return content.replace(/[^a-z ]/ig, "").replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
            if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
            return index === 0 ? match.toLowerCase() : match.toUpperCase();
        });
    }
}