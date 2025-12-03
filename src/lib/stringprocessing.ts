export function truncateString(str: string, length: number) {
	if (str.length > length) {
		return str.slice(0, length) + '...';
	} else {
		return str;
	}
}

export function truncateURLString(str: string, length: number) {
	if (str.endsWith('/')) {
		str = str.slice(0, -1);
	}
	// if starts with http or www, remove it
	if (str.startsWith('http://')) {
		str = str.slice(7);
	}
	if (str.startsWith('https://')) {
		str = str.slice(8);
	}
	if (str.startsWith('www.')) {
		str = str.slice(4);
	}
	str = truncateString(str, length);

	return str;
}

const urlexpression =
	/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
export const URLREGEX = new RegExp(urlexpression);
