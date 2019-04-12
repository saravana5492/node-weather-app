const geocode = require('./geocode/geocode');
const forecast = require('./weather/weather');

const express = require('express');
const path = require('path');
const hbs = require('hbs');

var app = express();

const port  = process.env.PORT || 3000

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partial');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        author: 'iSaravana'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        author: 'iSaravana'
    });
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Wanna Help?',
        author: 'iSaravana'
    });
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 Error',
        author: 'iSaravana',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 Error',
        author: 'iSaravana',
        errorMessage: 'Page Not Found'
    });
})

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});

