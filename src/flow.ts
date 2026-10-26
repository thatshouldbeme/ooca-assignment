export type ThoughtItem = { id: string; text: string }
export type ThoughtGroups = { pool: ThoughtItem[]; actionable: ThoughtItem[]; nonActionable: ThoughtItem[] }

export function reconcileGroups(thoughts: ThoughtItem[], groups: ThoughtGroups): ThoughtGroups {
  const actionable = new Set(groups.actionable.map(({ id }) => id))
  const nonActionable = new Set(groups.nonActionable.map(({ id }) => id))
  return {
    pool: thoughts.filter(({ id }) => !actionable.has(id) && !nonActionable.has(id)),
    actionable: thoughts.filter(({ id }) => actionable.has(id)),
    nonActionable: thoughts.filter(({ id }) => nonActionable.has(id)),
  }
}
