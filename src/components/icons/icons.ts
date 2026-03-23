import {
  Home,
  ArrowLeft,
  ArrowLeftRight,
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
  Calendar,
} from 'lucide-react-native';

export const ICON_MAP = {
  home: Home,
  back: ArrowLeft,
  "arrow-left-right": ArrowLeftRight,
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
  calendar: Calendar,
} as const;

export type AppIconName = keyof typeof ICON_MAP;