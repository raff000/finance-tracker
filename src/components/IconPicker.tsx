import { useState } from "react";
import { DollarSign, CreditCard, Wallet, PiggyBank, TrendingUp, Landmark, ShoppingCart, ShoppingBag, Gift, Tag, Home, Building, Car, Plane, Bus, Utensils, Coffee, Wine, Pizza, Heart, Activity, Pill, Hospital, Music, Film, Gamepad2, Book, Briefcase, Laptop, Phone, Mail, Zap, Droplet, Wifi, Tv, Folder, Star, Flag, Circle, Users, GraduationCap, Scissors, Wrench, Hammer, Package, Truck, Globe, Map, Compass, Bike,
// Additional icons for 150-200 total
Receipt, Coins, Banknote, BadgeDollarSign, CircleDollarSign, BadgePercent, Store, Shirt, Watch, Sparkles, Diamond, Crown, Gem, Apple, Beef, Cake, IceCream, Soup, Cookie, Popcorn, Ship, Train, Fuel, CarFront, Tractor, Cable, Stethoscope, Syringe, Thermometer, HeartPulse, Brain, Dumbbell, Clapperboard, Headphones, Radio, Speaker, Camera, Ticket, Bed, Bath, Lamp, Sofa, AirVent, Lightbulb, Monitor, Printer, Router, Server, Smartphone, Tablet, Sun, Moon, Cloud, TreeDeciduous, Flower2, Mountain, Calculator, Clipboard, FileText, Presentation, BookOpen, Baby, Dog, Cat, Palette, PenTool, Award, Bell, Clock, Calendar, Lock, Key, Shield, Eye, Settings, Search, Filter, Bookmark, Archive, Trash2, Download, Upload, Share2, Link, MessageCircle, MessageSquare, Send, Inbox, AtSign, Hash, Percent, Plus, Minus, X, Check, AlertCircle, Info, HelpCircle, ChevronRight, ArrowRight, ArrowUp, ArrowDown, RefreshCw, RotateCcw, Maximize, Minimize, Grid, List, LayoutGrid, Layers, Box, Boxes, Container, Database, HardDrive, Cpu, MemoryStick, Battery, BatteryCharging, Power, Plug, Flashlight, Umbrella, Wind, Snowflake, Flame, Waves, Anchor, LifeBuoy, Tent, Backpack, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
const ICONS: {
  name: string;
  Icon: LucideIcon;
}[] = [
// Finance
{
  name: "folder",
  Icon: Folder
}, {
  name: "tag",
  Icon: Tag
}, {
  name: "dollar-sign",
  Icon: DollarSign
}, {
  name: "credit-card",
  Icon: CreditCard
}, {
  name: "wallet",
  Icon: Wallet
}, {
  name: "piggy-bank",
  Icon: PiggyBank
}, {
  name: "trending-up",
  Icon: TrendingUp
}, {
  name: "landmark",
  Icon: Landmark
}, {
  name: "receipt",
  Icon: Receipt
}, {
  name: "coins",
  Icon: Coins
}, {
  name: "banknote",
  Icon: Banknote
}, {
  name: "badge-dollar-sign",
  Icon: BadgeDollarSign
}, {
  name: "circle-dollar-sign",
  Icon: CircleDollarSign
}, {
  name: "badge-percent",
  Icon: BadgePercent
},
// Shopping
{
  name: "shopping-cart",
  Icon: ShoppingCart
}, {
  name: "shopping-bag",
  Icon: ShoppingBag
}, {
  name: "gift",
  Icon: Gift
}, {
  name: "store",
  Icon: Store
}, {
  name: "shirt",
  Icon: Shirt
}, {
  name: "watch",
  Icon: Watch
}, {
  name: "sparkles",
  Icon: Sparkles
}, {
  name: "diamond",
  Icon: Diamond
}, {
  name: "crown",
  Icon: Crown
}, {
  name: "gem",
  Icon: Gem
},
// Home & Living
{
  name: "home",
  Icon: Home
}, {
  name: "building",
  Icon: Building
}, {
  name: "bed",
  Icon: Bed
}, {
  name: "bath",
  Icon: Bath
}, {
  name: "lamp",
  Icon: Lamp
}, {
  name: "sofa",
  Icon: Sofa
}, {
  name: "air-vent",
  Icon: AirVent
}, {
  name: "lightbulb",
  Icon: Lightbulb
},
// Transportation
{
  name: "car",
  Icon: Car
}, {
  name: "car-front",
  Icon: CarFront
}, {
  name: "plane",
  Icon: Plane
}, {
  name: "bus",
  Icon: Bus
}, {
  name: "bike",
  Icon: Bike
}, {
  name: "ship",
  Icon: Ship
}, {
  name: "train",
  Icon: Train
}, {
  name: "fuel",
  Icon: Fuel
}, {
  name: "tractor",
  Icon: Tractor
}, {
  name: "truck",
  Icon: Truck
},
// Food & Drink
{
  name: "utensils",
  Icon: Utensils
}, {
  name: "coffee",
  Icon: Coffee
}, {
  name: "wine",
  Icon: Wine
}, {
  name: "pizza",
  Icon: Pizza
}, {
  name: "apple",
  Icon: Apple
}, {
  name: "beef",
  Icon: Beef
}, {
  name: "cake",
  Icon: Cake
}, {
  name: "ice-cream",
  Icon: IceCream
}, {
  name: "soup",
  Icon: Soup
}, {
  name: "cookie",
  Icon: Cookie
}, {
  name: "popcorn",
  Icon: Popcorn
},
// Health & Fitness
{
  name: "heart",
  Icon: Heart
}, {
  name: "heart-pulse",
  Icon: HeartPulse
}, {
  name: "activity",
  Icon: Activity
}, {
  name: "pill",
  Icon: Pill
}, {
  name: "hospital",
  Icon: Hospital
}, {
  name: "stethoscope",
  Icon: Stethoscope
}, {
  name: "syringe",
  Icon: Syringe
}, {
  name: "thermometer",
  Icon: Thermometer
}, {
  name: "brain",
  Icon: Brain
}, {
  name: "dumbbell",
  Icon: Dumbbell
},
// Entertainment
{
  name: "music",
  Icon: Music
}, {
  name: "film",
  Icon: Film
}, {
  name: "gamepad-2",
  Icon: Gamepad2
}, {
  name: "clapperboard",
  Icon: Clapperboard
}, {
  name: "headphones",
  Icon: Headphones
}, {
  name: "radio",
  Icon: Radio
}, {
  name: "speaker",
  Icon: Speaker
}, {
  name: "camera",
  Icon: Camera
}, {
  name: "ticket",
  Icon: Ticket
}, {
  name: "tv",
  Icon: Tv
},
// Work & Education
{
  name: "briefcase",
  Icon: Briefcase
}, {
  name: "book",
  Icon: Book
}, {
  name: "book-open",
  Icon: BookOpen
}, {
  name: "graduation-cap",
  Icon: GraduationCap
}, {
  name: "calculator",
  Icon: Calculator
}, {
  name: "clipboard",
  Icon: Clipboard
}, {
  name: "file-text",
  Icon: FileText
}, {
  name: "presentation",
  Icon: Presentation
},
// Technology
{
  name: "laptop",
  Icon: Laptop
}, {
  name: "phone",
  Icon: Phone
}, {
  name: "smartphone",
  Icon: Smartphone
}, {
  name: "tablet",
  Icon: Tablet
}, {
  name: "monitor",
  Icon: Monitor
}, {
  name: "printer",
  Icon: Printer
}, {
  name: "router",
  Icon: Router
}, {
  name: "server",
  Icon: Server
}, {
  name: "database",
  Icon: Database
}, {
  name: "hard-drive",
  Icon: HardDrive
}, {
  name: "cpu",
  Icon: Cpu
}, {
  name: "memory-stick",
  Icon: MemoryStick
},
// Communication
{
  name: "mail",
  Icon: Mail
}, {
  name: "message-circle",
  Icon: MessageCircle
}, {
  name: "message-square",
  Icon: MessageSquare
}, {
  name: "send",
  Icon: Send
}, {
  name: "inbox",
  Icon: Inbox
}, {
  name: "at-sign",
  Icon: AtSign
},
// Utilities
{
  name: "zap",
  Icon: Zap
}, {
  name: "droplet",
  Icon: Droplet
}, {
  name: "wifi",
  Icon: Wifi
}, {
  name: "cable",
  Icon: Cable
}, {
  name: "battery",
  Icon: Battery
}, {
  name: "battery-charging",
  Icon: BatteryCharging
}, {
  name: "power",
  Icon: Power
}, {
  name: "plug",
  Icon: Plug
}, {
  name: "flashlight",
  Icon: Flashlight
},
// Nature & Weather
{
  name: "sun",
  Icon: Sun
}, {
  name: "moon",
  Icon: Moon
}, {
  name: "cloud",
  Icon: Cloud
}, {
  name: "tree-deciduous",
  Icon: TreeDeciduous
}, {
  name: "flower-2",
  Icon: Flower2
}, {
  name: "mountain",
  Icon: Mountain
}, {
  name: "umbrella",
  Icon: Umbrella
}, {
  name: "wind",
  Icon: Wind
}, {
  name: "snowflake",
  Icon: Snowflake
}, {
  name: "flame",
  Icon: Flame
}, {
  name: "waves",
  Icon: Waves
},
// Travel & Outdoors
{
  name: "globe",
  Icon: Globe
}, {
  name: "map",
  Icon: Map
}, {
  name: "compass",
  Icon: Compass
}, {
  name: "anchor",
  Icon: Anchor
}, {
  name: "life-buoy",
  Icon: LifeBuoy
}, {
  name: "tent",
  Icon: Tent
}, {
  name: "backpack",
  Icon: Backpack
},
// People & Lifestyle
{
  name: "users",
  Icon: Users
}, {
  name: "baby",
  Icon: Baby
}, {
  name: "dog",
  Icon: Dog
}, {
  name: "cat",
  Icon: Cat
}, {
  name: "scissors",
  Icon: Scissors
}, {
  name: "palette",
  Icon: Palette
}, {
  name: "pen-tool",
  Icon: PenTool
},
// Tools & Hardware
{
  name: "wrench",
  Icon: Wrench
}, {
  name: "hammer",
  Icon: Hammer
}, {
  name: "settings",
  Icon: Settings
},
// Misc
{
  name: "package",
  Icon: Package
}, {
  name: "box",
  Icon: Box
}, {
  name: "boxes",
  Icon: Boxes
}, {
  name: "container",
  Icon: Container
}, {
  name: "star",
  Icon: Star
}, {
  name: "flag",
  Icon: Flag
}, {
  name: "circle",
  Icon: Circle
}, {
  name: "award",
  Icon: Award
}, {
  name: "bell",
  Icon: Bell
}, {
  name: "clock",
  Icon: Clock
}, {
  name: "calendar",
  Icon: Calendar
}, {
  name: "lock",
  Icon: Lock
}, {
  name: "key",
  Icon: Key
}, {
  name: "shield",
  Icon: Shield
}, {
  name: "eye",
  Icon: Eye
}, {
  name: "search",
  Icon: Search
}, {
  name: "filter",
  Icon: Filter
}, {
  name: "bookmark",
  Icon: Bookmark
}, {
  name: "archive",
  Icon: Archive
}, {
  name: "trash-2",
  Icon: Trash2
}, {
  name: "download",
  Icon: Download
}, {
  name: "upload",
  Icon: Upload
}, {
  name: "share-2",
  Icon: Share2
}, {
  name: "link",
  Icon: Link
}, {
  name: "hash",
  Icon: Hash
}, {
  name: "percent",
  Icon: Percent
}, {
  name: "plus",
  Icon: Plus
}, {
  name: "minus",
  Icon: Minus
}, {
  name: "x",
  Icon: X
}, {
  name: "check",
  Icon: Check
}, {
  name: "alert-circle",
  Icon: AlertCircle
}, {
  name: "info",
  Icon: Info
}, {
  name: "help-circle",
  Icon: HelpCircle
}, {
  name: "chevron-right",
  Icon: ChevronRight
}, {
  name: "arrow-right",
  Icon: ArrowRight
}, {
  name: "arrow-up",
  Icon: ArrowUp
}, {
  name: "arrow-down",
  Icon: ArrowDown
}, {
  name: "refresh-cw",
  Icon: RefreshCw
}, {
  name: "rotate-ccw",
  Icon: RotateCcw
}, {
  name: "maximize",
  Icon: Maximize
}, {
  name: "minimize",
  Icon: Minimize
}, {
  name: "grid",
  Icon: Grid
}, {
  name: "list",
  Icon: List
}, {
  name: "layout-grid",
  Icon: LayoutGrid
}, {
  name: "layers",
  Icon: Layers
}];
export const ICON_MAP: Record<string, LucideIcon> = ICONS.reduce((acc, {
  name,
  Icon
}) => ({
  ...acc,
  [name]: Icon
}), {});
interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}
export const IconPicker = ({
  value,
  onChange
}: IconPickerProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filteredIcons = ICONS.filter(({
    name
  }) => name.toLowerCase().includes(search.toLowerCase()));
  const SelectedIcon = ICON_MAP[value] || Folder;
  return <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0" type="button">
          <SelectedIcon className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2" align="start">
        <Input placeholder="Search icons..." value={search} onChange={e => setSearch(e.target.value)} className="mb-2" />
        <ScrollArea className="h-56">
          <div className="grid grid-cols-7 gap-1">
            {filteredIcons.map(({
            name,
            Icon
          }) => <Button key={name} variant={value === name ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => {
            onChange(name);
            setOpen(false);
            setSearch("");
          }} type="button">
                <Icon className="w-[22px] h-[22px]" />
              </Button>)}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>;
};