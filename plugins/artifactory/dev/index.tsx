import React from 'react';
import { Entity } from '@backstage/catalog-model';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { createDevApp } from '@backstage/dev-utils';
import { ArtifactoryPlugin, EntityArtifactoryContent } from '../src/plugin';
import { ArtifactoryPluginApi, ArtifactoryPluginApiRef } from '../src';
import { TestApiProvider } from '@backstage/test-utils';

const mockEntity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'backstage',
    description: 'backstage.io',
  },
  spec: {
    lifecycle: 'production',
    type: 'service',
    owner: 'user:guest',
  },
};

class MockArtifactoryPluginClient implements ArtifactoryPluginApi {
  async getHealth(): Promise<{ status: string; }> {
    return { status: 'ok'};
  }
}

createDevApp()
  .registerPlugin(ArtifactoryPluginApiRef)
  .addPage({
    element: (
      <TestApiProvider
      apis={[[ArtifactoryPluginApiRef, new MockArtifactoryPluginClient()]]} 
      >
        <EntityProvider entity={mockEntity}>
          <EntityArtifactoryContent />
        </EntityProvider>
      </TestApiProvider>
    ),
    title: 'Root Page',
    path: '/artifactory'
  })
  .render();
