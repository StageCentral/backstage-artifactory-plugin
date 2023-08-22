import { errorHandler } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import express, { Request } from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
//import from api folder
import { ArtifactoryApi } from '../api/artifactoryApi';
import {
  CompoundEntityRef,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { CatalogApi } from '@backstage/catalog-client';
import { InputError } from '@backstage/errors';
//import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';


export interface RouterOptions {
  logger: Logger;
  config: Config;
  catalogApi: CatalogApi;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;
  const catalogApi = options.catalogApi;

  const config = options.config.getConfig('artifactory');


//  const authHandler = getPersonalAccessTokenHandler(token);
//  const webApi = new WebApi(`https://${host}/${organization}`, authHandler);

  const router = Router();
  router.use(express.json());

  const getEntityByReq = async (req: Request<any>) => {
    const rawEntityRef = req.body.entityRef;

    if (rawEntityRef && typeof rawEntityRef !== 'string') {
      throw new InputError(`entity query must be a string. Got ${rawEntityRef}`);
    } else if (!rawEntityRef) {
      throw new InputError('entity is a required field');
    }
    let entityRef: CompoundEntityRef | undefined = undefined;

    try {
      entityRef = parseEntityRef(rawEntityRef);
    } catch (error) {
      throw new InputError(`Invalid entity ref, ${error}`);
    }

    logger.info(`Got entity ref ${stringifyEntityRef(entityRef)}`);

    // const token = getBearerTokenFromAuthorizationHeader(
    //   req.headers.authorization,
    // );

    // if (!token) {
    //   throw new AuthenticationError('No Backstage token');
    // }

    let entity = await catalogApi.getEntityByRef(entityRef);
    

    if (!entity) {
      throw new InputError(
        `Entity ref missing, ${stringifyEntityRef(entityRef)}`,
      );
    }
    return entity;
  };

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'Froggy' });
  });

  router.post('/artifacts', async (request, response) => {
    logger.debug(`Retrieving artifacts for ${request.body.entityRef}!`);
    const entity = await getEntityByReq(request);

    // call api
    const artifactoryApi = new ArtifactoryApi(config, logger);
    artifactoryApi.getArtifacts(entity).then((artifacts) => {
      logger.debug(`Received ${JSON.stringify(artifacts)}`);
      response.json({ artifacts: artifacts });
    });
  });

  router.get('/ping', (_, response) => {
    logger.info('Pinging artifactory!');
    // call api
    const artifactoryApi = new ArtifactoryApi(config, logger);
    artifactoryApi.pingArtifactory();
    response.json({ result: "ehatenr" });
  });
  router.use(errorHandler());
  return router;
}
