import { eq, and, desc, asc } from 'drizzle-orm';
import { db } from './config';
import { 
  workspaces, 
  variables, 
  scenarios, 
  projections, 
  comparisons, 
  lrpRuns,
  type Workspace,
  type NewWorkspace,
  type Variable,
  type NewVariable,
  type Scenario,
  type NewScenario,
  type Projection,
  type NewProjection,
  type Comparison,
  type NewComparison,
  type LRPRun,
  type NewLRPRun
} from './schema';

export class DatabaseService {
  // Workspace operations
  static async createWorkspace(data: NewWorkspace): Promise<Workspace> {
    const [workspace] = await db.insert(workspaces).values(data).returning();
    return workspace;
  }

  static async getWorkspace(id: string): Promise<Workspace | null> {
    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.id, id));
    return workspace || null;
  }

  static async getWorkspaceByName(name: string): Promise<Workspace | null> {
    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.name, name));
    return workspace || null;
  }

  static async updateWorkspace(id: string, data: Partial<NewWorkspace>): Promise<Workspace | null> {
    const [workspace] = await db
      .update(workspaces)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(workspaces.id, id))
      .returning();
    return workspace || null;
  }

  static async deleteWorkspace(id: string): Promise<boolean> {
    const result = await db.delete(workspaces).where(eq(workspaces.id, id));
    return result.rowCount > 0;
  }

  // Variable operations
  static async createVariable(data: NewVariable): Promise<Variable> {
    const [variable] = await db.insert(variables).values(data).returning();
    return variable;
  }

  static async getVariables(workspaceId: string): Promise<Variable[]> {
    return await db
      .select()
      .from(variables)
      .where(eq(variables.workspaceId, workspaceId))
      .orderBy(asc(variables.name));
  }

  static async getVariable(id: string): Promise<Variable | null> {
    const [variable] = await db.select().from(variables).where(eq(variables.id, id));
    return variable || null;
  }

  static async updateVariable(id: string, data: Partial<NewVariable>): Promise<Variable | null> {
    const [variable] = await db
      .update(variables)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(variables.id, id))
      .returning();
    return variable || null;
  }

  static async deleteVariable(id: string): Promise<boolean> {
    const result = await db.delete(variables).where(eq(variables.id, id));
    return result.rowCount > 0;
  }

  // Scenario operations
  static async createScenario(data: NewScenario): Promise<Scenario> {
    const [scenario] = await db.insert(scenarios).values(data).returning();
    return scenario;
  }

  static async getScenarios(workspaceId: string): Promise<Scenario[]> {
    return await db
      .select()
      .from(scenarios)
      .where(eq(scenarios.workspaceId, workspaceId))
      .orderBy(desc(scenarios.updatedAt));
  }

  static async getScenario(id: string): Promise<Scenario | null> {
    const [scenario] = await db.select().from(scenarios).where(eq(scenarios.id, id));
    return scenario || null;
  }

  static async updateScenario(id: string, data: Partial<NewScenario>): Promise<Scenario | null> {
    const [scenario] = await db
      .update(scenarios)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(scenarios.id, id))
      .returning();
    return scenario || null;
  }

  static async deleteScenario(id: string): Promise<boolean> {
    const result = await db.delete(scenarios).where(eq(scenarios.id, id));
    return result.rowCount > 0;
  }

  // Projection operations
  static async createProjection(data: NewProjection): Promise<Projection> {
    const [projection] = await db.insert(projections).values(data).returning();
    return projection;
  }

  static async getProjections(workspaceId: string): Promise<Projection[]> {
    return await db
      .select()
      .from(projections)
      .where(eq(projections.workspaceId, workspaceId))
      .orderBy(desc(projections.updatedAt));
  }

  static async getProjection(id: string): Promise<Projection | null> {
    const [projection] = await db.select().from(projections).where(eq(projections.id, id));
    return projection || null;
  }

  static async updateProjection(id: string, data: Partial<NewProjection>): Promise<Projection | null> {
    const [projection] = await db
      .update(projections)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projections.id, id))
      .returning();
    return projection || null;
  }

  static async deleteProjection(id: string): Promise<boolean> {
    const result = await db.delete(projections).where(eq(projections.id, id));
    return result.rowCount > 0;
  }

  // Comparison operations
  static async createComparison(data: NewComparison): Promise<Comparison> {
    const [comparison] = await db.insert(comparisons).values(data).returning();
    return comparison;
  }

  static async getComparisons(workspaceId: string): Promise<Comparison[]> {
    return await db
      .select()
      .from(comparisons)
      .where(eq(comparisons.workspaceId, workspaceId))
      .orderBy(desc(comparisons.updatedAt));
  }

  static async getComparison(id: string): Promise<Comparison | null> {
    const [comparison] = await db.select().from(comparisons).where(eq(comparisons.id, id));
    return comparison || null;
  }

  static async updateComparison(id: string, data: Partial<NewComparison>): Promise<Comparison | null> {
    const [comparison] = await db
      .update(comparisons)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(comparisons.id, id))
      .returning();
    return comparison || null;
  }

  static async deleteComparison(id: string): Promise<boolean> {
    const result = await db.delete(comparisons).where(eq(comparisons.id, id));
    return result.rowCount > 0;
  }

  // LRP Run operations
  static async createLRPRun(data: NewLRPRun): Promise<LRPRun> {
    const [lrpRun] = await db.insert(lrpRuns).values(data).returning();
    return lrpRun;
  }

  static async getLRPRuns(workspaceId: string): Promise<LRPRun[]> {
    return await db
      .select()
      .from(lrpRuns)
      .where(eq(lrpRuns.workspaceId, workspaceId))
      .orderBy(desc(lrpRuns.createdAt));
  }

  static async getLRPRun(id: string): Promise<LRPRun | null> {
    const [lrpRun] = await db.select().from(lrpRuns).where(eq(lrpRuns.id, id));
    return lrpRun || null;
  }

  static async getLRPRunByRunId(runId: string): Promise<LRPRun | null> {
    const [lrpRun] = await db.select().from(lrpRuns).where(eq(lrpRuns.runId, runId));
    return lrpRun || null;
  }

  static async updateLRPRun(id: string, data: Partial<NewLRPRun>): Promise<LRPRun | null> {
    const [lrpRun] = await db
      .update(lrpRuns)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(lrpRuns.id, id))
      .returning();
    return lrpRun || null;
  }

  static async deleteLRPRun(id: string): Promise<boolean> {
    const result = await db.delete(lrpRuns).where(eq(lrpRuns.id, id));
    return result.rowCount > 0;
  }

  // Utility operations
  static async getWorkspaceWithAllData(workspaceId: string) {
    const workspace = await this.getWorkspace(workspaceId);
    if (!workspace) return null;

    const [workspaceVariables, workspaceScenarios, workspaceProjections, workspaceComparisons] = await Promise.all([
      this.getVariables(workspaceId),
      this.getScenarios(workspaceId),
      this.getProjections(workspaceId),
      this.getComparisons(workspaceId)
    ]);

    return {
      ...workspace,
      variables: workspaceVariables,
      scenarios: workspaceScenarios,
      projections: workspaceProjections,
      comparisons: workspaceComparisons
    };
  }

  // Database health check
  static async healthCheck(): Promise<boolean> {
    try {
      await db.select().from(workspaces).limit(1);
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}
