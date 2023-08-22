import { JfrogClient } from "jfrog-client-js";
import { Logger } from 'winston';
import { errorHandler, UrlReader } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { Entity } from '@backstage/catalog-model';

/** @public */

// create type for Artifact
export type Artifact = {
    repo: string;
    path: string;
    name: string;
    actual_sha1: string;
    actual_md5: string;
    size: number;
    created: string;
    modified: string;
    type: string;
    virtual_repos: string[];
};



/** @public */

type Artifactory = {
    logger: Logger;
    client: JfrogClient;
    config: Config;
    getArtifactsByName(name: string): Promise<Artifact[]>;
    getArtifacts(entity: Entity): Promise<Artifact[]>;
    };

export type { Artifactory };

/** @public */
export class ArtifactoryApi implements Artifactory {

    logger: Logger;
    client: JfrogClient;
    config: Config;


    public constructor(
      config: Config,
        logger: Logger,
      ) {
        this.logger = logger;
        this.config = config.getConfig('artifactory');
        this.client = new JfrogClient({
            platformUrl: config.getString('url'), 
            // artifactoryUrl - Set to use a custom Artifactory URL.
            // xrayUrl - Set to use a custom Xray URL.              
            username: config.getString('user'),
            password: config.getString('password'),
            // accessToken - Set to use an access token instead of username and password.
  
            // Optional parameters
            //proxy: { host: '<organization>-xray.jfrog.io', port: 8081, protocol: 'https' },
            //headers: { key1: 'value1', key2: 'value2' },
            // Connection retries. If not defined, the default value is 5.
            retries: 1,
            // Timeout before the connection is terminated in milliseconds, the default value is 60 seconds
            //timeout: 20,
            // Status codes that trigger retries. the default is network error or a 5xx status code.
            //retryOnStatusCode: (statusCode: number) => statusCode >= 500,
            // Delay between retries, in milliseconds. The default is 1000 milliseconds.
            //retryDelay: 1000,    
            }
        );
        logger.debug(this.client);
    }
        
    public async getArtifacts(entity: Entity): Promise<Artifact[]> {
        let artifacts : Artifact[] = [];
        this.logger.debug("in get artifacts by prop!!!");

        const entityName =
            entity.metadata?.annotations?.['backstage.io/artifactory-id'] ||
            entity.metadata?.name;
        const artifactProperty = this.config.getOptionalString('artifactProperty') || 'catalog.component';
        await this.client.artifactory()
                                        .search()
                                        .aqlSearch(`items.find({
                                            "$or": [
                                              {
                                                "@${artifactProperty}": {
                                                  "$eq": "${entityName}"
                                                },
                                                "path": {
                                                  "$eq": "${entityName}"
                                                }
                                              }
                                            ],
                                            "type": "folder",
                                            "path": {
                                              "$ne": "."
                                            },
                                            "name": {
                                                "$ne": "_uploads"
                                            }
                                          })`)
                                        .then((response) => {
                                            this.logger.debug("got response!!!");
                                            artifacts = response.results;
                                            return artifacts;
                                        }).catch((error) => {
                                            this.logger.error(error);
                                        });
        this.logger.debug("print artifacts by PROP:");
        this.logger.debug(JSON.stringify(artifacts));
        return artifacts;
    }

    public async pingArtifactory() {
        this.client.artifactory()
        .system()
        .version()
        .then((result) => {
          this.logger.debug(result);
        })
        .catch((error) => {
          this.logger.error(error);
        });
    }
}   

export default ArtifactoryApi;

