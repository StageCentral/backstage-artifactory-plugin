import { useEffect, useState } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { ArtifactoryPluginApiRef } from '../api/types';
import { Entity } from '@backstage/catalog-model';
import { Artifact } from '../api/types';


export const useArtifactoryObjects = (entity: Entity ) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [artifacts, setArtifacts] = useState<Artifact[]>([]);
    const myPluginApi = useApi(ArtifactoryPluginApiRef);
    const getObjects = async () => {
      try {
        const artifacts = await myPluginApi.getArtifacts(entity);
        setArtifacts(artifacts);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    useEffect(() => {
      getObjects();
    });
    return {
      error,
      loading,
      artifacts: artifacts,
    }
};
