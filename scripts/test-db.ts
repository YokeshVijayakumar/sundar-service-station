import { MongoClient } from 'mongodb';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const variations = [
  { u: 'Sundar_Service_Station', p: 'Augustin@123' },
  { u: 'sundar_service_station', p: 'Augustin@123' },
  { u: 'SundarServiceStation', p: 'Augustin@123' },
  { u: 'sundarservicestation', p: 'Augustin@123' },
  { u: 'Sundar_Service_Station', p: 'augustin@123' },
  { u: 'sundar_service_station', p: 'augustin@123' },
  { u: 'admin', p: 'Augustin@123' },
];

async function testConnections() {
  for (const v of variations) {
    const pass = encodeURIComponent(v.p);
    const uri = `mongodb+srv://${v.u}:${pass}@cluster0.yadlu9o.mongodb.net/sundar_service_station?retryWrites=true&w=majority&appName=Cluster0`;
    console.log(`Testing user: "${v.u}" ...`);
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
