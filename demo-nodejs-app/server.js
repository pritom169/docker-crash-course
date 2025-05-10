// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection string - Modified to use authentication database
const mongoHost = process.env.MONGO_DB_HOST || 'localhost';
const mongoUser = process.env.MONGO_DB_USERNAME;
const mongoPwd = process.env.MONGO_DB_PWD;
const dbName = process.env.MONGO_DB_NAME || 'my-db';

// Use the admin database for authentication with proper URI format
const mongoURI = `mongodb://${mongoUser}:${mongoPwd}@${mongoHost}:27017/${dbName}?authSource=admin`;

console.log(`Attempting to connect to MongoDB at: ${mongoHost}`); // Log the host for debugging

let db;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
async function connectToMongo() {
  try {
    console.log('Connecting to MongoDB with URI:', mongoURI.replace(mongoPwd, '******')); // Log URI but hide password
    const client = new MongoClient(mongoURI);
    await client.connect();
    console.log('Connected to MongoDB successfully');
    db = client.db(dbName);
    
    // Create collection if it doesn't exist
    if (!await db.listCollections({ name: 'users' }).hasNext()) {
      await db.createCollection('users');
      console.log('Created users collection');
    }
    
    return client;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// API endpoint to save person information
app.post('/api/user', async (req, res) => {
  try {
    const { name, email, description } = req.body;
    
    // Basic validation
    if (!name || !email || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Check if email already exists
    const existingPerson = await db.collection('users').findOne({ email });
    if (existingPerson) {
      return res.status(400).json({ error: 'A person with this email already exists' });
    }
    
    // Create new person document
    const newPerson = {
      name,
      email,
      description,
      createdAt: new Date()
    };
    
    // Insert into MongoDB
    const result = await db.collection('users').insertOne(newPerson);
    
    // Return success response
    res.status(201).json({ 
      message: 'Person added successfully', 
      person: {
        ...newPerson,
        _id: result.insertedId
      }
    });
  } catch (error) {
    console.error('Error saving person data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// API endpoint to get all persons - fixed collection name to match the one used in POST
app.get('/api/persons', async (req, res) => {
  try {
    const persons = await db.collection('users').find().toArray();
    res.json(persons);
  } catch (error) {
    console.error('Error fetching persons data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// API endpoint to get a single person by ID - fixed collection name to match
app.get('/api/person/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    const person = await db.collection('users').findOne({ _id: new ObjectId(id) });
    
    if (!person) {
      return res.status(404).json({ error: 'Person not found' });
    }
    
    res.json(person);
  } catch (error) {
    console.error('Error fetching person data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server only after connecting to MongoDB
async function startServer() {
  const client = await connectToMongo();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
  // Handle process termination
  process.on('SIGINT', async () => {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  });
}

startServer();