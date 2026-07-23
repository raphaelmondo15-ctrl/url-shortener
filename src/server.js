
import app from './app.js';
import {createServer} from 'node:http';
import { createTables } from './sql/schema.js';


const PORT = process.env.PORT || 3000;
 
await createTables();

const server = createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
