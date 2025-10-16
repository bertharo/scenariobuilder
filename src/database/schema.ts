import { pgTable, serial, text, timestamp, json, numeric, boolean, varchar, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Workspace table
export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Variables table
export const variables = pgTable('variables', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type').notNull(), // 'number', 'percentage', 'currency', 'boolean', 'text'
  category: text('category').notNull(),
  defaultValue: text('default_value'),
  minValue: numeric('min_value'),
  maxValue: numeric('max_value'),
  step: numeric('step'),
  unit: text('unit'),
  isRequired: boolean('is_required').default(false),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Scenarios table
export const scenarios = pgTable('scenarios', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').default('draft').notNull(), // 'draft', 'active', 'archived'
  tags: json('tags').$type<string[]>().default([]),
  variables: json('variables').$type<Record<string, any>>().default({}),
  assumptions: text('assumptions'),
  constraints: json('constraints').$type<string[]>().default([]),
  timeHorizon: numeric('time_horizon').default('10'),
  baseScenario: uuid('base_scenario').references(() => scenarios.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Projections table
export const projections = pgTable('projections', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  scenarioIds: json('scenario_ids').$type<string[]>().default([]),
  variableIds: json('variable_ids').$type<string[]>().default([]),
  timeHorizon: numeric('time_horizon').default('10'),
  projectionData: json('projection_data'),
  assumptions: text('assumptions'),
  confidence: numeric('confidence'), // 0-1 confidence level
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Comparisons table
export const comparisons = pgTable('comparisons', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  scenarioIds: json('scenario_ids').$type<string[]>().notNull(),
  comparisonType: text('comparison_type').default('scenario').notNull(), // 'scenario', 'variable', 'time'
  comparisonData: json('comparison_data'),
  metrics: json('metrics').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// LRP Copilot runs table (for tracking analysis runs)
export const lrpRuns = pgTable('lrp_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  runId: text('run_id').notNull(), // From Apps Script
  prompt: text('prompt').notNull(),
  region: text('region'),
  target: numeric('target'),
  constraints: json('constraints').$type<string[]>().default([]),
  arrBefore: numeric('arr_before'),
  arrAfter: numeric('arr_after'),
  totalDelta: numeric('total_delta'),
  results: json('results'),
  status: text('status').default('pending').notNull(), // 'pending', 'completed', 'failed'
  error: text('error'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define relations
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

export const scenariosRelations = relations(scenarios, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [scenarios.workspaceId],
    references: [workspaces.id],
  }),
  baseScenario: one(scenarios, {
    fields: [scenarios.baseScenario],
    references: [scenarios.id],
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

// Export types for TypeScript
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
