import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useArtifactoryObjects } from '../../hooks/useArtifactoryPlugin'
import { Table, TableColumn } from '@backstage/core-components';
import { Artifact } from '../../api/types';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

type DenseTableProps = {
  artifacts: Artifact[];
};

export const DenseTable = ({ artifacts }: DenseTableProps) => {
  const configApi = useApi(configApiRef);
  const jfrogUrl = configApi.getString('artifactory.url') + '/artifactory';
  const columns: TableColumn[] = [
    { title: 'Name', field: 'name' },
    { title: 'path', field: 'path' },
    { title: 'repo', field: 'repo' },
    { title: 'url', field: 'url', render: (row: any) => <a href={`${jfrogUrl}/${row.repo}/${row.path}/${row.name}`}>{`${jfrogUrl}/${row.repo}/${row.path}/${row.name}`}</a> },
  ];

  const data = artifacts.map(artifact => {
    return {
      name: artifact.name,
      path: artifact.path,
      repo: artifact.repo,
      url: `${jfrogUrl}/artifactory/${artifact.repo}/${artifact.path}/${artifact.name}`
    };
  });

  return (
    <Table
      title={`Artifact List (fetching data from ${jfrogUrl})`}
      options={{ search: false, paging: false }}
      columns={columns}
      data={data}
    />
  );
};

export const ArtifactoryComponent = () => {
  const { entity } = useEntity();
  const { error, loading, artifacts } = useArtifactoryObjects(entity);
  if (loading) {
    return <div>Loading</div>;
  }
  if (error) {
    return <div>Error</div>;
  }
  return <DenseTable artifacts={artifacts || []} />;

};
