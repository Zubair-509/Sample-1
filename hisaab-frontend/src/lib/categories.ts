import {
  Package,
  Zap,
  Truck,
  Wrench,
  Briefcase,
  Users,
  Coffee,
  MoreHorizontal,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react';
import type { Category } from '../types/transaction';

// Icon map — Hisaab_Design_Document.md §6.3
export const CATEGORY_META: Record<Category, { icon: LucideIcon; label: string }> = {
  Inventory: { icon: Package, label: 'Inventory' },
  Utilities: { icon: Zap, label: 'Utilities' },
  Transport: { icon: Truck, label: 'Transport' },
  Equipment: { icon: Wrench, label: 'Equipment' },
  Services: { icon: Briefcase, label: 'Services' },
  Salary: { icon: Users, label: 'Salary' },
  Food: { icon: Coffee, label: 'Food' },
  Other: { icon: MoreHorizontal, label: 'Other' },
  Sales: { icon: ShoppingBag, label: 'Sales' },
};
