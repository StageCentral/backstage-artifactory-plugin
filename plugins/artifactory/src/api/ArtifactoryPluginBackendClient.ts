import { Entity } from '@backstage/catalog-model';
import { ArtifactoryPluginApi } from './types';
import { DiscoveryApi } from '@backstage/core-plugin-api';
import { Artifact } from './types';

export class ArtifactoryPluginBackendClient implements ArtifactoryPluginApi {
  private readonly discoveryApi: DiscoveryApi;
  constructor(options: {
    discoveryApi: DiscoveryApi;
  }) {
    this.discoveryApi = options.discoveryApi;

  }
  private async handleResponse(response: Response): Promise<any> {
    if (!response.ok) {
      throw new Error();
    }
    const data = await response.json();
    if (!data.artifacts) {
      return data;
    }
    return data.artifacts as Promise<Artifact[]>;
  }

  async getHealth(): Promise<{ status: string; }> {
    const url = `${await this.discoveryApi.getBaseUrl('artifactory')}/health`;
    const response = await fetch(url, {
      method: 'GET',
    });
    return await this.handleResponse(response);
  }
  async getArtifacts(entity: Entity): Promise<Artifact[]> {
    const url = `${await this.discoveryApi.getBaseUrl('artifactory')}/artifacts`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "puka": "puka"
      },
      body: `{"entityRef": "${entity.kind}:${entity.metadata.namespace}/${entity.metadata.name}" }`,
    });
    return await this.handleResponse(response);
  }
}