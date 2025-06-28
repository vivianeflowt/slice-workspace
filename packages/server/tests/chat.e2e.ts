import axios from 'axios';
import { Reports } from './__fixtures__/reports';
import { BASE_URL, CHECK_MARK, CROSS_MARK } from './__fixtures__/constants';
import { performance } from 'perf_hooks';

const modelsEndpoint = `${BASE_URL}/models`;
const askEndpoint = `${BASE_URL}/ask`;

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
    let elapsedMs = null;
    try {
      const start = performance.now();
      const { data } = await axios.post(askEndpoint, {
        prompt,
        provider,
        model,
        system: 'Responda apenas com ok.',
      });
      elapsedMs = performance.now() - start;
      response = data.text || data.result || data;
      ok = typeof response === 'string' && response.toLowerCase().includes('ok');
      console.log(
        `ASK: ${provider} / ${model}: ${ok ? CHECK_MARK : CROSS_MARK} (${elapsedMs.toFixed(0)}ms)`,
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      response = { error: msg };
      console.log(`ASK: ${provider} / ${model}: ${CROSS_MARK}`);
    }
    const result = { provider, model, ok, response, elapsedMs };
    results.push(result);
    Reports.append('ask_e2e', result);
  }
  Reports.save('ask_e2e_last', results);
  console.log(`Relatório ASK salvo em reports/ask_e2e_last.json`);
}

(async () => {
  await testAskEndpoint();
})();
