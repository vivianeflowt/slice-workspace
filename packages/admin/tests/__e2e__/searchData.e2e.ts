import { searchDataFlexible } from "../../src/utils/searchData";
import path from "path";

describe("Busca flexível de tasks", () => {
  const baseDir = path.resolve(__dirname, "../../src/data/tasks");

  it("deve encontrar tasks por habilidade", () => {
    const results = searchDataFlexible({ habilidade: "docker" }, baseDir, {
      fieldsPriority: ["habilidade"],
    });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].content).toMatch(/docker/);
  });

  it("deve encontrar tasks por categoria", () => {
    const results = searchDataFlexible({ category: "frontend" }, baseDir, {
      fieldsPriority: ["category"],
    });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].content).toMatch(/frontend/);
  });

  it("deve combinar busca por prioridade e habilidade", () => {
    const results = searchDataFlexible(
      { prioridade: "alta", habilidade: "segurança" },
      baseDir,
      { mode: "AND", fieldsPriority: ["prioridade", "habilidade"] }
    );
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].content).toMatch(/segurança/);
  });
});
