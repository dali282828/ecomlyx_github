import { logger } from './logger';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  tags?: Record<string, string>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private timers: Map<string, number> = new Map();

  // Start timing an operation
  startTimer(name: string): void {
    this.timers.set(name, performance.now());
  }

  // End timing and record metric
  endTimer(name: string, tags?: Record<string, string>): number {
    const startTime = this.timers.get(name);
    if (!startTime) {
      logger.warn(`Timer ${name} was not started`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.timers.delete(name);

    this.recordMetric({
      name,
      value: duration,
      unit: 'ms',
      timestamp: new Date(),
      tags,
    });

    return duration;
  }

  // Record a custom metric
  recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // Log if the metric is concerning
    if (this.isMetricConcerning(metric)) {
      logger.warn({
        metric: metric.name,
        value: metric.value,
        unit: metric.unit,
        tags: metric.tags,
      }, 'Performance metric is concerning');
    }

    // Keep only recent metrics (last 1000)
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  // Get metrics summary
  getMetricsSummary(name?: string): {
    count: number;
    average: number;
    min: number;
    max: number;
    p95: number;
  } {
    const filteredMetrics = name 
      ? this.metrics.filter(m => m.name === name)
      : this.metrics;

    if (filteredMetrics.length === 0) {
      return { count: 0, average: 0, min: 0, max: 0, p95: 0 };
    }

    const values = filteredMetrics.map(m => m.value).sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);

    return {
      count: values.length,
      average: sum / values.length,
      min: values[0],
      max: values[values.length - 1],
      p95: values[Math.floor(values.length * 0.95)],
    };
  }

  private isMetricConcerning(metric: PerformanceMetric): boolean {
    const thresholds: Record<string, number> = {
      'database_query': 1000, // 1 second
      'api_request': 2000, // 2 seconds
      'page_load': 3000, // 3 seconds
      'file_upload': 10000, // 10 seconds
    };

    const threshold = thresholds[metric.name];
    return threshold ? metric.value > threshold : false;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Higher-order function for timing async operations
export function withTiming<T extends (...args: any[]) => Promise<any>>(
  name: string,
  fn: T,
  tags?: Record<string, string>
): T {
  return (async (...args: any[]) => {
    performanceMonitor.startTimer(name);
    try {
      const result = await fn(...args);
      performanceMonitor.endTimer(name, tags);
      return result;
    } catch (error) {
      performanceMonitor.endTimer(name, { ...tags, error: 'true' });
      throw error;
    }
  }) as T;
}

// Performance decorator for API routes
export function measurePerformance(metricName: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      performanceMonitor.startTimer(metricName);
      try {
        const result = await method.apply(this, args);
        performanceMonitor.endTimer(metricName);
        return result;
      } catch (error) {
        performanceMonitor.endTimer(metricName, { error: 'true' });
        throw error;
      }
    };
  };
} 