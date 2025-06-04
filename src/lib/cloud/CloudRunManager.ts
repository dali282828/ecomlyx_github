import { google } from '@google-cloud/run';
import { google as googleAuth } from 'google-auth-library';

export class CloudRunManager {
  private runClient;
  private projectId: string;
  private region: string;

  constructor() {
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT!;
    this.region = process.env.GOOGLE_CLOUD_REGION!;
    this.runClient = new google.run('v1');
  }

  async scaleService(serviceName: string, minInstances: number, maxInstances: number) {
    const auth = await googleAuth.getClient({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    await this.runClient.namespaces.services.patch({
      auth,
      name: `namespaces/${this.projectId}/services/${serviceName}`,
      requestBody: {
        spec: {
          template: {
            spec: {
              containerConcurrency: 80,
              timeoutSeconds: 300,
              containers: [{
                resources: {
                  limits: {
                    cpu: '1000m',
                    memory: '1Gi',
                  },
                },
              }],
            },
          },
        },
      },
    });
  }

  async getServiceMetrics(serviceName: string) {
    const auth = await googleAuth.getClient({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    const response = await this.runClient.namespaces.services.get({
      auth,
      name: `namespaces/${this.projectId}/services/${serviceName}`,
    });

    return {
      currentInstances: response.data.status?.replicas || 0,
      desiredInstances: response.data.spec?.template?.spec?.containerConcurrency || 0,
    };
  }
} 