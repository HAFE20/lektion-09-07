// importera Express + middleware
const express = require('express')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
// LocalStrategy == inloggning med användarnamn och lösenord

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
app.use(expressSession({ secret: 'secret kan vara vad som helst' }))
app.use(passport.initialize());
app.use(passport.session());

// Inställningar för passport
// Serialisering motsvarar JSON.parse och JSON.stringify
passport.serializeUser((user: User, done: any) => {
	// omvandla användare till ett id, som används med session cookie
  done(null, user.id);
});

passport.deserializeUser((id: string, done: any) => {
	// använd session id för att leta upp användarens information
	let found = users.find(u => id === u.id)
	if( found ) {
		done(null, found)
	} else {
		done('User does not exist')
	}
});

passport.use(new LocalStrategy(
	(username: string, password: string, done: any) => {
		// Leta efter en användare i "databasen"
		let found = users.find(u => u.userName === username && u.password === password)

		if( found ) {
			// Login successful
			return done(null, found);
		} else {
			// Fail: fel lösenord eller användarnamnet finns inte
			return done(null, false, { message: 'Fel användarnamn eller lösenord!' });
		}
	}
));

// Databas med användare - ska läggas i Firestore i framtiden
interface User {
	id: string;
	displayName: string;
	userName: string;
	password: string;
}
const users: User[] = [
	{
		id: '1',
		displayName: 'Göran Holm',
		userName: 'goranh',
		password: 'abc123123'
	}
]


// Endpoints
app.get('/', (req: any, res: any) => {
	if( req.isAuthenticated() ) {
		res.send('Välkommen tillbaka')
	} else {
		res.send('Var vänlig skapa en inloggning')
	}
})

app.post('/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login-failed',
		failureFlash: false
	})
);

app.get('/logout', (req: any, res: any) => {
  req.logout();  // passport skapar logout-funktionen
  res.redirect('/');
});


// Starta servern
app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}.`)
})
