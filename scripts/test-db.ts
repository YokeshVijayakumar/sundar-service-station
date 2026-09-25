import { MongoClient } from 'mongodb';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const variations = [
  { u: 'Sundar Service Station', p: 'rohit123' },
  { u: 'Sundar_Service_Station', p: 'rohit123' },
  { u: 'Sundar_Service_Station', p: 'Augustine@123' },
  { u: 'Sundar Service Station', p: 'Augustine@123' },
];

async function testConnections() {
  for (const v of variations) {
    const user = encodeURIComponent(v.u);
    const pass = encodeURIComponent(v.p);
    const uri = `mongodb+srv://${user}:${pass}@cluster0.yadlu9o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
    console.log(`Testing user: "${v.u}" (${user}) ...`);
    const client = new MongoClient(uri);
    try {
      await client.connect();
      console.log(` SUCCESS! Connected with User: "${v.u}"`);
      await client.close();
      return uri;
    } catch (e: any) {
      console.log(` ❌ Failed for user "${v.u}": ${e.message}`);
    }
  }
  console.log('None of the automatic variations worked.');
}

testConnections();
