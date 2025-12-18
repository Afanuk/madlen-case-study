import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

// Enable diagnostic logging for debugging (optional, can be removed in production)
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// Configure the OTLP exporter to send traces to Jaeger
const traceExporter = new OTLPTraceExporter({
  // Jaeger's OTLP HTTP endpoint (default: http://localhost:4318/v1/traces)
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
  headers: {},
});

// Configure the SDK with service information
const sdk = new NodeSDK({
  serviceName: 'madlen-backend',
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      // Automatically instrument Express, HTTP, and other Node.js modules
      '@opentelemetry/instrumentation-fs': {
        enabled: false, // Disable file system instrumentation to reduce noise
      },
    }),
  ],
});

// Start the SDK
sdk.start();

console.log('🔍 OpenTelemetry tracing initialized');

// Gracefully shutdown on process exit
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('🔍 OpenTelemetry tracing terminated'))
    .catch((error) => console.error('Error shutting down tracing', error))
    .finally(() => process.exit(0));
});

export default sdk;
