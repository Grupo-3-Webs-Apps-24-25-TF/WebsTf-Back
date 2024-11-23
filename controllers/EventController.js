const Event = require("../models/EventModel");

const createFromUser = async (req, res) => {
    let eventBody = req.body;

    if (!eventBody.title || !eventBody.description || !eventBody.image || !eventBody.category || !eventBody.date ||
        !eventBody.hourStarting || !eventBody.hourEnding || !eventBody.location || !eventBody.registerLink
    ) {
        return res.status(400).json({
            "message": "Faltan datos"
        });
    }

    if (req.user.role == "Administrador") {
        return res.status(400).json({
            "message": "Rol Incorrecto, vuelva a iniciar sesión"
        });
    }

    let eventData = {
        title: eventBody.title,
        description: eventBody.description,
        image: eventBody.image,
        category: eventBody.category,
        date: eventBody.date,
        hourStarting: eventBody.hourStarting,
        hourEnding: eventBody.hourEnding,
        location: eventBody.location,
        registerLink: eventBody.registerLink,
        user: req.user.id
    }

    let event_to_save = new Event(eventData);

    event_to_save.save().then(eventStored => {
        return res.status(200).json({
            "event": eventStored
        });
    }).catch(() => {
        return res.status(404).json({
            "message": "Error while saving event"
        });
    });
}

const createFromAdmin = async (req, res) => {
    let eventBody = req.body;

    if (!eventBody.title || !eventBody.description || !eventBody.image || !eventBody.category || !eventBody.date ||
        !eventBody.hourStarting || !eventBody.hourEnding || !eventBody.location || !eventBody.registerLink
    ) {
        return res.status(400).json({
            "message": "Faltan datos"
        });
    }

    if (req.user.role == "Usuario") {
        return res.status(400).json({
            "message": "Rol Incorrecto, vuelva a iniciar sesión"
        });
    }

    let eventData = {
        title: eventBody.title,
        description: eventBody.description,
        image: eventBody.image,
        category: eventBody.category,
        date: eventBody.date,
        hourStarting: eventBody.hourStarting,
        hourEnding: eventBody.hourEnding,
        location: eventBody.location,
        registerLink: eventBody.registerLink,
        user: req.user.id,
        status: "Aprobado"
    }

    let event_to_save = new Event(eventData);

    event_to_save.save().then(eventStored => {
        return res.status(200).json({
            "event": eventStored
        });
    }).catch(() => {
        return res.status(404).json({
            "message": "Error while saving event"
        });
    });
}

const deleteEvent = (req, res) => {
    let eventId = req.query.eventId;

    if (req.user.role == "Usuario") {
        return res.status(400).json({
            "message": "Rol Incorrecto, vuelva a iniciar sesión"
        });
    }

    Event.findOneAndDelete({ _id: eventId }).then(eventDeleted => {
        if (!eventDeleted) {
            return res.status(404).json({
                "message": "No event found"
            });
        }
        return res.status(200).json({
            "message": "Event deleted successfully"
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while deleting event"
        });
    });
}

const approveEvent = (req, res) => {
    let eventId = req.query.eventId;

    if (req.user.role == "Usuario") {
        return res.status(400).json({
            "message": "Rol Incorrecto, vuelva a iniciar sesión"
        });
    }

    Event.findOneAndUpdate({ _id: eventId }, { status: "Aprobado", approver: req.user.id }, { new: true }).then(eventUpdated => {
        if (!eventUpdated) {
            return res.status(404).json({
                "message": "No event found"
            });
        }
        return res.status(200).json({
            "event": eventUpdated
        });
    }).catch(() => {
        return res.status(500).json({
            "message": "Error while updating event"
        });
    });
}

const getEventsStandBy = (req, res) => {
    if (req.user.role == "Usuario") {
        return res.status(400).json({
            "message": "Rol Incorrecto, vuelva a iniciar sesión"
        });
    }

    Event.find({ status: "Pendiente de aprobación" }).then(events => {
        if (events.length == 0) {
            return res.status(404).json({
                "mensaje": "No se han encontrado eventos pendientes"
            });
        }

        return res.status(200).json({
            events
        });
    }).catch(() => {
        return res.status(404).json({
            "message": "Error while finding events"
        });
    });
}

const update = async (req, res) => {
    let eventBody = req.body;

    if (req.user.role == "Usuario") {
        return res.status(400).json({
            "message": "Rol Incorrecto, vuelva a iniciar sesión"
        });
    }

    Event.findOneAndUpdate({ _id: eventBody._id }, eventBody, { new: true }).then(eventUpdated => {
        if (!eventUpdated) {
            return res.status(404).json({
                "mensaje": "Event not found"
            });
        }
        
        return res.status(200).send({
            "event": eventUpdated
        });
    }).catch(() => {
        return res.status(404).json({
            "mensaje": "Error while finding and updating event"
        });
    });
}

const getEventsByDay = (req, res) => {
    let date = req.query.date;

    if (!date) {
        return res.status(400).json({
            "message": "Faltan datos"
        });
    }

    Event.find({ date: date }).then(events => {
        if (events.length == 0) {
            return res.status(404).json({
                "mensaje": "No se han encontrado eventos"
            });
        }

        return res.status(200).json({
            events
        });
    }).catch(() => {
        return res.status(404).json({
            "message": "Error while finding events"
        });
    });
}

const getEventsFromWeek = (_req, res) => {
    let minDate = new Date();
    minDate.setHours(0, 0, 0, 0);
    let maxDate = new Date();
    maxDate.setHours(23, 59, 59, 999);
    maxDate.setDate(maxDate.getDate() + 6);

    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    Event.find({ date: {
        $gte: minDate,
        $lte: maxDate
    }}).sort('date').then(events => {
        if (events.length == 0) {
            return res.status(404).json({
                "mensaje": "No se han encontrado eventos"
            });
        }

        const groupedEvents = events.reduce((accumulator, event) => {
            const day = event.date.toISOString().split('T')[0];
            const dayName = daysOfWeek[event.date.getDay()];
            const index = `${dayName} ${day}`;
            
            if (!accumulator[index]){
                accumulator[index] = [];
            }

            accumulator[index].push(event);

            return accumulator;
        }, {});

        return res.status(200).json({
            groupedEvents
        });
    }).catch(() => {
        return res.status(404).json({
            "message": "Error while finding events"
        });
    });
}

const getEventsUntilMonth = (_req, res) => {
    let minDate = new Date();
    minDate.setHours(0, 0, 0, 0);
    let maxDate = new Date(minDate.getFullYear(), minDate.getMonth() + 1, 0);
    maxDate.setHours(23, 59, 59, 999);

    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    Event.find({ date: {
        $gte: minDate,
        $lte: maxDate
    }}).sort('date').then(events => {
        if (events.length == 0) {
            return res.status(404).json({
                "mensaje": "No se han encontrado eventos"
            });
        }

        const groupedEvents = events.reduce((accumulator, event) => {
            const day = event.date.toISOString().split('T')[0];
            const dayName = daysOfWeek[event.date.getDay()];
            const index = `${dayName} ${day}`;
            
            if (!accumulator[index]){
                accumulator[index] = [];
            }

            accumulator[index].push(event);

            return accumulator;
        }, {});

        return res.status(200).json({
            groupedEvents
        });
    }).catch(() => {
        return res.status(404).json({
            "message": "Error while finding events"
        });
    });
}

module.exports = {
    createFromUser,
    createFromAdmin,
    deleteEvent,
    approveEvent,
    getEventsStandBy,
    update,
    getEventsByDay,
    getEventsFromWeek,
    getEventsUntilMonth
}