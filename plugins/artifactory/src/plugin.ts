
import { 
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
} from '@backstage/core-plugin-api';
import { ArtifactoryPluginBackendClient } from './api/ArtifactoryPluginBackendClient';
import { ArtifactoryPluginApiRef } from './api';

import { rootRouteRef } from './routes';

export const ArtifactoryPlugin = createPlugin({
  id: 'stagecentral-artifactory',
  apis: [
    createApiFactory({
      api: ArtifactoryPluginApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
      },
      factory: ({ discoveryApi}) =>
        new ArtifactoryPluginBackendClient({ discoveryApi }),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const EntityArtifactoryContent = ArtifactoryPlugin.provide(
  createRoutableExtension({
    name: 'EntityArtifactoryContent',
    component: () =>
      import('./components/ArtifactoryComponent').then(m => m.ArtifactoryComponent),
    mountPoint: rootRouteRef,
  }),
);
