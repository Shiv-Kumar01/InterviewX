import { connectDB, isDbReady } from './config/db.js';
import Question from './models/Question.js';
import { seedIfEmpty } from './services/seedService.js';

await connectDB();
if (!isDbReady()) process.exit(1);
await Question.deleteMany({ createdBy: { $exists: false } }); // reset the global bank only
await seedIfEmpty();
process.exit(0);
