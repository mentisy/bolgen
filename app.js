require ('dotenv').config();
const requestProtcol = require(process.env.NVE_API.includes('https') ? 'https' : 'http');
const Mailgun = require('mailgun.js');
const formData = require('form-data');
const getIsoWeek = require('date-fns/getIsoWeek');
const subWeeks = require('date-fns/subWeeks');
const format = require('date-fns/format')
const {getNveApiUrl, buildMailgunData} = require ('./utils');

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY,
    url: process.env.MAILGUN_HOST,
});

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

        mg.messages
            .create(process.env.MAILGUN_DOMAIN, mailgunData)
            .then(body => console.log(body))
            .catch(err => console.error(err));
    })
}).on('error', (err) => {
    console.log(err.message);
})
