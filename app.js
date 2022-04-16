require ('dotenv').config();
const requestProtcol = require(process.env.NVE_API.includes('https') ? 'https' : 'http');
const mailgun = require('mailgun-js');
const getIsoWeek = require('date-fns/getIsoWeek');
const subWeeks = require('date-fns/subWeeks');
const format = require('date-fns/format')
const {getNveApiUrl, buildMailgunData} = require ('./utils');

const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
    host: process.env.MAILGUN_HOST,
})

const lastWeek = subWeeks(new Date(), 1);
const weekNumber = getIsoWeek(lastWeek);
const apiDate = format(lastWeek, 'yyyy-MM-dd');

requestProtcol.get(getNveApiUrl(apiDate), (apiResponse) => {
    let data = '';
    apiResponse.on('data', chunk => {
        data += chunk;
    })

    apiResponse.on('end', () => {
        data = JSON.parse(data)[0];

        const mailgunData = buildMailgunData(data, weekNumber);

        mg.messages().send(mailgunData, (error, body) => {
            console.log(body);
            if (error) {
                console.error(error);
            }
        });
    })
}).on('error', (err) => {
    console.log(err.message);
})
