import { Configuration } from "kalshi-typescript";
import { config } from "./env";

export function createKalshiConfiguration(): Configuration {
  return new Configuration({
    apiKey: config.apiKey,
    basePath: config.basePath,
    ...(config.privateKeyPath
      ? { privateKeyPath: config.privateKeyPath }
      : config.privateKeyPem
        ? { privateKeyPem: config.privateKeyPem }
        : {}),
  });
}
