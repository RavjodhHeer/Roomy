// https://stackoverflow.com/a/8358141
export function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        var intlCode = (match[1] ? '+1 ' : '');
        return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return null;
}

export function displayTime(date) {
	const monthLookup = ["Jan ", "Feb ", "Mar ", "Apr ", "May ", "Jun ", "Jul ", "Aug ", "Sep ", "Oct ", "Nov ", "Dec "];
	const secondsSince = Math.floor((Date.now() - date.valueOf())/1000)
	if (secondsSince < 60) {
		return secondsSince + "s"
	}
	else if (secondsSince < 3600) {
		return Math.floor(secondsSince/60) + "m"
	}
	else if (secondsSince < 86400) {
		return Math.floor(secondsSince/3600) + "h"
	}
	else if (secondsSince < 2628000) {
		return Math.floor(secondsSince/86400) + "d"
	}
	else if (new Date().getFullYear() === date.getFullYear()) {
		return monthLookup[date.getMonth()] + date.getDate()
	}
	else {
		return monthLookup[date.getMonth()] + date.getDate() + ", " + date.getFullYear()
	}
}