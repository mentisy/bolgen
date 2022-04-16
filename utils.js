const getNveApiUrl = (date) => {
    const api = process.env.NVE_API;

    return api.replaceAll('{{date}}', date);
}

const COLOR_GREEN = '#198754';
const COLOR_YELLOW = '#ffc107'
const COLOR_RED = '#dc3545';

/**
 *
 * @param data {{Summary: String, PdfUrl: string}}
 * @param {number} weekNumber
 * @returns {{template, "h:X-Mailgun-Variables": string, subject: string, from: string, to}}
 */
const buildMailgunData = (data, weekNumber) => {
    const colorRegex = /(grønt|gult|rødt)/gm;
    const colorMatch = colorRegex.exec(data.Summary)[0] ?? '';
    const mailgunVariables = {
        color: {
            hex: '',
            string: colorMatch,
        },
        summary: data.Summary,
        pdfLink: data.PdfUrl,
        week: weekNumber,
    };
    switch (colorMatch) {
        case 'grønt': {
            mailgunVariables.color.hex = COLOR_GREEN;
            break;
        }
        case 'gult': {
            mailgunVariables.color.hex = COLOR_YELLOW;
            break;
        }
        case 'rødt': {
            mailgunVariables.color.hex = COLOR_RED;
            break;
        }
    }

    return {
        from: process.env.MAILGUN_FROM,
        to: process.env.MAILGUN_RECIPIENT,
        subject: process.env.MAILGUN_SUBJECt,
        template: process.env.MAILGUN_TEMPLATE,
        "h:X-Mailgun-Variables": JSON.stringify(mailgunVariables),
    }
}

module.exports = {getNveApiUrl, buildMailgunData}
