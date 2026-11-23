export type AccountDecisionInput = import('zod').infer<
  typeof import('./approvals.validation.js').decisionSchema
>;

export type DecisionSchemaInput = import('zod').input<
  typeof import('./approvals.validation.js').decisionSchema
>;
