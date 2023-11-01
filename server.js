const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/keys');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

/******************************************MiddleWares  ********************************************/
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/******************************************MongoDb Connection********************************************/

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log('MongoDb Connected')).catch(err => console.log(err));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('./client/build'));

    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));

    });
}

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true, // Enable GraphiQL for testing
}));


app.listen(process.env.PORT || 8000, () => console.log('Listening to port 8000'));


