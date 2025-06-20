
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Settings, Trash2, X } from 'lucide-react';
import { useCategoryManager } from '@/hooks/useCategoryManager';
import { toast } from 'sonner';

const CategoryManager: React.FC = () => {
  const { 
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    addKeywordToCategory, 
    removeKeywordFromCategory 
  } = useCategoryManager();

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('bg-gray-100 text-gray-800 border-gray-200');
  const [newKeywords, setNewKeywords] = useState<Record<string, string>>({});

  const colorOptions = [
    { value: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Azul' },
    { value: 'bg-green-100 text-green-800 border-green-200', label: 'Verde' },
    { value: 'bg-red-100 text-red-800 border-red-200', label: 'Vermelho' },
    { value: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Roxo' },
    { value: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Laranja' },
    { value: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Amarelo' },
    { value: 'bg-pink-100 text-pink-800 border-pink-200', label: 'Rosa' },
    { value: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Cinza' },
  ];

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Nome da categoria é obrigatório');
      return;
    }

    addCategory({
      name: newCategoryName.trim(),
      keywords: [],
      color: newCategoryColor
    });

    setNewCategoryName('');
    setNewCategoryColor('bg-gray-100 text-gray-800 border-gray-200');
    setIsAddingCategory(false);
    toast.success('Categoria adicionada com sucesso!');
  };

  const handleAddKeyword = (categoryId: string) => {
    const keyword = newKeywords[categoryId]?.trim();
    if (!keyword) return;

    addKeywordToCategory(categoryId, keyword);
    setNewKeywords(prev => ({ ...prev, [categoryId]: '' }));
    toast.success('Palavra-chave adicionada!');
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    if (categories.find(cat => cat.id === categoryId)?.isDefault) {
      toast.error('Não é possível excluir categorias padrão');
      return;
    }

    deleteCategory(categoryId);
    toast.success(`Categoria "${categoryName}" removida`);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Gerenciar Categorias
          </CardTitle>
          <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Categoria</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="categoryName">Nome da Categoria</Label>
                  <Input
                    id="categoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Ex: Educação"
                  />
                </div>
                <div>
                  <Label>Cor da Categoria</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setNewCategoryColor(color.value)}
                        className={`p-2 rounded-lg border-2 ${
                          newCategoryColor === color.value 
                            ? 'border-blue-500' 
                            : 'border-gray-200'
                        }`}
                      >
                        <div className={`w-full h-6 rounded ${color.value.split(' ')[0]} ${color.value.split(' ')[2]}`} />
                        <span className="text-xs mt-1 block">{color.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddCategory} className="flex-1">
                    Adicionar
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddingCategory(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {categories.map((category) => (
          <Card key={category.id} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge className={category.color}>
                    {category.name}
                  </Badge>
                  {category.isDefault && (
                    <Badge variant="outline" className="text-xs">
                      Padrão
                    </Badge>
                  )}
                </div>
                {!category.isDefault && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteCategory(category.id, category.name)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Palavras-chave:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {category.keywords.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {keyword}
                        <button
                          onClick={() => removeKeywordFromCategory(category.id, keyword)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Nova palavra-chave"
                    value={newKeywords[category.id] || ''}
                    onChange={(e) =>
                      setNewKeywords(prev => ({
                        ...prev,
                        [category.id]: e.target.value
                      }))
                    }
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddKeyword(category.id);
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleAddKeyword(category.id)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
