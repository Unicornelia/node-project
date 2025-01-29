const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
	const url = req.url;
	const method = req.method;

	if (url === '/') {
		res.write('<!DOCTYPE html>');
		res.write('<html lang="en">');
		res.write('<head><title>Enter Message</title></head>');
		res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
		res.write('</html>');
		return res.end();
	}

	if (url === '/message' && method === 'POST') {
		fs.writeFileSync('message.text', 'dummy' );
		res.statusCode = 302;
		res.setHeader('Location', '/');
		return res.end();
	}

	res.setHeader('Content-Type', 'text/html');
	res.write('<!DOCTYPE html>');
	res.write('<html lang="en">');
	res.write('<head><title>Node server based Html</title></head>');
	res.write('<body><h2>Greetings from Node.js server!</h2></body>');
	res.write('</html>');
	res.end();
});

server.listen(3000);
