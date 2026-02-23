import {
  Home,
  ArrowLeft,
  Users,
  User,
  Camera,
  BarChart2,
  UserPlus,
  Check,
  X,
  Image as ImageIcon,
  RefreshCw,
  ClipboardList,
} from 'lucide-react-native';

export const ICON_MAP = {
  home: Home,
  back: ArrowLeft,
  users: Users,
  user: User,
  camera: Camera,
  chart: BarChart2,
  "user-plus": UserPlus,
  check: Check,
  close: X,
  image: ImageIcon,
  retake: RefreshCw,
  report: ClipboardList,
} as const;

export type AppIconName = keyof typeof ICON_MAP;