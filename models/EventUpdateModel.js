const { Schema, model } = require("mongoose");

const EventUpdateSchema = Schema({
    event: {
        title: {
            type: String
        },
        description: {
            type: String
        },
        image: {
            type: String
        },
        category: {
            type: String
        },
        date: {
            type: Date
        },
        hourStarting: {
            type: String
        },
        hourEnding: {
            type: String
        },
        location: {
            type: String
        },
        registerLink: {
            type: String
        }
    },
    user: {
        type: Schema.ObjectId,
        ref: "User"
    }
});

module.exports = model("EventUpdate", EventUpdateSchema, "event-updates");