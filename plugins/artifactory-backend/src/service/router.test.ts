import { getVoidLogger, SingleHostDiscovery } from '@backstage/backend-common';
import { CatalogClient } from '@backstage/catalog-client';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';
import { ConfigReader } from '@backstage/config';

describe('createRouter', () => {
  let app: express.Express;
  let config = ConfigReader.fromConfigs([]);
  let catalogApi = new CatalogClient({ discoveryApi: SingleHostDiscovery.fromConfig(config)});

  beforeAll(async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
      config: config,
      catalogApi:  catalogApi,
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});
