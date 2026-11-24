import * as v from 'valibot'

export const dependencyStateSchema = v.picklist(['up', 'down'])

export const livenessReportSchema = v.object({
  status: v.literal('ok'),
})

export const readinessReportSchema = v.object({
  status: v.picklist(['ready', 'not_ready']),
  dependencies: v.record(v.string(), dependencyStateSchema),
})

export type DependencyState = v.InferOutput<typeof dependencyStateSchema>
export type LivenessReport = v.InferOutput<typeof livenessReportSchema>
export type ReadinessReport = v.InferOutput<typeof readinessReportSchema>
