// Script to update existing requests to be compatible with the new status enum
// This handles the case where we added 'Refunded' to the enum values in the Request model
const mongoose = require('mongoose');
require('dotenv').config();

// Import the updated Request model
const Request = require('./models/Request');

const db = process.env.MONGO_URI;

async function runMigration() {
  try {
    // Connect to MongoDB
    await mongoose.connect(db, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    
    console.log('Connected to MongoDB');

    // Update any records with invalid status values
    // This is just a safety check - in most cases, existing records 
    // with valid statuses should still be compatible
    const result = await Request.updateMany(
      { 
        status: { $nin: ['Pending', 'Approved', 'Refunded', 'Rejected', 'Completed', 'Cancelled'] } 
      },
      { 
        $set: { status: 'Pending' } 
      }
    );
    
    console.log(`Updated ${result.modifiedCount} records with invalid status`);

    // Now update all records to ensure they have valid values according to the new schema
    const allRequests = await Request.find({});
    console.log(`Found ${allRequests.length} total requests`);
    
    // The new enum values are already in the model, so existing valid records should be fine
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the migration
runMigration();