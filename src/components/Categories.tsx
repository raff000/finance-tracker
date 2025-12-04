import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconPicker, ICON_MAP } from "@/components/IconPicker";
import { ColorPicker } from "@/components/ColorPicker";
import { Plus, Pencil, Trash2, Folder, TrendingUp, TrendingDown, Tags } from "lucide-react";
import { Category, Subcategory, CategoryType } from "@/hooks/useCategories";
interface CategoriesProps {
  categories: Category[];
  subcategories: Subcategory[];
  onAddCategory: (category: {
    name: string;
    type: CategoryType;
    icon: string;
    color: string;
  }) => void;
  onUpdateCategory: (data: {
    id: string;
    name: string;
    type: CategoryType;
    icon: string;
    color: string;
  }) => void;
  onDeleteCategory: (id: string) => void;
  onAddSubcategory: (subcategory: {
    name: string;
    icon: string;
    category_id: string;
  }) => void;
  onUpdateSubcategory: (data: {
    id: string;
    name: string;
    icon: string;
  }) => void;
  onDeleteSubcategory: (id: string) => void;
}
export const Categories = ({
  categories,
  subcategories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddSubcategory,
  onUpdateSubcategory,
  onDeleteSubcategory
}: CategoriesProps) => {
  const [selectedType, setSelectedType] = useState<CategoryType>("Expense");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("folder");
  const [newCategoryColor, setNewCategoryColor] = useState("#6366f1");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [newSubcategoryIcon, setNewSubcategoryIcon] = useState("tag");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const filteredCategories = categories.filter(c => c.type === selectedType);
  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const filteredSubcategories = subcategories.filter(s => s.category_id === selectedCategoryId);
  const handleTypeChange = (type: CategoryType) => {
    setSelectedType(type);
    setSelectedCategoryId(null);
  };
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory({
        name: newCategoryName.trim(),
        type: selectedType,
        icon: newCategoryIcon,
        color: newCategoryColor
      });
      setNewCategoryName("");
      setNewCategoryIcon("folder");
      setNewCategoryColor("#6366f1");
    }
  };
  const handleUpdateCategory = () => {
    if (editingCategory && editingCategory.name.trim()) {
      onUpdateCategory({
        id: editingCategory.id,
        name: editingCategory.name.trim(),
        type: editingCategory.type,
        icon: editingCategory.icon,
        color: editingCategory.color
      });
      setEditingCategory(null);
    }
  };
  const handleAddSubcategory = () => {
    if (newSubcategoryName.trim() && selectedCategoryId) {
      onAddSubcategory({
        name: newSubcategoryName.trim(),
        icon: newSubcategoryIcon,
        category_id: selectedCategoryId
      });
      setNewSubcategoryName("");
      setNewSubcategoryIcon("tag");
    }
  };
  const handleUpdateSubcategory = () => {
    if (editingSubcategory && editingSubcategory.name.trim()) {
      onUpdateSubcategory({
        id: editingSubcategory.id,
        name: editingSubcategory.name.trim(),
        icon: editingSubcategory.icon
      });
      setEditingSubcategory(null);
    }
  };
  const renderIcon = (iconName: string, color?: string) => {
    const IconComponent = ICON_MAP[iconName] || Folder;
    return <IconComponent className="h-5 w-5" style={color ? {
      color
    } : undefined} />;
  };
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Create and organize categories and subcategories for your transactions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories Column */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Categories</CardTitle>
            <Tabs value={selectedType} onValueChange={v => handleTypeChange(v as CategoryType)} className="mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="Expense" className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Expense
                </TabsTrigger>
                <TabsTrigger value="Income" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Income
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            {/* Add Category Form */}
            <div className="flex gap-2 mb-4">
              <IconPicker value={newCategoryIcon} onChange={setNewCategoryIcon} />
              <ColorPicker value={newCategoryColor} onChange={setNewCategoryColor} />
              <Input placeholder={`New ${selectedType.toLowerCase()} category`} value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddCategory()} />
              <Button onClick={handleAddCategory} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Categories List */}
            <ScrollArea className="flex-1 border rounded-md min-h-[300px]">
              <div className="p-2 space-y-1 pr-[6px] pl-[7px] pt-[6px] pb-[6px]">
                {filteredCategories.length === 0 ? <div className="flex flex-col items-center justify-center py-8">
                    <Tags className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground text-center">
                      No {selectedType.toLowerCase()} categories yet. Create one above.
                    </p>
                  </div> : filteredCategories.map(category => <div key={category.id} className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${selectedCategoryId === category.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"}`} onClick={() => setSelectedCategoryId(category.id)}>
                      {editingCategory?.id === category.id ? <>
                          <IconPicker value={editingCategory.icon} onChange={icon => setEditingCategory({
                    ...editingCategory,
                    icon
                  })} />
                          <ColorPicker value={editingCategory.color} onChange={color => setEditingCategory({
                    ...editingCategory,
                    color
                  })} />
                          <Input value={editingCategory.name} onChange={e => setEditingCategory({
                    ...editingCategory,
                    name: e.target.value
                  })} onKeyDown={e => {
                    if (e.key === "Enter") handleUpdateCategory();
                    if (e.key === "Escape") setEditingCategory(null);
                  }} className="flex-1" autoFocus />
                          <Button size="sm" variant="ghost" onClick={e => {
                    e.stopPropagation();
                    handleUpdateCategory();
                  }}>
                            Save
                          </Button>
                        </> : <>
                          <span style={{
                    color: category.color
                  }}>
                            {renderIcon(category.icon, category.color)}
                          </span>
                          <span style={{
                    color: category.color
                  }} className="flex-1 truncate text-sm">
                            {category.name}
                          </span>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={e => {
                    e.stopPropagation();
                    setEditingCategory(category);
                  }}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={e => {
                    e.stopPropagation();
                    onDeleteCategory(category.id);
                    if (selectedCategoryId === category.id) {
                      setSelectedCategoryId(null);
                    }
                  }}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>}
                    </div>)}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Subcategories Column */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              Subcategories
              {selectedCategory && <span className="font-normal ml-2" style={{
              color: selectedCategory.color
            }}>
                  for {selectedCategory.name}
                </span>}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            {selectedCategoryId ? <>
                {/* Add Subcategory Form */}
                <div className="flex gap-2 mb-4">
                  <IconPicker value={newSubcategoryIcon} onChange={setNewSubcategoryIcon} />
                  <Input placeholder="New subcategory name" value={newSubcategoryName} onChange={e => setNewSubcategoryName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddSubcategory()} />
                  <Button onClick={handleAddSubcategory} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Subcategories List */}
                <ScrollArea className="flex-1 border rounded-md min-h-[300px]">
                  <div className="p-2 space-y-1">
                    {filteredSubcategories.length === 0 ? <div className="flex flex-col items-center justify-center py-8">
                        <Tags className="h-10 w-10 text-muted-foreground mb-3" />
                        <p className="text-sm text-muted-foreground text-center">
                          No subcategories yet. Create one above.
                        </p>
                      </div> : filteredSubcategories.map(subcategory => <div key={subcategory.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                          {editingSubcategory?.id === subcategory.id ? <>
                              <IconPicker value={editingSubcategory.icon} onChange={icon => setEditingSubcategory({
                      ...editingSubcategory,
                      icon
                    })} />
                              <Input value={editingSubcategory.name} onChange={e => setEditingSubcategory({
                      ...editingSubcategory,
                      name: e.target.value
                    })} onKeyDown={e => {
                      if (e.key === "Enter") handleUpdateSubcategory();
                      if (e.key === "Escape") setEditingSubcategory(null);
                    }} className="flex-1" autoFocus />
                              <Button size="sm" variant="ghost" onClick={handleUpdateSubcategory}>
                                Save
                              </Button>
                            </> : <>
                              <span style={{
                      color: selectedCategory?.color
                    }}>
                                {renderIcon(subcategory.icon, selectedCategory?.color)}
                              </span>
                              <span style={{
                      color: selectedCategory?.color
                    }} className="flex-1 truncate text-sm">
                                {subcategory.name}
                              </span>
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingSubcategory(subcategory)}>
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDeleteSubcategory(subcategory.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </>}
                        </div>)}
                  </div>
                </ScrollArea>
              </> : <div className="flex-1 flex flex-col items-center justify-center border rounded-md min-h-[300px]">
                <Tags className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  Select a category to manage its subcategories
                </p>
              </div>}
          </CardContent>
        </Card>
      </div>
    </div>;
};