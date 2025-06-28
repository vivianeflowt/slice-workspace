import axios from 'axios';
import { Reports } from './__fixtures__/reports';
import { BASE_URL, CHECK_MARK, CROSS_MARK } from './__fixtures__/constants';

const modelsEndpoint = `${BASE_URL}/models`;
const askEndpoint = `${BASE_URL}/ask`;

async function testModelEndpoints() {
  let models = [];
  try {
    const { data } = await axios.get(modelsEndpoint);
    models = Array.isArray(data) ? data : [];
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log('Erro ao buscar modelos:', msg);
    process.exit(1);
  }
  const results = [];
  for (const modelData of models) {
    const { provider, model } = modelData;
    let byProvider = null,
      byModel = null;
    let providerOk = false,
      modelOk = false;
    try {
      const { data } = await axios.get(
        `${modelsEndpoint}?provider=${encodeURIComponent(provider)}`,
      );
      byProvider = data;
      providerOk = Array.isArray(byProvider) && byProvider.some((m) => m.model === model);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      byProvider = { error: msg };
    }
    try {
      const { data } = await axios.get(`${modelsEndpoint}/${encodeURIComponent(model)}`);
      byModel = data;
      modelOk = byModel && byModel.model === model;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      byModel = { error: msg };
    }
    const result = { provider, model, providerOk, modelOk, byProvider, byModel };
    results.push(result);
    Reports.append('model_endpoints', result);
    console.log(
      `Model: ${model} | Provider: ${provider} | ProviderOK: ${providerOk ? CHECK_MARK : CROSS_MARK} | ModelOK: ${modelOk ? CHECK_MARK : CROSS_MARK}`,
    );
  }
  Reports.save('model_endpoints_last', results);
  console.log(`Relatório salvo em reports/model_endpoints_last.json`);
}

async function testAskEndpoint() {
  let models = [];
  try {
    const { data } = await axios.get(modelsEndpoint);
    models = Array.isArray(data) ? data : [];
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log('Erro ao buscar modelos:', msg);
    process.exit(1);
  }
  const results = [];
  for (const modelData of models) {
    const { provider, model } = modelData;
    const prompt = "Diga 'ok'";
    let response = null;
    let ok = false;
    try {
      const { data } = await axios.post(askEndpoint, {
        prompt,
        provider,
        model,
        system: 'Responda apenas com ok.',
      });
      response = data.text || data.result || data;
      ok = typeof response === 'string' && response.toLowerCase().includes('ok');
      console.log(`ASK: ${provider} / ${model}: ${ok ? CHECK_MARK : CROSS_MARK}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      response = { error: msg };
      console.log(`ASK: ${provider} / ${model}: ❌`);
    }
    const result = { provider, model, ok, response };
    results.push(result);
    Reports.append('model_ask', result);
  }
  Reports.save('model_ask_last', results);
  console.log(`Relatório ASK salvo em reports/model_ask_last.json`);
}

(async () => {
  console.log('--- Testando endpoints de models ---');
  await testModelEndpoints();
  console.log('\n--- Testando endpoint /api/ask para cada model ---');
  await testAskEndpoint();
})();
