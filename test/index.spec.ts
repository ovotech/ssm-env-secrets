import { loadSSMSecrets } from '../src/';

describe('Unit test helpers', () => {
  it.each`
    name                      | env                                       | Parameters                              | expected
    ${'emtpy params'}         | ${{}}                                     | ${[{ Name: 'test', Value: '123' }]}     | ${{}}
    ${'undefined params'}     | ${{ test: undefined }}                    | ${[{ Name: 'test', Value: '123' }]}     | ${{ test: undefined }}
    ${'undefined Parameters'} | ${{ test: 'ssm://test' }}                 | ${[{ Name: 'test', Value: undefined }]} | ${{ test: undefined }}
    ${'loading from ssm'}     | ${{ test: 'ssm://test' }}                 | ${[{ Name: 'test', Value: '123' }]}     | ${{ test: '123' }}
    ${'mix parameters'}       | ${{ test: 'ssm://test', test2: 'other' }} | ${[{ Name: 'test', Value: '123' }]}     | ${{ test: '123', test2: 'other' }}
    ${'undefined Parameters'} | ${{ test: 'ssm://test', test2: 'other' }} | ${undefined}                            | ${{ test: undefined, test2: 'other' }}
    ${'empty Parameters'}     | ${{ test: 'ssm://test', test2: 'other' }} | ${[]}                                   | ${{ test: undefined, test2: 'other' }}
  `('Should use loadSSMSecrets to parse $name', async ({ env, Parameters, expected }) => {
    const ssmParameters = jest.fn().mockResolvedValue({ Parameters });
    const ssm: any = { getParameters: () => ({ promise: ssmParameters }) };
    await expect(loadSSMSecrets(ssm, env)).resolves.toEqual(expected);
  });

  it('Should bypass ssm when no ssm params are present', async () => {
    const ssmParameters = jest.fn();
    const ssm: any = { getParameters: () => ({ promise: ssmParameters }) };

    await expect(loadSSMSecrets(ssm, { test: 'ssh://123' })).resolves.toEqual({ test: 'ssh://123' });
    expect(ssmParameters).not.toHaveBeenCalled();
  });

  it('Should handle invalid parameters', async () => {
    const ssmParameters = jest.fn().mockResolvedValue({ Parameters: [], InvalidParameters: ['test'] });
    const ssm: any = { getParameters: () => ({ promise: ssmParameters }) };

    await expect(loadSSMSecrets(ssm, { test: 'ssm://test' })).rejects.toEqual(
      new Error('SSM parameters invalid: test'),
    );
  });
});
