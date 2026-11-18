import { jest, beforeEach, describe, test, expect } from '@jest/globals';
import request from 'supertest';
import * as si from 'systeminformation';
import { server } from './index';

jest.mock('systeminformation');

const mockSystemInfo = {
  cpu: {
    manufacturer: 'Intel',
    brand: 'Intel Core i7',
    cores: 8,
  },
  system: {
    manufacturer: 'MSI',
    model: 'Test Machine',
  },
  mem: {
    total: 17179869184,
    free: 8589934592,
  },
  os: {
    platform: 'linux',
    distro: 'Ubuntu',
  },
  currentLoad: {
    currentLoad: 25,
  },
  processes: {
    all: 120,
    running: 5,
  },
  diskLayout: [
    { device: '/dev/sda', size: 512000000000 },
  ],
  networkInterfaces: [
    { iface: 'eth0', ip4: '192.168.1.10' },
  ],
};

// Préparer les réponses fictives
beforeEach(() => {
  jest.resetAllMocks();

  jest.mocked(si.cpu).mockResolvedValue(
    mockSystemInfo.cpu as si.Systeminformation.CpuData
  );
  jest.mocked(si.system).mockResolvedValue(
    mockSystemInfo.system as si.Systeminformation.SystemData
  );
  jest.mocked(si.mem).mockResolvedValue(
    mockSystemInfo.mem as si.Systeminformation.MemData
  );
  jest.mocked(si.osInfo).mockResolvedValue(
    mockSystemInfo.os as si.Systeminformation.OsData
  );
  jest.mocked(si.currentLoad).mockResolvedValue(
    mockSystemInfo.currentLoad as si.Systeminformation.CurrentLoadData
  );
  jest.mocked(si.processes).mockResolvedValue(
    mockSystemInfo.processes as si.Systeminformation.ProcessesData
  );
  jest.mocked(si.diskLayout).mockResolvedValue(
    mockSystemInfo.diskLayout as si.Systeminformation.DiskLayoutData[]
  );
  jest.mocked(si.networkInterfaces).mockResolvedValue(
    mockSystemInfo.networkInterfaces as si.Systeminformation.NetworkInterfacesData[]
  );
});

describe('API System Information', () => {

  test('GET /api/v1/sysinfo retourne 200 et les données JSON', async () => {
    const response = await request(server).get('/api/v1/sysinfo');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body).toEqual(mockSystemInfo);
  });

  test.each([
    '/',
    '/test',
    '/api/v1/unknown',
    '/api/v1/sysinfos',
  ])('GET %s retourne 404', async (path) => {
    const response = await request(server).get(path);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Not Found' });
  });

  test('POST /api/v1/sysinfo retourne 404', async () => {
    const response = await request(server).post('/api/v1/sysinfo');

    expect(response.status).toBe(404);
  });

  test('Erreur système retourne 500', async () => {
    jest.mocked(si.cpu).mockRejectedValueOnce(
      new Error('CPU unavailable')
    );

    const response = await request(server).get('/api/v1/sysinfo');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Internal Server Error',
    });
  });

});
