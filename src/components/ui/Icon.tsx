import React from 'react'
import { LucideProps } from 'lucide-react'
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Home,
  Star,
  Filter,
  SortDesc,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Loader2,
  Trash2,
  Edit,
  Share2,
  Copy,
  ExternalLink,
  Download,
  Upload,
  Image,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  Calendar,
  CreditCard,
  Shield,
  Truck,
  Package,
  Gift,
  Tag,
  Percent,
  TrendingUp,
  BarChart,
  PieChart,
  Users,
  MessageCircle,
  Bell,
  Lock,
  Unlock,
  RefreshCw,
  RotateCcw,
  Zap,
  Flame,
  Award,
  Crown,
  Gem,
  Sparkles,
  Sun,
  Moon,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Wifi,
  WifiOff,
  Camera,
  Mic,
  MicOff,
  Headphones,
  Speaker,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Flag,
  Archive,
  Folder,
  File,
  FileText,
  Download as DownloadIcon,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  MoreVertical,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  Move,
  RotateCw,
} from 'lucide-react'

import { cn } from '@/lib/utils'

// Mapping имен иконок к компонентам
const iconMap = {
  // Навигация и интерфейс
  search: Search,
  menu: Menu,
  close: X,
  home: Home,
  filter: Filter,
  sort: SortDesc,
  'chevron-down': ChevronDown,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  'chevron-up': ChevronUp,
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  'more-horizontal': MoreHorizontal,
  'more-vertical': MoreVertical,

  // Действия
  plus: Plus,
  minus: Minus,
  eye: Eye,
  'eye-off': EyeOff,
  edit: Edit,
  trash: Trash2,
  share: Share2,
  copy: Copy,
  'external-link': ExternalLink,
  download: DownloadIcon,
  upload: Upload,
  refresh: RefreshCw,
  'rotate-ccw': RotateCcw,
  'rotate-cw': RotateCw,

  // Статусы
  check: Check,
  'check-circle': CheckCircle,
  'alert-circle': AlertCircle,
  'alert-triangle': AlertTriangle,
  'x-circle': XCircle,
  info: Info,
  loader: Loader2,

  // Пользователь и аккаунт
  user: User,
  users: Users,
  heart: Heart,
  'shopping-bag': ShoppingBag,
  bookmark: Bookmark,
  bell: Bell,
  message: MessageCircle,
  lock: Lock,
  unlock: Unlock,
  settings: Settings,

  // Контакты и локация
  mail: Mail,
  phone: Phone,
  'map-pin': MapPin,
  clock: Clock,
  calendar: Calendar,

  // Коммерция
  'credit-card': CreditCard,
  shield: Shield,
  truck: Truck,
  package: Package,
  gift: Gift,
  tag: Tag,
  percent: Percent,
  star: Star,

  // Аналитика и графики
  'trending-up': TrendingUp,
  'bar-chart': BarChart,
  'pie-chart': PieChart,

  // Медиа
  image: Image,
  play: Play,
  pause: Pause,
  'volume-2': Volume2,
  'volume-x': VolumeX,
  camera: Camera,
  mic: Mic,
  'mic-off': MicOff,
  headphones: Headphones,
  speaker: Speaker,

  // Премиальные иконки
  zap: Zap,
  flame: Flame,
  award: Award,
  crown: Crown,
  gem: Gem,
  sparkles: Sparkles,

  // Тема
  sun: Sun,
  moon: Moon,
  monitor: Monitor,

  // Устройства
  smartphone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,

  // Сеть
  wifi: Wifi,
  'wifi-off': WifiOff,

  // Взаимодействие
  'thumbs-up': ThumbsUp,
  'thumbs-down': ThumbsDown,
  flag: Flag,

  // Файлы
  archive: Archive,
  folder: Folder,
  file: File,
  'file-text': FileText,

  // Просмотр
  maximize: Maximize,
  minimize: Minimize,
  'zoom-in': ZoomIn,
  'zoom-out': ZoomOut,
  move: Move,

  // Помощь
  'help-circle': HelpCircle,
} as const

export type IconName = keyof typeof iconMap

interface IconProps extends Omit<LucideProps, 'size'> {
  name: IconName
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
  className?: string
  variant?: 'default' | 'muted' | 'success' | 'warning' | 'error' | 'info'
}

const sizeMap = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
}

const variantMap = {
  default: '',
  muted: 'text-neutral-500',
  success: 'text-emerald-500',
  warning: 'text-amber-500',
  error: 'text-red-500',
  info: 'text-blue-500',
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  className,
  variant = 'default',
  ...props
}) => {
  const IconComponent = iconMap[name]
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`)
    return null
  }

  const iconSize = typeof size === 'number' ? size : sizeMap[size]
  const variantClass = variantMap[variant]

  return (
    <IconComponent
      size={iconSize}
      className={cn(variantClass, className)}
      {...props}
    />
  )
}

// Экспортируем отдельные иконки для удобства
export {
  Search as SearchIcon,
  ShoppingBag as ShoppingBagIcon,
  Heart as HeartIcon,
  User as UserIcon,
  Menu as MenuIcon,
  X as CloseIcon,
  Home as HomeIcon,
  Star as StarIcon,
  Filter as FilterIcon,
  SortDesc as SortIcon,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Check as CheckIcon,
  AlertCircle,
  Info as InfoIcon,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Loader2 as LoaderIcon,
  Trash2 as TrashIcon,
  Edit as EditIcon,
  Share2 as ShareIcon,
  Copy as CopyIcon,
  ExternalLink,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Image as ImageIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  Volume2,
  VolumeX,
  Settings as SettingsIcon,
  HelpCircle,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  CreditCard,
  Shield as ShieldIcon,
  Truck as TruckIcon,
  Package as PackageIcon,
  Gift as GiftIcon,
  Tag as TagIcon,
  Percent as PercentIcon,
  TrendingUp,
  BarChart,
  PieChart,
  Users as UsersIcon,
  MessageCircle,
  Bell as BellIcon,
  Lock as LockIcon,
  Unlock as UnlockIcon,
  RefreshCw as RefreshIcon,
  RotateCcw,
  Zap as ZapIcon,
  Flame as FlameIcon,
  Award as AwardIcon,
  Crown as CrownIcon,
  Gem as GemIcon,
  Sparkles as SparklesIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Monitor as MonitorIcon,
  Smartphone,
  Tablet,
  Laptop,
  Wifi,
  WifiOff,
  Camera as CameraIcon,
  Mic as MicIcon,
  MicOff,
  Headphones,
  Speaker,
  ThumbsUp,
  ThumbsDown,
  Bookmark as BookmarkIcon,
  Flag as FlagIcon,
  Archive,
  Folder as FolderIcon,
  File as FileIcon,
  FileText,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  MoreVertical,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  Move,
  RotateCw,
}