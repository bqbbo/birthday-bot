import * as events from "./events/index.js";

const loadEvents = (client) => {
    for (const event of Object.values(events)) {
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
};

export default loadEvents;
