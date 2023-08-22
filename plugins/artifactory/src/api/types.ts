import { Entity } from '@backstage/catalog-model';
import { createApiRef } from '@backstage/core-plugin-api';

export interface ArtifactoryPluginApi {
  getHealth(): Promise<{ status: string; }>;
  getArtifacts(entity: Entity): Promise<Artifact[]>;
}

export const ArtifactoryPluginApiRef = createApiRef<ArtifactoryPluginApi>({
  id: 'plugin.otom80artifactoryplugin.service',
});

export type Artifact = {
  name: string;
  path: string;
  repo: string;
  size: number;
  created: string;
  modified: string;
  updated: string;
  createdBy: string;
  modifiedBy: string;
  updatedBy: string;
  sha1: string;
  md5: string;
}