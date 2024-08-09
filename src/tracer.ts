'use strict';

import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import * as opentelemetry from '@opentelemetry/sdk-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
// import { NodeTracerProvider } from '@opentelemetry/node';
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core'
import { trace } from '@opentelemetry/api';

import {
    ConsoleSpanExporter,
    BatchSpanProcessor,
    NodeTracerProvider,
    SimpleSpanProcessor
} from '@opentelemetry/sdk-trace-node';

// Configure the SDK to export telemetry data to the console
// Enable all auto-instrumentations from the meta package
const exporterOptions = {
    url: 'http://localhost:4318/v1/traces',
};

const traceExporter = new OTLPTraceExporter(exporterOptions);


const provider = new NodeTracerProvider({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'adbox',
    })
});
const consoleExporter = new ConsoleSpanExporter();
const spanProcessor = new SimpleSpanProcessor(traceExporter);
provider.addSpanProcessor(spanProcessor);
// provider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));
provider.register();

registerInstrumentations({
    instrumentations: [new NestInstrumentation()],
    tracerProvider: provider
});

// const sdk = new opentelemetry.NodeSDK({
//     traceExporter,
//     instrumentations: [getNodeAutoInstrumentations()],
//     resource: new Resource({
//         [SemanticResourceAttributes.SERVICE_NAME]: 'adbox',
//     }),
//     autoDetectResources: true,
// });

// // initialize the SDK and register with the OpenTelemetry API
// // this enables the API to record telemetry
// sdk.start();
console.log('Tracing has started');

// gracefully shut down the SDK on process exit
// process.on('SIGTERM', () => {
//     sdk
//         .shutdown()
//         .then(() => console.log('Tracing terminated'))
//         .catch((error) => console.log('Error terminating tracing', error))
//         .finally(() => process.exit(0));
// });

// export default sdk;

const tracer = trace.getTracer('adbox');
tracer.startSpan('startserver').end();

export default tracer;