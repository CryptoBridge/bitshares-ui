/**
 * Freshdesk Request Helper function
 *
 * @author: Lee Burton <Lee.Burton@SmokinMedia.com>
 */
import config from "../../../config";

const API_KEY = config.support.freshdesk.apiKey;
const authorization = btoa(`${API_KEY}:X`);

export const request = params => {
    const {
        url,
        method = "GET", // *GET, POST, PUT, DELETE, etc.
        body = null, // must match "Content-Type" header
        cache = "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        mode = "cors", // no-cors, cors, *same-origin,
        credentials = "omit", // include, same-origin, *omit
        redirect = "follow", // manual, *follow, error
        referrer = "no-referrer" // *client, no-referrer
    } = params;

    return fetch(url, {
        body,
        cache,
        credentials,
        headers: {
            "user-agent": "CryptoBridge/Freshdesk",
            "content-type": "application/json",
            authorization: `Basic ${authorization}`
        },
        method,
        mode,
        redirect,
        referrer
    });
};
