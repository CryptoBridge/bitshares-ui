/**
 * Support Utility Functions
 *
 * @author: Lee Burton <Lee.Burton@SmokinMedia.com>
 */
import counterpart from "counterpart";
import {kebabCase} from "lodash-es";
import {STATUSKEYS} from "./Constants";
import config from "../../../config";

/**
 * Gets the Status Key from the supplied StatusId
 *
 * @param statusId
 * @returns {*|string}
 */
export const getStatusKey = statusId => STATUSKEYS[statusId] || "";

/**
 * Gets the ticket CSS classes
 *
 * @param classes
 * @param statusId
 * @returns {string}
 */
export const getTicketClasses = (classes, statusId) => {
    const statusClass = kebabCase(getStatusKey(statusId));
    return `${classes} ${statusClass}`;
};

/**
 * Formats a timestamp in a custom format for the ticket summary items
 *
 * @param timestamp
 * @returns {*}
 */
export const formatTimestamp = timestamp => {
    return counterpart.localize(new Date(timestamp), {
        format: "short_datetime"
    });
};

/**
 * Logging function to send errors to the Support API logging endpoint
 *
 * @param data
 * @param level
 */
export const log = (data, level = "error") => {
    fetch(`${config.support.url}/support/logger`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            context: navigator.userAgent,
            level,
            data
        })
    })
        .then(response => {
            console.error(`Logging response: ${response}`);
        })
        .catch(error => {
            console.error(`Logging error: ${error}`);
        });
};
