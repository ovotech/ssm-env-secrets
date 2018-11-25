import { SSM } from 'aws-sdk';

export const loadSSMSecrets = async (ssm: SSM, env: NodeJS.ProcessEnv) => {
  const ssmKeys = Object.keys(env).filter(key => env[key] && env[key]!.startsWith('ssm://'));
  if (ssmKeys.length === 0) {
    return env;
  }

  const { InvalidParameters, Parameters } = await ssm
    .getParameters({
      Names: ssmKeys.map(key => env[key]!.slice(6)),
      WithDecryption: true,
    })
    .promise();

  if (InvalidParameters && InvalidParameters.length) {
    throw new Error(`SSM parameters invalid: ${InvalidParameters.join(', ')}`);
  }

  return ssmKeys.reduce((merged, key) => {
    const Parameter = Parameters ? Parameters.find(item => env[key]!.endsWith(item.Name!)) : undefined;

    return {
      ...merged,
      [key]: Parameter ? Parameter.Value : undefined,
    };
  }, env);
};
