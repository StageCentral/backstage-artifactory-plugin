import React from 'react';
import { ArtifactoryComponent } from './ArtifactoryComponent';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import {
  setupRequestMockHandlers,
  renderInTestApp,
} from "@backstage/test-utils";

describe('ArtifactoryComponent', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  setupRequestMockHandlers(server);

  // setup mock response
  beforeEach(() => {
    server.use(
      rest.get('/*', (_: any, res: (arg0: any, arg1: any) => any, ctx: { status: (arg0: number) => any; json: (arg0: {}) => any; }) => res(ctx.status(200), ctx.json({}))),
    );
  });

  it('should render', async () => {
    await renderInTestApp(
      <ThemeProvider theme={lightTheme}>
        <ArtifactoryComponent />
      </ThemeProvider>,
    );
    expect(screen.getByText('Welcome to artifactory!')).toBeInTheDocument();
  });
});
