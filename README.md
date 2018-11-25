# SSM ENV Secrets

This function is loads data from AWS Systems Manager (SSM) Parameter Store. This way you can securely store secrets and retrieve them at runtime in production, but rely on dummy values in dev/testing.

This module ships with TypeScript types.

### Using

```bash
yarn add @ovotech/ssm-env-secrets
```

If you have a parameter in SSM Parameter store called `my-secret-key` with your secret value. And your env vars look like this:

```
NODE_ENV=something
API_ID=my-id
API_KEY=ssm://my-secret-key
```

Then you can load the secret values with:

```ts
import { loadSSMSecrets } from '@ovotech/ssm-env-secrets';
import { SSM } from 'aws-sdk';

const ssm = new SSM({ region: 'eu-west-1' });
const env = loadSSMSecrets(ssm, process.env);

console.log(env.API_KEY); // will hold the decrypted value of "my-secret-key" parameter
```

## Running the tests

The tests require a running ssm mock server, and we're using [localstack](https://github.com/localstack/localstack) for that.
You'll need to start the ssm server:

```bash
SERVICES=ssm localstack start
```

After which you can run all the tests:

```bash
yarn test
```

### Coding style (linting, etc) tests

Style is maintained with prettier and tslint

```
yarn lint
```

## Deployment

To deploy a new version, push to master and then create a new release. CircleCI will automatically build and deploy a the version to the npm registry.

## Contributing

Have a bug? File an issue with a simple example that reproduces this so we can take a look & confirm.

Want to make a change? Submit a PR, explain why it's useful, and make sure you've updated the docs (this file) and the tests (see `test/S3DataSource.spec.ts`). You can run the tests with `SERVICES=ssm localstack start` and `yarn test`.

## Responsible Team

- Boost Internal Tools (BIT)

## License

This project is licensed under Apache 2 - see the [LICENSE](LICENSE) file for details
