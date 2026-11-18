
import * as http from 'node:http';
import * as si from 'systeminformation';

interface ISystemInformation {
  cpu: si.Systeminformation.CpuData;
  system: si.Systeminformation.SystemData;
  mem: si.Systeminformation.MemData;
  os: si.Systeminformation.OsData;
  currentLoad: si.Systeminformation.CurrentLoadData;
  processes: si.Systeminformation.ProcessesData;
  diskLayout: si.Systeminformation.DiskLayoutData[];
  networkInterfaces:
    | si.Systeminformation.NetworkInterfacesData
    | si.Systeminformation.NetworkInterfacesData[];
}

async function getSystemInformation(): Promise<ISystemInformation> {
  const [
    cpu,
    system,
    mem,
    os,
    currentLoad,
    processes,
    diskLayout,
    networkInterfaces,
  ] = await Promise.all([
    si.cpu(),
    si.system(),
    si.mem(),
    si.osInfo(),
    si.currentLoad(),
    si.processes(),
    si.diskLayout(),
    si.networkInterfaces(),
  ]);

  return {
    cpu,
    system,
    mem,
    os,
    currentLoad,
    processes,
    diskLayout,
    networkInterfaces,
  };
}

const server = http.createServer();

server.on('request', async (request, res) => {
  if (request.url === '/api/v1/sysinfo' && request.method === 'GET') {
    try {
      const data = await getSystemInformation();

      res.writeHead(200, {
        'Content-Type': 'application/json',
      });

      res.end(JSON.stringify(data));
    } catch (error) {
      res.writeHead(500, {
        'Content-Type': 'application/json',
      });

      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  } else {
    res.writeHead(404, {
      'Content-Type': 'application/json',
    });

    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(8000, () => {
  console.log('Server listening on http://localhost:8000');
});
