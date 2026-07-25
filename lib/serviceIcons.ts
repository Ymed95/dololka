// Icônes disponibles pour les services (nom → composant lucide-react).
// Utilisé par les pages publiques ET le sélecteur d'icône de l'admin.

import {
    BarChart3, Building2, Camera, Globe, Lightbulb, Megaphone,
    Palette, PenTool, Shirt, ShoppingBag, Sparkles, Users,
    Truck, Warehouse, Store, Target, Briefcase, Wrench,
    Printer, Package, Rocket, Heart, Award, Layers,
    type LucideIcon,
} from 'lucide-react'

export const SERVICE_ICONS: Record<string, LucideIcon> = {
    BarChart3, Building2, Camera, Globe, Lightbulb, Megaphone,
    Palette, PenTool, Shirt, ShoppingBag, Sparkles, Users,
    Truck, Warehouse, Store, Target, Briefcase, Wrench,
    Printer, Package, Rocket, Heart, Award, Layers,
}

export const SERVICE_ICON_NAMES = Object.keys(SERVICE_ICONS)

/** Renvoie l'icône demandée, ou Sparkles si le nom est inconnu. */
export function getServiceIcon(name?: string | null): LucideIcon {
    return (name && SERVICE_ICONS[name]) || Sparkles
}
