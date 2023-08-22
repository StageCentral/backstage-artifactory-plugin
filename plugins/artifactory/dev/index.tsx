import React from 'react';
import { Entity } from '@backstage/catalog-model';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { createDevApp } from '@backstage/dev-utils';
import { otom8OArtifactoryPlugin, Otom8OArtifactoryPage, EntityOtom8OArtifactoryContent } from '../src/plugin';
import { otom8OArtifactoryPluginApi, otom8OArtifactoryPluginApiRef } from '../src';
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

class MockArtifactoryPluginClient implements otom8OArtifactoryPluginApi {
  async getHealth(): Promise<{ status: string; }> {
    return { status: 'ok'};
  }
}

createDevApp()
  .registerPlugin(otom8OArtifactoryPlugin)
  .addPage({
    element: (
      <TestApiProvider
      apis={[[otom8OArtifactoryPluginApiRef, new MockArtifactoryPluginClient()]]} 
      >
        <EntityProvider entity={mockEntity}>
          <EntityOtom8OArtifactoryContent />
        </EntityProvider>
      </TestApiProvider>
    ),
    title: 'Root Page',
    path: '/otom8o-artifactory'
  })
  .render();
