interface ModelMonitorConfig {
  modelName: string;
  datasetName: string;
  targetMetric: string;
  threshold: number;
  notificationChannel: string;
}

interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  latency: number;
}

interface DataDriftDetection {
  featureImportance: { [feature: string]: number };
  distributionShift: { [feature: string]: boolean };
}

interface ModelMonitor {
  config: ModelMonitorConfig;
  performance: ModelPerformance;
  dataDrift: DataDriftDetection;
  lastUpdated: Date;
}

interface Alert {
  type: string;
  message: string;
  timestamp: Date;
}

class ModelMonitorService {
  private monitors: { [modelName: string]: ModelMonitor };
  private alerts: Alert[];

  constructor() {
    this.monitors = {};
    this.alerts = [];
  }

  addMonitor(config: ModelMonitorConfig): void {
    const monitor = {
      config,
      performance: {},
      dataDrift: {},
      lastUpdated: new Date(),
    };
    this.monitors[config.modelName] = monitor;
  }

  updatePerformance(modelName: string, performance: ModelPerformance): void {
    if (this.monitors[modelName]) {
      this.monitors[modelName].performance = performance;
      this.monitors[modelName].lastUpdated = new Date();
    }
  }

  detectDataDrift(modelName: string, dataDrift: DataDriftDetection): void {
    if (this.monitors[modelName]) {
      this.monitors[modelName].dataDrift = dataDrift;
      this.monitors[modelName].lastUpdated = new Date();
    }
  }

  getMonitors(): ModelMonitor[] {
    return Object.values(this.monitors);
  }

  getAlerts(): Alert[] {
    return this.alerts;
  }

  checkThresholds(): void {
    for (const monitor of Object.values(this.monitors)) {
      if (monitor.performance.accuracy < monitor.config.threshold) {
        this.alerts.push({
          type: 'accuracyThreshold',
          message: `Model ${monitor.config.modelName} accuracy below threshold`,
          timestamp: new Date(),
        });
      }
    }
  }
}