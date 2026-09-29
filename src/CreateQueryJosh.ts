interface QueryExpressionOptions {
  qValues?: [any?, any?, any?];
  qFields?: [any?, any?, any?];
  chartCategory?: any;
  chartCategoryField?: any;
  chartCategoryType?: "number" | "string";
  status?: number | null;
  statusField?: any;
  qExpression?: any;
  q2Expression?: any;
}

// ----------------------------------------------------
// Builds a SQL where-clause from a mix of optional filters (cascading
// package/type/station, status, chart category, raw expressions). Feeds
// both layer.definitionExpression and Query.where.
// ----------------------------------------------------
class QueryExpressionLayers {
  qValues?: [any?, any?, any?];
  qFields?: [any?, any?, any?];
  chartCategory?: any;
  chartCategoryField?: any;
  chartCategoryType?: "number" | "string";
  status?: number | null;
  statusField?: any;
  qExpression?: any;
  q2Expression?: any;

  constructor(options: QueryExpressionOptions) {
    this.qValues = options.qValues;
    this.qFields = options.qFields;
    this.chartCategory = options.chartCategory;
    this.chartCategoryField = options.chartCategoryField;
    this.chartCategoryType = options.chartCategoryType;
    this.status = options.status;
    this.statusField = options.statusField;
    this.qExpression = options.qExpression;
    this.q2Expression = options.q2Expression;
  }

  // ----------------------------------------------------
  // HELPERS
  // ----------------------------------------------------

  // Formats one field = value clause, quoting strings (numbers unquoted)
  private buildClause(field: any, value: any): string {
    return typeof value === "number"
      ? `${field} = ${value}`
      : `${field} = '${value}'`;
  }

  // Joins non-empty clauses with AND; falls back to "1=1" if none
  private joinClauses(clauses: (string | undefined | null | false)[]): string {
    const valid = clauses.filter(Boolean) as string[];
    return valid.length ? valid.join(" AND ") : "1=1";
  }

  // ----------------------------------------------------
  // MAIN: builds and returns the combined where-clause string
  // ----------------------------------------------------
  queryExpression = (): string => {
    const clauses: (string | undefined | null | false)[] = [];

    // qValues — cascade: stop at the first missing value
    if (this.qValues?.[0]) {
      clauses.push(this.buildClause(this.qFields![0], this.qValues[0]));

      if (this.qValues[1]) {
        clauses.push(this.buildClause(this.qFields![1], this.qValues[1]));

        if (this.qValues[2]) {
          clauses.push(this.buildClause(this.qFields![2], this.qValues[2]));
        }
      }
    }

    // Status field
    if (this.statusField && this.status != null) {
      clauses.push(`${this.statusField} = ${this.status}`);
    }

    // Chart category field
    if (this.chartCategoryField && this.chartCategory != null) {
      clauses.push(this.buildClause(this.chartCategoryField, this.chartCategory));
    }

    // Extra expressions
    if (this.qExpression) {
      clauses.push(this.qExpression);
    }

    if (this.q2Expression) {
      clauses.push(this.q2Expression);
    }

    return this.joinClauses(clauses);
  };
}

export default QueryExpressionLayers;