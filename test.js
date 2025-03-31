const { MongoClient } = require("mongodb");

// Replace with your MongoDB connection URI
const uri = "mongodb+srv://replytobambam:crMp8RiULxmyrKHV@cluster0.kowh4jc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 

async function connectDB() {
    const client = new MongoClient(uri, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    });

    try {
        await client.connect(); // Connect to MongoDB
        console.log("Connected to MongoDB!");

        // Select a database
        const db = client.db("Car_Rental_System");

        // Select a collection (table)
        const collection = db.collection("your-collection-name");

        // Example: Insert a document
        await collection.insertOne({ name: "John Doe", age: 30 });
        console.log("Data inserted successfully!");

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    } finally {
        await client.close(); // Close connection
    }
}

// Call the function to connect
connectDB();
