import { SSM } from 'aws-sdk';
import { loadSSMSecrets } from '../src';

const ssm = new SSM({ endpoint: `http://localhost:4583`, region: 'eu-west-1' });

describe('Integration test', () => {
  it('Should load and decrypt values from ssm', async () => {
    await ssm.putParameter({ Name: 'test1', Value: 'v1', Type: 'SecureString', Overwrite: true }).promise();
    await ssm.putParameter({ Name: '/bit/test2', Value: 'v2', Type: 'SecureString', Overwrite: true }).promise();

    const env: NodeJS.ProcessEnv = {
      NODE_ENV: 'production',
      DB: 'postgresql://test:123',
      PASSWORD: 'ssm://test1',
      API_KEY: 'ssm:///bit/test2',
    };

    await expect(loadSSMSecrets(ssm, env)).resolves.toEqual({
      NODE_ENV: 'production',
      DB: 'postgresql://test:123',
      PASSWORD: 'v1',
      API_KEY: 'v2',
    });

    await expect(loadSSMSecrets(ssm, { UNKNOWN: 'ssm://unknown' })).rejects.toEqual(
      new Error('SSM parameters invalid: unknown'),
    );

    await expect(loadSSMSecrets(ssm, { NO_SSM: 'val' })).resolves.toEqual({ NO_SSM: 'val' });
  });
});
