import { pgTable, text, timestamp, json, numeric, boolean, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Workspace table
export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Variable table
export const variables = pgTable('variables', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type').notNull(),
  category: text('category').notNull(),
  defaultValue: text('default_value'),
  minValue: numeric('min_value'),
  maxValue: numeric('max_value'),
  step: numeric('step'),
  unit: text('unit'),
  isRequired: boolean('is_required').default(false).notNull(),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Scenario table
export const scenarios = pgTable('scenarios', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').default('draft').notNull(),
  tags: json('tags').default([]).notNull(),
  variables: json('variables').default({}).notNull(),
  assumptions: text('assumptions'),
  constraints: json('constraints').default([]).notNull(),
  timeHorizon: numeric('time_horizon').default('10').notNull(),
  baseScenario: uuid('base_scenario'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Projection table
export const projections = pgTable('projections', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  scenarioIds: json('scenario_ids').default([]).notNull(),
  variableIds: json('variable_ids').default([]).notNull(),
  timeHorizon: numeric('time_horizon').default('10').notNull(),
  projectionData: json('projection_data'),
  assumptions: text('assumptions'),
  confidence: numeric('confidence'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Comparison table
export const comparisons = pgTable('comparisons', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  scenarioIds: json('scenario_ids').notNull(),
  comparisonType: text('comparison_type').default('scenario').notNull(),
  comparisonData: json('comparison_data'),
  metrics: json('metrics').default([]).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// LRP Run table
export const lrpRuns = pgTable('lrp_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id).notNull(),
  runId: text('run_id').notNull(),
  prompt: text('prompt').notNull(),
  region: text('region'),
  target: numeric('target'),
  constraints: json('constraints').default([]).notNull(),
  arrBefore: numeric('arr_before'),
  arrAfter: numeric('arr_after'),
  totalDelta: numeric('total_delta'),
  results: json('results'),
  status: text('status').default('pending').notNull(),
  error: text('error'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const workspacesRelations = relations(workspaces, ({ many }) => ({
  variables: many(variables),
  scenarios: many(scenarios),
  projections: many(projections),
  comparisons: many(comparisons),
  lrpRuns: many(lrpRuns),
}));

export const variablesRelations = relations(variables, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [variables.workspaceId],
    references: [workspaces.id],
  }),
}));

export const scenariosRelations = relations(scenarios, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [scenarios.workspaceId],
    references: [workspaces.id],
  }),
}));

export const projectionsRelations = relations(projections, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [projections.workspaceId],
    references: [workspaces.id],
  }),
}));

export const comparisonsRelations = relations(comparisons, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [comparisons.workspaceId],
    references: [workspaces.id],
  }),
}));

export const lrpRunsRelations = relations(lrpRuns, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [lrpRuns.workspaceId],
    references: [workspaces.id],
  }),
}));

// Type exports
export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;

export type Variable = typeof variables.$inferSelect;
export type NewVariable = typeof variables.$inferInsert;

export type Scenario = typeof scenarios.$inferSelect;
export type NewScenario = typeof scenarios.$inferInsert;

export type Projection = typeof projections.$inferSelect;
export type NewProjection = typeof projections.$inferInsert;

export type Comparison = typeof comparisons.$inferSelect;
export type NewComparison = typeof comparisons.$inferInsert;

export type LRPRun = typeof lrpRuns.$inferSelect;
export type NewLRPRun = typeof lrpRuns.$inferInsert;