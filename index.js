require('dotenv').config()
const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
const app = express()

const axiosInstance = axios.create({ baseURL: 'http://travellogix.api.test.conceptsol.com/' })
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())

const getToken = async () => {
    const config = { headers: { 'Content-Type': 'text/plain' } }
    const rawData = 'grant_type=password&username=test1%40test2.com&password=Aa234567%21'
    return await axiosInstance.post('Token', rawData, config)
}

app
    .get('/', (req, res) => res.send('Server Started..'))
    .post('/token', async (req, res) => {
        const token = await getToken()
        res.json(token.data)
    })
    .get('/api', async (req, res) => {
        const { data: { access_token } } = await getToken()
        // const payload = req.body

        const payload = {
            "Language": "ENG",
            "Currency": "USD",
            "destination": "MCO",
            "DateFrom": "11/26/2016",
            "DateTO": "11/29/2016",
            "Occupancy": {
                "AdultCount": "1",
                "ChildCount": "1",
                "ChildAges": ["10"]
            }
        }

        const config = { headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' } }
        console.log(access_token, payload, config)
        try {
            const result = await axiosInstance.post('api/Ticket/Search', payload, config)
            console.log('Result')
            res.json(result.data)
        } catch (err) {
            console.log('Error')
            res.json(err.message)
        }
    })

app.listen(PORT, () => console.log(`Running on ${PORT}`))