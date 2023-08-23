# Jfrog Artifactory Plugin for Backstage by StageCentral

Welcome to the Artifactory Backend plugin for Backstage!

The purpose of this plugin is to bring software artifacts forward - where developers can see them.
You can now easily connect your software components and services to their binary artifacts and browse the relevant artifacts directly from your Bacsktage IDP.

This plugin uses [jfrog-client-js](https://github.com/jfrog/jfrog-client-js) to connect to Jfrog, so it can potentially be extended to also expose data from XRay and the rest of the Jfrog Platform.

## Important - the Frontend Plugin

This plugin was originally created to provide Jfrog API connection for the [Artifactory plugin for Backstage](https://www.npmjs.com/package/@stagecentral/plugin-artifactory) 
But it exposes APIs that can be used by any other Backstage plugin.

## Installation

Yarn:
`yarn add @stagecentral/plugin-artifactory-backend`

Npm:
`npm -i @stagecentral/plugin-artifactory-backend`

## Configuration

In your `app-config.yaml` (or wherever you inject Backstage config from):
```yaml
artifactory:
    # Note: this is the URL to Jfrog platform. The plugin adds `/artifactory` to this path.
    url: https://myorg.jfrog.io
    # The plugin currently uses simple user/passwd auth.
    # API key support will be added later
    user: ${ARTIFACTORY_USER}
    password: ${ARTIFACTORY_PASSWORD}
```

## Integration

### Add to backend:
Create `packages/backend/src/plugins/artifactory.ts`:

```javascript
import { createRouter } from '@stagecentral/plugin-artifactory-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { CatalogClient } from '@backstage/catalog-client';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogApi = new CatalogClient({ discoveryApi: env.discovery });
  return await createRouter({
    logger: env.logger,
    config: env.config,
    catalogApi,
  }
  );
}
```

In `packages/backend/src/index.ts`:

```javascript
import artifactory from './plugins/artifactory'
...

/* next to other createEnv calls */
const artifactoryEnv = useHotMemoize(module, () => createEnv('artifactory'));

/* next to other apiRouter.use calls */
apiRouter.use('/artifactory', await artifactory(artifactoryEnv));

```
