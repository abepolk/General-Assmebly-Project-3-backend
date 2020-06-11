const express = require('express');
const router = express.Router();
const Contact = require('../models/contacts.js');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    const {authorization} = req.headers;
    if (authorization) {
        const token = authorization.split(' ')[1];  
        try {
            const payload = await jwt.verify(token, process.env.SECRET);
            //store the payload (username) in the request object
            req.user = payload;
            //go to the route
            next();
        } catch {
            //if fail verify, send error code
            return res.sendStatus(403);
        }
    } else {
        res.send("no auth header");
    }
};

router.post('/new', auth, async (req, res) => {
    try {
        const createdContact = await Contact.create(req.body);
        res.send(createdContact);
    } catch (error) {
        res.status(400).json(error)
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const contacts = await Contact.find({});

        res.status(200).json(contacts);
    } catch (error) {
        res.status(400).json(error);
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedContact);
    } catch(error) {
        res.status(400).json(error);
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json(updatedContact);
    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = router;