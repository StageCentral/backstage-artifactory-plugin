# [Jfrog](https://jfrog.com) Artifactory Plugins for [Backstage](https://backstage.io) by [StageCentral](https:..stagecentral.io)


<img src="logo/logo.png" width=100 height=100/>

---

Welcome to the Artifactory plugin suite for Backstage!

This is a combination of 2 plugins - the [frontend](./plugins/artifactory/README.md) and the [backend](./plugins/artifactory-backend/README.md).

The purpose of these plugins is to bring software artifacts forward - where developers can see them.
You can now easily connect your software components and services to their binary artifacts and browse the relevant artifacts directly from your Bacsktage IDP.

## The Frontend

Currently the frontend plugin allows you to add a tab showing the list of the artifacts related to a Backstage entity:
![Artifact List](images/artifact_list.png)

Artifacts are matched by their name or property.
Default property name is `catalog.component` but is configurable.

## Configuration

For the configuration of the plugins - refer to their respective documentation: [frontend](./plugins/artifactory/README.md), [backend](./plugins/artifactory-backend/README.md)

### Connecting Artifacts to Entities

By default artifacts are looked up with the following AQL (Artifactory Query Language): 
```
items.find({"$or":[{"@ARTIFACT_PROPERTY":{"$eq":"ENTITY_NAME"},"path":{"$eq":"ENTITY_NAME"}}],"type":"folder","path":{"$ne":"."},"name":{"$ne":"_uploads"}})
```
Whereas default `ARTIFACT_PROPERTY` is `catalog.component` but can be modified by setting `artifactory.artifactProperty` in 'app-config.yaml`.

`ENTITY_NAME` by default is the actual entity name but can be modified by setting `metadata.annotations.backstage.io/artifactory-id` in `catalog-info.yaml` of the entity.


Brought to you with love by [StageCentral](https://stagecentral.io)

