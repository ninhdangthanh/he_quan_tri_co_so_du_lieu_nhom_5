const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')

const restaurantRouter = require('./routes/restaurant');
const gradeRouter = require('./routes/grade');
const connectDB = require('./db/connect')

app.use(express.static('./public'));
app.use(express.json());

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/v1/restaurant', restaurantRouter);
app.use('/api/v1/grade', gradeRouter);

const port = 3000;
var url = "mongodb+srv://ninhnam:12341234@cluster0.bk54g.mongodb.net/hequantricsdl?retryWrites=true&w=majority";

const start = async () => {
  try {
    await connectDB(url)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();