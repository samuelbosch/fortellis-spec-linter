const { DiagnosticSeverity } = require('@stoplight/types');

const {
  Severity,
  filterRulesBySeverity,
  sortResults,
  mapRuleSeverity,
  mapRulesetSeverity
} = require('../src/index');

describe('mapRuleSeverity', function() {
  it('should assign a default severity of `error` if missing', async function() {
    const testRule = {};
    const mappedRule = mapRuleSeverity(testRule);
    const expected = { severity: DiagnosticSeverity.Error };

    expect(mappedRule).toEqual(expected);
  });

  it('should ignore numeric severity values', async function() {
    const testRule = { severity: DiagnosticSeverity.Error };
    const mappedRule = mapRuleSeverity(testRule);
    const expected = { severity: DiagnosticSeverity.Error };

    expect(mappedRule).toEqual(expected);
  });

  it("should translate 'error' severity", async function() {
    const testRule = { severity: 'error' };
    const mappedRule = mapRuleSeverity(testRule);
    const expected = { severity: DiagnosticSeverity.Error };

    expect(mappedRule).toEqual(expected);
  });

  it("should translate 'warn' severity", async function() {
    const testRule = { severity: 'warn' };
    const mappedRule = mapRuleSeverity(testRule);
    const expected = { severity: DiagnosticSeverity.Warning };

    expect(mappedRule).toEqual(expected);
  });

  it("should translate 'hint' severity", async function() {
    const testRule = { severity: 'hint' };
    const mappedRule = mapRuleSeverity(testRule);
    const expected = { severity: DiagnosticSeverity.Hint };

    expect(mappedRule).toEqual(expected);
  });

  it("should translate 'info' severity", async function() {
    const testRule = { severity: 'info' };
    const mappedRule = mapRuleSeverity(testRule);
    const expected = { severity: DiagnosticSeverity.Information };

    expect(mappedRule).toEqual(expected);
  });
});

describe('mapRulesetSeverity', function() {
  const testRuleset = {
    a: { severity: 'error' },
    b: { severity: 'warn' },
    c: { severity: 'hint' },
    d: { severity: 'info' }
  };

  it('should map rules to numeric values', async function() {
    const expected = {
      a: { severity: DiagnosticSeverity.Error },
      b: { severity: DiagnosticSeverity.Warning },
      c: { severity: DiagnosticSeverity.Hint },
      d: { severity: DiagnosticSeverity.Information }
    };

    const result = mapRulesetSeverity(testRuleset);

    expect(result).toEqual(expected);
  });
});

describe('filterRulesBySeverity', function() {
  const testRules = {
    a: { severity: DiagnosticSeverity.Error },
    b: { severity: DiagnosticSeverity.Warning },
    c: { severity: DiagnosticSeverity.Information },
    d: { severity: DiagnosticSeverity.Hint }
  };

  it('should return only rules with severity == `error`', async function() {
    const filteredRules = filterRulesBySeverity(testRules, Severity.error);
    const expected = {
      a: { severity: DiagnosticSeverity.Error }
    };

    expect(filteredRules).toEqual(expected);
  });

  it('should return only rules with severity >= `warn`', async function() {
    const filteredRules = filterRulesBySeverity(testRules, Severity.warn);
    const expected = {
      a: { severity: DiagnosticSeverity.Error },
      b: { severity: DiagnosticSeverity.Warning }
    };

    expect(filteredRules).toEqual(expected);
  });

  it('should return only rules with severity >= `information`', async function() {
    const filteredRules = filterRulesBySeverity(testRules, Severity.info);
    const expected = {
      a: { severity: DiagnosticSeverity.Error },
      b: { severity: DiagnosticSeverity.Warning },
      c: { severity: DiagnosticSeverity.Information }
    };

    expect(filteredRules).toEqual(expected);
  });

  it('should return only rules with severity >= `hint`', async function() {
    const filteredRules = filterRulesBySeverity(testRules, Severity.hint);
    const expected = {
      a: { severity: DiagnosticSeverity.Error },
      b: { severity: DiagnosticSeverity.Warning },
      c: { severity: DiagnosticSeverity.Information },
      d: { severity: DiagnosticSeverity.Hint }
    };

    expect(filteredRules).toEqual(expected);
  });
});

describe('sortResults', function() {
  it('should sort results by descending severity level`', async function() {
    const testResults = [
      { severity: DiagnosticSeverity.Warning },
      { severity: DiagnosticSeverity.Information },
      { severity: DiagnosticSeverity.Hint },
      { severity: DiagnosticSeverity.Error }
    ];

    const expected = [
      { severity: DiagnosticSeverity.Error },
      { severity: DiagnosticSeverity.Warning },
      { severity: DiagnosticSeverity.Information },
      { severity: DiagnosticSeverity.Hint }
    ];

    const sortedResults = sortResults(testResults);
    expect(sortedResults).toEqual(expected);
  });

  it('should sort results by increasing start line number`', async function() {
    const testResults = [
      {
        severity: DiagnosticSeverity.Error,
        range: {
          start: {
            line: 10
          }
        }
      },
      {
        severity: DiagnosticSeverity.Error,
        range: {
          start: {
            line: 3
          }
        }
      },
      {
        severity: DiagnosticSeverity.Error,
        range: {
          start: {
            line: 7
          }
        }
      }
    ];

    const expected = [
      {
        severity: DiagnosticSeverity.Error,
        range: {
          start: {
            line: 3
          }
        }
      },
      {
        severity: DiagnosticSeverity.Error,
        range: {
          start: {
            line: 7
          }
        }
      },
      {
        severity: DiagnosticSeverity.Error,
        range: {
          start: {
            line: 10
          }
        }
      }
    ];

    const sortedResults = sortResults(testResults);
    expect(sortedResults).toEqual(expected);
  });
});
