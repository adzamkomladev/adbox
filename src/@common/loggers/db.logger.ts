import { DefaultLogger, LogContext, LoggerNamespace } from "@mikro-orm/core";
import { OtlpLogger } from "./otlp.logger";

export class DbLogger extends DefaultLogger {
    private readonly customAppLogger = new OtlpLogger(DbLogger.name);

    log(namespace: LoggerNamespace, message: string, context?: LogContext) {
        // Create your own implementation for output:
        this.customAppLogger.info(`[${namespace}] ${message}`);

        // OR Utilize DefaultLogger's implementation:
        // super.log(namespace, message, context);
    }
}