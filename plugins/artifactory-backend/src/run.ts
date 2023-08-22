import { getRootLogger } from '@backstage/backend-common';
import yn from 'yn';
import { startStandaloneServer } from './service/standaloneServer';
import { ConfigReader } from '@backstage/config';
import { CatalogClient } from '@backstage/catalog-client';
import { SingleHostDiscovery } from '@backstage/backend-common';

const port = process.env.PLUGIN_PORT ? Number(process.env.PLUGIN_PORT) : 7007;
const enableCors = yn(process.env.PLUGIN_CORS, { default: false });
const logger = getRootLogger();
const config = ConfigReader.fromConfigs([]);
const catalogApi = new CatalogClient({
  discoveryApi: SingleHostDiscovery.fromConfig(config),
});

startStandaloneServer({ port, enableCors, logger, config, catalogApi }).catch(err => {
  logger.error(err);
  config;
  process.exit(1);
});

process.on('SIGINT', () => {
  logger.info('CTRL+C pressed; exiting.');
  process.exit(0);
});
