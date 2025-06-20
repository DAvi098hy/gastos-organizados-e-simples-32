
import { useState, useEffect } from 'react';
import { CategoryRule, DEFAULT_CATEGORIES } from '@/types/transaction';

export const useCategoryManager = () => {
  const [categories, setCategories] = useState<CategoryRule[]>(() => {
    try {
      const stored = localStorage.getItem('customCategories');
      return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('customCategories', JSON.stringify(categories));
    } catch (error) {
      console.error('Erro ao salvar categorias:', error);
    }
  }, [categories]);

  const addCategory = (category: Omit<CategoryRule, 'id' | 'isDefault'>) => {
    const newCategory: CategoryRule = {
      ...category,
      id: Date.now().toString(),
      isDefault: false
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<CategoryRule>) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === id ? { ...cat, ...updates } : cat
      )
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id && cat.isDefault));
  };

  const addKeywordToCategory = (categoryId: string, keyword: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, keywords: [...cat.keywords, keyword.toLowerCase()] }
          : cat
      )
    );
  };

  const removeKeywordFromCategory = (categoryId: string, keyword: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, keywords: cat.keywords.filter(k => k !== keyword) }
          : cat
      )
    );
  };

  const getCategoryNames = () => categories.map(cat => cat.name);

  const getCategoryColors = () => {
    return categories.reduce((acc, cat) => {
      acc[cat.name] = cat.color;
      return acc;
    }, {} as Record<string, string>);
  };

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    addKeywordToCategory,
    removeKeywordFromCategory,
    getCategoryNames,
    getCategoryColors
  };
};
