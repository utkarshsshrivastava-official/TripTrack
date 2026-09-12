import { DEFAULT_PACKING_ITEMS, PackingCategory, PackingItem } from '../data/packingChecklistData';

const PACKING_STORAGE_KEY = 'triptrack_packing_checked_v1';

export function getCheckedItemIds(): Set<string> {
  try {
    const raw = localStorage.getItem(PACKING_STORAGE_KEY);
    if (!raw) return new Set<string>();
    return new Set<string>(JSON.parse(raw));
  } catch {
    return new Set<string>();
  }
}

export function saveCheckedItemIds(ids: Set<string>): void {
  try {
    localStorage.setItem(PACKING_STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch (err) {
    console.error('Failed to save packing state:', err);
  }
}

export function togglePackingItem(itemId: string): boolean {
  const current = getCheckedItemIds();
  const nextChecked = !current.has(itemId);
  if (nextChecked) {
    current.add(itemId);
  } else {
    current.delete(itemId);
  }
  saveCheckedItemIds(current);
  return nextChecked;
}

export function getPackingProgress(category?: PackingCategory): {
  total: number;
  packed: number;
  percentage: number;
} {
  const checked = getCheckedItemIds();
  let items: PackingItem[] = DEFAULT_PACKING_ITEMS;

  if (category) {
    items = items.filter(i => i.category === category);
  }

  const total = items.length;
  const packed = items.filter(i => checked.has(i.id)).length;
  const percentage = total > 0 ? Math.round((packed / total) * 100) : 0;

  return { total, packed, percentage };
}
