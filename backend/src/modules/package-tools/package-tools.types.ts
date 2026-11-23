export type GetReportsMonthlyResponse = Awaited<
  ReturnType<typeof import('./package-tools.service.js').getReportsMonthly>
>['body'];
export type GetIntegrationsExportResponse = Awaited<
  ReturnType<typeof import('./package-tools.service.js').getIntegrationsExport>
>['body'];
export type GetAnalyticsResponse = Awaited<
  ReturnType<typeof import('./package-tools.service.js').getAnalytics>
>['body'];
export type GetJobAlertsResponse = Awaited<
  ReturnType<typeof import('./package-tools.service.js').getJobAlerts>
>['body'];

export type ReportMonthSchemaInput = import('zod').input<
  typeof import('./package-tools.validation.js').reportMonthSchema
>;
