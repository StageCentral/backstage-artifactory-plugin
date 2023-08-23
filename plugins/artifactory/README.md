# Jfrog Artifactory Plugin for Backstage by StageCentral

Welcome to the Artifactory plugin for Backstage!

The purpose of this plugin is to bring software artifacts forward - where developer can see them.
You can now easily connect your software components and services to their binary artifacts and browse the relevant artifacts directly from your Bacsktage IDP.

## Important - the Backend Plugin

In order to use this plugin please also install the [Artifactory Backend plugin](https://www.npmjs.com/package/@stagecentral/plugin-artifactory-backend)

## Installation

Yarn:
`yarn add @stagecentral/plugin-artifactory`

Npm:
`npm -i @stagecentral/plugin-artifactory`

## Add the 'Artifactory' tab to your entity pages:

In `packages/app/src/components/catalog/EntityPage.tsx`:

```javascript
import { EntityArtifactoryContent } from '@stagecentral/plugin-artifactory';
...

const serviceEntityPage = (
  <EntityLayout>
    
    /* Add the route after other EntityLayout.Route entries */

    <EntityLayout.Route path="/artifactory" title="Artifactory">
      <EntityArtifactoryContent />
    </EntityLayout.Route>

  </EntityLayout>
);
```

## Configuration

Most of the configuration is needed in the correspnding backend plugin.
This plugin only uses the Artifactory URL in order to generate artifact paths in the UI.
In your `app-config.yaml` (or wherever you inject Backstage config from):
```yaml
artifactory:
    url: https://myorg.jfrog.io
```

Note: this is the URL to Jfrog platform. The plugin adds `/artifactory` to this path.
