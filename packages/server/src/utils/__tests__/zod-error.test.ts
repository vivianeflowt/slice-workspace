import { describe, it, expect } from 'vitest';
import { z, ZodError } from 'zod';
import { validateSchema, parseZodError, validateSchemaOrThrow } from '../zod-error';

describe('validateSchema', () => {
  const schema = z.object({
    name: z.string().min(2, 'Nome muito curto'),
    age: z.number().int().min(0, 'Idade inválida'),
    email: z.string().email('Email inválido'),
  });
  const validate = validateSchema(schema);

  it('valida dados corretos', async () => {
    const data = { name: 'Ana', age: 30, email: 'ana@email.com' };
    const result = await validate(data);
    expect(result).toEqual(data);
  });

  it('lança ZodError para campo obrigatório faltando', async () => {
    expect.assertions(1);
    try {
      await validate({ age: 20, email: 'a@a.com' });
    } catch (err) {
      expect(err).toBeInstanceOf(ZodError);
    }
  });

  it('lança ZodError para múltiplos erros', async () => {
    expect.assertions(2);
    try {
      await validate({ name: '', age: -1, email: 'foo' });
    } catch (err) {
      expect(err).toBeInstanceOf(ZodError);
      if (err instanceof ZodError) {
        expect(err.errors.length).toBeGreaterThan(1);
      }
    }
  });

  it('lança ZodError para tipo errado', async () => {
    expect.assertions(1);
    try {
      await validate({ name: 'Ana', age: 'abc', email: 'a@a.com' });
    } catch (err) {
      expect(err).toBeInstanceOf(ZodError);
    }
  });

  it('valida com valores default do schema', async () => {
    const schemaWithDefault = z.object({
      name: z.string().default('Sem nome'),
      age: z.number().int().min(0).default(18),
    });
    const validateDefault = validateSchema(schemaWithDefault);
    const result = await validateDefault({});
    expect(result).toEqual({ name: 'Sem nome', age: 18 });
  });

  it('lança ZodError para objeto vazio se não houver default', async () => {
    expect.assertions(1);
    try {
      await validate({});
    } catch (err) {
      expect(err).toBeInstanceOf(ZodError);
    }
  });
});

describe('parseZodError', () => {
  const schema = z.object({
    name: z.string().min(2, 'Nome muito curto'),
    age: z.number().int().min(0, 'Idade inválida'),
    email: z.string().email('Email inválido'),
  });
  const validate = validateSchema(schema);

  it('retorna mensagem amigável para erro simples', async () => {
    try {
      await validate({ age: 20, email: 'a@a.com' });
    } catch (err) {
      if (err instanceof ZodError) {
        const parsed = parseZodError(err);
        expect(parsed.message).toContain('Required');
        expect(parsed.details[0].path).toContain('name');
      }
    }
  });

  it('retorna todas as mensagens para múltiplos erros', async () => {
    try {
      await validate({ name: '', age: -1, email: 'foo' });
    } catch (err) {
      if (err instanceof ZodError) {
        const parsed = parseZodError(err);
        expect(parsed.message.length).toBeGreaterThan(1);
        expect(parsed.details.length).toBeGreaterThan(1);
        expect(parsed.message).toContain('Nome muito curto');
        expect(parsed.message).toContain('Idade inválida');
        expect(parsed.message).toContain('Email inválido');
      }
    }
  });

  it('retorna mensagem para tipo errado', async () => {
    try {
      await validate({ name: 'Ana', age: 'abc', email: 'a@a.com' });
    } catch (err) {
      if (err instanceof ZodError) {
        const parsed = parseZodError(err);
        expect(parsed.message.length).toBeGreaterThan(0);
        expect(parsed.details[0].path).toContain('age');
      }
    }
  });
});

describe('validateSchemaOrThrow', () => {
  const schema = z.object({
    name: z.string().min(2, 'Nome muito curto'),
    age: z.number().int().min(0, 'Idade inválida'),
    email: z.string().email('Email inválido'),
  });
  const validate = validateSchemaOrThrow(schema);

  it('retorna dados corretos se válidos', async () => {
    const data = { name: 'Ana', age: 30, email: 'ana@email.com' };
    const result = await validate(data);
    expect(result).toEqual(data);
  });

  it('lança ZodError para campo obrigatório faltando', async () => {
    expect.assertions(1);
    try {
      await validate({ age: 20, email: 'a@a.com' });
    } catch (err) {
      expect(err).toBeInstanceOf(ZodError);
    }
  });

  it('lança ZodError para múltiplos erros', async () => {
    expect.assertions(2);
    try {
      await validate({ name: '', age: -1, email: 'foo' });
    } catch (err) {
      expect(err).toBeInstanceOf(ZodError);
      if (err instanceof ZodError) {
        expect(err.errors.length).toBeGreaterThan(1);
      }
    }
  });
});
