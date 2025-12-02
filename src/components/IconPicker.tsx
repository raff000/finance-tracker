import { useState } from "react";
import {
  DollarSign,
  CreditCard,
  Wallet,
  PiggyBank,
  TrendingUp,
  Landmark,
  ShoppingCart,
  ShoppingBag,
  Gift,
  Tag,
  Home,
  Building,
  Car,
  Plane,
  Bus,
  Utensils,
  Coffee,
  Wine,
  Pizza,
  Heart,
  Activity,
  Pill,
  Hospital,
  Music,
  Film,
  Gamepad2,
  Book,
  Briefcase,
  Laptop,
  Phone,
  Mail,
  Zap,
  Droplet,
  Wifi,
  Tv,
  Folder,
  Star,
  Flag,
  Circle,
  Users,
  GraduationCap,
  Scissors,
  Wrench,
  Hammer,
  Package,
  Truck,
  Globe,
  Map,
  Compass,
  Bike,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ICONS: { name: string; Icon: LucideIcon }[] = [
  { name: "folder", Icon: Folder },
  { name: "tag", Icon: Tag },
  { name: "dollar-sign", Icon: DollarSign },
  { name: "credit-card", Icon: CreditCard },
  { name: "wallet", Icon: Wallet },
  { name: "piggy-bank", Icon: PiggyBank },
  { name: "trending-up", Icon: TrendingUp },
  { name: "landmark", Icon: Landmark },
  { name: "shopping-cart", Icon: ShoppingCart },
  { name: "shopping-bag", Icon: ShoppingBag },
  { name: "gift", Icon: Gift },
  { name: "home", Icon: Home },
  { name: "building", Icon: Building },
  { name: "car", Icon: Car },
  { name: "plane", Icon: Plane },
  { name: "bus", Icon: Bus },
  { name: "bike", Icon: Bike },
  { name: "utensils", Icon: Utensils },
  { name: "coffee", Icon: Coffee },
  { name: "wine", Icon: Wine },
  { name: "pizza", Icon: Pizza },
  { name: "heart", Icon: Heart },
  { name: "activity", Icon: Activity },
  { name: "pill", Icon: Pill },
  { name: "hospital", Icon: Hospital },
  { name: "music", Icon: Music },
  { name: "film", Icon: Film },
  { name: "gamepad-2", Icon: Gamepad2 },
  { name: "book", Icon: Book },
  { name: "briefcase", Icon: Briefcase },
  { name: "laptop", Icon: Laptop },
  { name: "phone", Icon: Phone },
  { name: "mail", Icon: Mail },
  { name: "zap", Icon: Zap },
  { name: "droplet", Icon: Droplet },
  { name: "wifi", Icon: Wifi },
  { name: "tv", Icon: Tv },
  { name: "star", Icon: Star },
  { name: "flag", Icon: Flag },
  { name: "circle", Icon: Circle },
  { name: "users", Icon: Users },
  { name: "graduation-cap", Icon: GraduationCap },
  { name: "scissors", Icon: Scissors },
  { name: "wrench", Icon: Wrench },
  { name: "hammer", Icon: Hammer },
  { name: "package", Icon: Package },
  { name: "truck", Icon: Truck },
  { name: "globe", Icon: Globe },
  { name: "map", Icon: Map },
  { name: "compass", Icon: Compass },
];

export const ICON_MAP: Record<string, LucideIcon> = ICONS.reduce(
  (acc, { name, Icon }) => ({ ...acc, [name]: Icon }),
  {}
);

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

export const IconPicker = ({ value, onChange }: IconPickerProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredIcons = ICONS.filter(({ name }) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  const SelectedIcon = ICON_MAP[value] || Folder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0"
          type="button"
        >
          <SelectedIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <Input
          placeholder="Search icons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
        />
        <ScrollArea className="h-48">
          <div className="grid grid-cols-6 gap-1">
            {filteredIcons.map(({ name, Icon }) => (
              <Button
                key={name}
                variant={value === name ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                  setSearch("");
                }}
                type="button"
              >
                <Icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
