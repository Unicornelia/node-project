const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin/', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
	res.status(404).render('404', {pageTitle: 'Page not found'});
});

app.listen(3000);
