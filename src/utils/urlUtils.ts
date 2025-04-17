export const isValidHttpUrl = (string: string) => {
	let url;
	try {
		url = new URL(string);
	} catch (_) {
		return false;
	}
	return url.protocol === "http:" || url.protocol === "https:";
};

export const getImageUrl = (url: string) => {
	if (!isValidHttpUrl(url)) {
		console.error("Invalid URL, using placeholder");
		return "https://placehold.co/400x300/png?text=No+Image";
	}

	if (url.includes("imgur.com") && !url.includes("i.imgur.com")) {
		const imgurId = url.split("/").pop();
		if (imgurId) {
			return `https://i.imgur.com/${imgurId}.jpg`;
		}
	}

	return url;
};
