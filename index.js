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
    .post('/api', async (req, res) => {
        const { data: { access_token } } = await getToken()
        const payload = req.body
        const config = { headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json;charset=UTF-8' } }
        axiosInstance
            .post('api/Ticket/Search', payload, config)
            .then(e => console.log('-------', e))
            .catch(e => console.log(e.response.data.Message))
    })

app.listen(PORT, () => console.log(`Running on ${PORT}`))