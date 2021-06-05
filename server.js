'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');


const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT;

mongoose.connect(`mongodb://localhost:27017/foods`, { useNewUrlParser: true, useUnifiedTopology: true });