// const core = require('@actions/core');

try {
    let inputs = [
        process.env.JSONSTRING,
        process.env.JSONSTRINGMULTILINE,
        process.env.JSONDATA,
        process.env.SINGLELINE,
        process.env.MULTILINE,
    ];

    let names = [
        "test-json-string",
        "test-json-string-multiline",
        "test-json-data",
        "singleline",
        "multiline",
    ];

    let i = 0;
    inputs.forEach(input => {
        console.log(`processing: ${names[i]}`)
        i++;
        input = (input || '').trim();
        if (!input) {
            throw new Error(`Missing service account key JSON (got empty value)`);
        }

        // If the string doesn't start with a JSON object character, it is probably
        // base64-encoded.
        if (!input.startsWith('{')) {
            let str = input.replace(/-/g, '+').replace(/_/g, '/');
            while (str.length % 4) str += '=';
            input = Buffer.from(str, 'base64').toString('utf8');
        }

        try {
            const creds = JSON.parse(input);
            console.log('success!')
            return creds;
        } catch (err) {
            console.log('error parsing')
            console.log(err)
        }
    })

} catch (error) {
    console.log(error)
}

