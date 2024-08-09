import { ConsoleLogger, Injectable } from "@nestjs/common";

import { DiagConsoleLogger, trace, context, DiagLogLevel, diag } from '@opentelemetry/api'
import { SeverityNumber } from '@opentelemetry/api-logs';
import { Resource } from '@opentelemetry/resources';
import {
    LoggerProvider,
    BatchLogRecordProcessor,
} from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'adbox',
});

const loggerProvider = new LoggerProvider({
    resource
});

loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(new OTLPLogExporter({
    url: 'http://localhost:4318/v1/logs',
    keepAlive: true,
})));


@Injectable()
export class OtlpLogger extends ConsoleLogger {
    private readonly loggerOtel = loggerProvider.getLogger('default');

    /**
     * Write a 'log' level log.
     */
    log(message: any, ...optionalParams: any[]) {
        super.log(message, optionalParams);
        this.otlpLogging(message, { text: 'INFO', number: SeverityNumber.INFO }, optionalParams);
    }

    info(message: any, ...optionalParams: any[]) {
        super.log(message);
        this.otlpLogging(message, { text: 'INFO', number: SeverityNumber.INFO }, optionalParams);
    }


    /**
     * Write a 'fatal' level log.
     */
    fatal(message: any, ...optionalParams: any[]) {
        super.fatal(message, optionalParams);
        this.otlpLogging(message, { text: 'FATAL', number: SeverityNumber.FATAL }, optionalParams);
    }

    /**
     * Write an 'error' level log.
     */
    error(message: any, ...optionalParams: any[]) {
        super.error(message, optionalParams);
        this.otlpLogging(message, { text: 'ERROR', number: SeverityNumber.ERROR }, optionalParams);
    }

    /**
     * Write a 'warn' level log.
     */
    warn(message: any, ...optionalParams: any[]) {
        super.warn(message);
        this.otlpLogging(message, { text: 'WARN', number: SeverityNumber.WARN }, optionalParams);
    }

    /**
     * Write a 'debug' level log.
     */
    debug(message: any, ...optionalParams: any[]) {
        super.debug(message, optionalParams);
        this.otlpLogging(message, { text: 'DEBUG', number: SeverityNumber.DEBUG }, optionalParams);
    }

    /**
     * Write a 'verbose' level log.
     */
    verbose(message: any, ...optionalParams: any[]) {
        super.verbose(message, optionalParams);
        this.otlpLogging(message, { text: 'TRACE', number: SeverityNumber.TRACE }, optionalParams);
    }

    private otlpLogging(message: any, { text, number }: { text: string, number: SeverityNumber }, ...optionalParams: any[]) {
        let [attributes] = optionalParams;

        if (typeof attributes === "string") {
            attributes = { appContext: attributes };
        } else {
            attributes = { ...(attributes || {}), appContext: this.context };
        }


        this.loggerOtel.emit({
            severityNumber: number,
            severityText: text,
            body: message,
            attributes: {
                ...attributes,

            },
            context: context.active(),
            timestamp: new Date()
        });
    }
}