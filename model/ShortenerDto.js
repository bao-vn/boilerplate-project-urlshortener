class ShortenerDto {
    constructor(original_url, short_url) {
        this.original_url = original_url;
        this.short_url = short_url;
    }
}

module.exports = {
    ShortenerDto
};