import {
  Play,
  BrainCircuit,
  UserCheck,
  GitBranch,
  Database,
  Activity,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Circle,
  Headphones,
  FileText,
  Receipt,
  UserPlus,
  ShieldAlert,
  FileQuestion,
  AlertCircle,
  Target,
  User,
} from 'lucide-react';

// Map of icon names to components - only includes icons actually used
const iconMap = {
  Play,
  BrainCircuit,
  UserCheck,
  GitBranch,
  Database,
  Activity,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Circle,
  Headphones,
  FileText,
  Receipt,
  UserPlus,
  ShieldAlert,
  FileQuestion,
  AlertCircle,
  Target,
  User,
};

export function getIcon(name) {
  return iconMap[name] || Circle;
}

export default iconMap;
