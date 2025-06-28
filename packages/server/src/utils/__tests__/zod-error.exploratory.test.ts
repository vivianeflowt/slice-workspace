import { describe, it } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { z, ZodError } from 'zod';
import { validateSchema, parseZodError } from '../zod-error';

const tmpDir = os.tmpdir();

describe('validateSchema exploratory', () => {
  it('salva outputs de erro para análise', async () => {
    const schema = z.object({
      name: z.string().min(2, 'Nome muito curto'),
      age: z.number().int().min(0, 'Idade inválida'),
      email: z.string().email('Email inválido'),
    });

    const validate = validateSchema(schema);

    const cases = [
      { name: '', age: -1, email: 'foo' },
      { name: 'A', age: 'abc', email: 'bar@' },
      { name: 'Ana', age: 30, email: 'ana@email.com' }, // válido
    ];

    for (let i = 0; i < cases.length; i++) {
      try {
        await validate(cases[i]);
      } catch (err) {
        const rawFile = path.join(tmpDir, `zod-raw-${i}.json`);
        const parsedFile = path.join(tmpDir, `zod-parsed-${i}.json`);
        await fs.writeJson(rawFile, err, { spaces: 2 });
        if (err instanceof ZodError) {
          await fs.writeJson(parsedFile, parseZodError(err), { spaces: 2 });
        } else {
          await fs.writeJson(parsedFile, { error: 'Not a ZodError', details: err }, { spaces: 2 });
        }
      }
    }
  });
});
