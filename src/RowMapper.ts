export class RowMapper{
    
    static map(input: Array<Array<string>>) {
        let header = input.shift();

        for (let i = 0; i < header.length; i++) {
            header[i] = header[i].toLowerCase();
            header[i] = header[i].replace(/\s/g, '-');
        }        
        
        let output = [];
        
        for (let row of input) {
            let obj = {};

            for (let i = 0; i < row.length; i++){
                obj[header[i]] = row[i];
            }

            output.push(obj);
        }
        
        return output;
    }
}