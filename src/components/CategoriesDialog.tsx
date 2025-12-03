import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconPicker, ICON_MAP } from "@/components/IconPicker";
import { Plus, Pencil, Trash2, Folder, TrendingUp, TrendingDown } from "lucide-react";
import { Category, Subcategory, CategoryType } from "@/hooks/useCategories";

interface CategoriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  subcategories: Subcategory[];
  onAddCategory: (category: { name: string; type: CategoryType; icon: string }) => void;
  onUpdateCategory: (data: { id: string; name: string; type: CategoryType; icon: string }) => void;
  onDeleteCategory: (id: string) => void;
  onAddSubcategory: (subcategory: { name: string; icon: string; category_id: string }) => void;
  onUpdateSubcategory: (data: { id: string; name: string; icon: string }) => void;
  onDeleteSubcategory: (id: string) => void;
}

export const CategoriesDialog = ({
  open,
  onOpenChange,
  categories,
  subcategories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddSubcategory,
  onUpdateSubcategory,
  onDeleteSubcategory,
}: CategoriesDialogProps) => {
  const [selectedType, setSelectedType] = useState<CategoryType>("Expense");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("folder");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [newSubcategoryIcon, setNewSubcategoryIcon] = useState("tag");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);

  const filteredCategories = categories.filter((c) => c.type === selectedType);
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const filteredSubcategories = subcategories.filter(
    (s) => s.category_id === selectedCategoryId
  );

  const handleTypeChange = (type: CategoryType) => {
    setSelectedType(type);
    setSelectedCategoryId(null);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory({ name: newCategoryName.trim(), type: selectedType, icon: newCategoryIcon });
      setNewCategoryName("");
      setNewCategoryIcon("folder");
    }
  };

  const handleUpdateCategory = () => {
    if (editingCategory && editingCategory.name.trim()) {
      onUpdateCategory({
        id: editingCategory.id,
        name: editingCategory.name.trim(),
        type: editingCategory.type,
        icon: editingCategory.icon,
      });
      setEditingCategory(null);
    }
  };

  const handleAddSubcategory = () => {
    if (newSubcategoryName.trim() && selectedCategoryId) {
      onAddSubcategory({
        name: newSubcategoryName.trim(),
        icon: newSubcategoryIcon,
        category_id: selectedCategoryId,
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
        icon: editingSubcategory.icon,
      });
      setEditingSubcategory(null);
    }
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = ICON_MAP[iconName] || Folder;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
          <DialogDescription>
            Create and organize categories and subcategories for your transactions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
          {/* Categories Column */}
          <div className="flex flex-col min-h-0">
            <h3 className="font-semibold mb-3">Categories</h3>
            
            {/* Type Tabs */}
            <Tabs value={selectedType} onValueChange={(v) => handleTypeChange(v as CategoryType)} className="mb-4">
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
            
            {/* Add Category Form */}
            <div className="flex gap-2 mb-4">
              <IconPicker value={newCategoryIcon} onChange={setNewCategoryIcon} />
              <Input
                placeholder={`New ${selectedType.toLowerCase()} category`}
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              />
              <Button onClick={handleAddCategory} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Categories List */}
            <ScrollArea className="flex-1 border rounded-md">
              <div className="p-2 space-y-1">
                {filteredCategories.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No {selectedType.toLowerCase()} categories yet. Create one above.
                  </p>
                ) : (
                  filteredCategories.map((category) => (
                    <div
                      key={category.id}
                      className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                        selectedCategoryId === category.id
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedCategoryId(category.id)}
                    >
                      {editingCategory?.id === category.id ? (
                        <>
                          <IconPicker
                            value={editingCategory.icon}
                            onChange={(icon) =>
                              setEditingCategory({ ...editingCategory, icon })
                            }
                          />
                          <Input
                            value={editingCategory.name}
                            onChange={(e) =>
                              setEditingCategory({
                                ...editingCategory,
                                name: e.target.value,
                              })
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleUpdateCategory();
                              if (e.key === "Escape") setEditingCategory(null);
                            }}
                            className="flex-1"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateCategory();
                            }}
                          >
                            Save
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="text-muted-foreground">
                            {renderIcon(category.icon)}
                          </span>
                          <span className="flex-1 truncate">{category.name}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCategory(category);
                            }}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteCategory(category.id);
                              if (selectedCategoryId === category.id) {
                                setSelectedCategoryId(null);
                              }
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Subcategories Column */}
          <div className="flex flex-col min-h-0">
            <h3 className="font-semibold mb-3">
              Subcategories
              {selectedCategory && (
                <span className="font-normal text-muted-foreground ml-2">
                  for {selectedCategory.name}
                </span>
              )}
            </h3>

            {selectedCategoryId ? (
              <>
                {/* Add Subcategory Form */}
                <div className="flex gap-2 mb-4 mt-[52px]">
                  <IconPicker value={newSubcategoryIcon} onChange={setNewSubcategoryIcon} />
                  <Input
                    placeholder="New subcategory name"
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSubcategory()}
                  />
                  <Button onClick={handleAddSubcategory} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Subcategories List */}
                <ScrollArea className="flex-1 border rounded-md">
                  <div className="p-2 space-y-1">
                    {filteredSubcategories.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No subcategories yet. Create one above.
                      </p>
                    ) : (
                      filteredSubcategories.map((subcategory) => (
                        <div
                          key={subcategory.id}
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                        >
                          {editingSubcategory?.id === subcategory.id ? (
                            <>
                              <IconPicker
                                value={editingSubcategory.icon}
                                onChange={(icon) =>
                                  setEditingSubcategory({ ...editingSubcategory, icon })
                                }
                              />
                              <Input
                                value={editingSubcategory.name}
                                onChange={(e) =>
                                  setEditingSubcategory({
                                    ...editingSubcategory,
                                    name: e.target.value,
                                  })
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleUpdateSubcategory();
                                  if (e.key === "Escape") setEditingSubcategory(null);
                                }}
                                className="flex-1"
                                autoFocus
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleUpdateSubcategory}
                              >
                                Save
                              </Button>
                            </>
                          ) : (
                            <>
                              <span className="text-muted-foreground">
                                {renderIcon(subcategory.icon)}
                              </span>
                              <span className="flex-1 truncate">{subcategory.name}</span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={() => setEditingSubcategory(subcategory)}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                onClick={() => onDeleteSubcategory(subcategory.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center border rounded-md mt-[52px]">
                <p className="text-sm text-muted-foreground">
                  Select a category to manage its subcategories
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
