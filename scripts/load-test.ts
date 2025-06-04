import axios from 'axios';
import { performance } from 'perf_hooks';

interface LoadTestConfig {
  baseUrl: string;
  concurrency: number;
  duration: number; // in seconds
  endpoints: Array<{
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: any;
    weight: number; // probability weight
  }>;
}

interface TestResult {
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  success: boolean;
  timestamp: Date;
}

class LoadTester {
  private config: LoadTestConfig;
  private results: TestResult[] = [];
  private running = false;

  constructor(config: LoadTestConfig) {
    this.config = config;
  }

  async run(): Promise<void> {
    console.log(`🚀 Starting load test...`);
    console.log(`Base URL: ${this.config.baseUrl}`);
    console.log(`Concurrency: ${this.config.concurrency}`);
    console.log(`Duration: ${this.config.duration}s`);
    console.log(`Endpoints: ${this.config.endpoints.length}`);

    this.running = true;
    this.results = [];

    // Start concurrent workers
    const workers = Array.from({ length: this.config.concurrency }, (_, i) =>
      this.worker(i)
    );

    // Stop after duration
    setTimeout(() => {
      this.running = false;
    }, this.config.duration * 1000);

    // Wait for all workers to finish
    await Promise.all(workers);

    this.generateReport();
  }

  private async worker(workerId: number): Promise<void> {
    while (this.running) {
      try {
        const endpoint = this.selectRandomEndpoint();
        const result = await this.makeRequest(endpoint);
        this.results.push(result);

        // Small delay to prevent overwhelming
        await new Promise(resolve => setTimeout(resolve, 10));
      } catch (error) {
        console.error(`Worker ${workerId} error:`, error);
      }
    }
  }

  private selectRandomEndpoint() {
    const totalWeight = this.config.endpoints.reduce((sum, ep) => sum + ep.weight, 0);
    let
} 