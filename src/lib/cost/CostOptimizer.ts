import { ConnectionManager } from '../database/ConnectionManager';
import { CloudRunManager } from '../cloud/CloudRunManager';

export class CostOptimizer {
  private connectionManager: ConnectionManager;
  private cloudRunManager: CloudRunManager;

  constructor() {
    this.connectionManager = new ConnectionManager();
    this.cloudRunManager = new CloudRunManager();
  }

  async optimizeResources() {
    // Monitor database instances
    await this.connectionManager.monitorInstances();

    // Optimize Cloud Run services
    const services = ['website-builder', 'api-service', 'worker-service'];
    for (const service of services) {
      const metrics = await this.cloudRunManager.getServiceMetrics(service);
      
      // Scale down during low traffic periods
      if (this.isLowTrafficPeriod()) {
        await this.cloudRunManager.scaleService(service, 1, 3);
      } else {
        await this.cloudRunManager.scaleService(service, 2, 10);
      }
    }
  }

  private isLowTrafficPeriod(): boolean {
    const hour = new Date().getHours();
    return hour >= 22 || hour <= 6; // Low traffic during night
  }
} 