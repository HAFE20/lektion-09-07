// importera Express + middleware
const express = require('express')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const passport = require('passport')

// Konfigurera servern
const app = express()
const PORT: number = 1337
let requestCount: number = 0

app.use( express.urlencoded() )
app.use( express.json() )
app.use( (req: Request, res: Response, next: any) => {
	requestCount++
	console.log(`${requestCount}  ${req.method}  ${req.url} `, req.body)
	next()
} )

app.use(cookieParser())
app.use(expressSession())
// app.use( passport ? )

// Endpoints


// Starta servern
app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}.`)
})
