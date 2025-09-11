import { categoryService } from '@repo/supabase';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from '@repo/ui';
import { Edit, Eye, EyeOff, Hash, Plus, Save, Search, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Category {
    id: number;
    name: string;
    display_name: string;
    description?: string;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export default function CategoryManagementPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        display_name: '',
        description: '',
        sort_order: 0,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error('카테고리 로드 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = async () => {
        if (!formData.name.trim() || !formData.display_name.trim()) {
            alert('카테고리 이름과 표시 이름은 필수입니다.');
            return;
        }

        try {
            setIsSubmitting(true);

            // slug 자동 생성 (name을 기반으로)
            const categoryData = {
                ...formData,
                slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
            };

            await categoryService.createCategory(categoryData);
            setShowCreateForm(false);
            setFormData({ name: '', display_name: '', description: '', sort_order: 0 });
            loadCategories();
        } catch (error) {
            console.error('카테고리 생성 실패:', error);
            alert('카테고리 생성에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateCategory = async () => {
        if (!editingCategory) return;
        if (!formData.name.trim() || !formData.display_name.trim()) {
            alert('카테고리 이름과 표시 이름은 필수입니다.');
            return;
        }

        try {
            setIsSubmitting(true);

            // slug 자동 생성 (name을 기반으로)
            const categoryData = {
                ...formData,
                slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
            };

            await categoryService.updateCategory(editingCategory.id, categoryData);
            setEditingCategory(null);
            setFormData({ name: '', display_name: '', description: '', sort_order: 0 });
            loadCategories();
        } catch (error) {
            console.error('카테고리 수정 실패:', error);
            alert('카테고리 수정에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!confirm('정말로 이 카테고리를 삭제하시겠습니까?\n삭제된 카테고리는 복구할 수 없습니다.')) return;

        try {
            await categoryService.deleteCategory(id);
            loadCategories();
        } catch (error) {
            console.error('카테고리 삭제 실패:', error);
            alert('카테고리 삭제에 실패했습니다.');
        }
    };

    const handleToggleActive = async (category: Category) => {
        try {
            await categoryService.updateCategory(category.id, { is_active: !category.is_active });
            loadCategories();
        } catch (error) {
            console.error('카테고리 상태 변경 실패:', error);
            alert('카테고리 상태 변경에 실패했습니다.');
        }
    };

    const handleBulkStatusChange = async (isActive: boolean) => {
        if (selectedCategories.length === 0) return;

        try {
            for (const categoryId of selectedCategories) {
                await categoryService.updateCategory(categoryId, { is_active: isActive });
            }
            setSelectedCategories([]);
            loadCategories();
        } catch (error) {
            console.error('대량 상태 변경 실패:', error);
            alert('대량 상태 변경에 실패했습니다.');
        }
    };

    const startEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            display_name: category.display_name,
            description: category.description || '',
            sort_order: category.sort_order,
        });
    };

    const cancelEdit = () => {
        setEditingCategory(null);
        setShowCreateForm(false);
        setFormData({ name: '', display_name: '', description: '', sort_order: 0 });
    };

    const getNextOrderIndex = () => {
        if (categories.length === 0) return 1;
        return Math.max(...categories.map((c) => c.sort_order)) + 1;
    };

    const handleCreateFormOpen = () => {
        setFormData({ ...formData, sort_order: getNextOrderIndex() });
        setShowCreateForm(true);
    };

    const filteredCategories = categories.filter((category) => {
        const matchesSearch =
            searchTerm === '' ||
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.display_name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterActive === 'all' ||
            (filterActive === 'active' && category.is_active) ||
            (filterActive === 'inactive' && !category.is_active);

        return matchesSearch && matchesFilter;
    });

    const sortedCategories = [...filteredCategories].sort((a, b) => a.sort_order - b.sort_order);

    const activeCount = categories.filter((c) => c.is_active).length;
    const inactiveCount = categories.filter((c) => !c.is_active).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">카테고리 목록을 불러오는 중...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">📂 카테고리 관리</h1>
                    <p className="text-gray-600 mt-1">테스트 카테고리를 체계적으로 관리하고 구성하세요</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
                    <div className="text-sm text-gray-500">전체 카테고리</div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">{activeCount}</div>
                        <div className="text-sm text-gray-500">활성 카테고리</div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-lg font-semibold text-red-600">{inactiveCount}</div>
                        <div className="text-sm text-gray-500">비활성</div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">{categories.length}</div>
                        <div className="text-sm text-gray-500">총 카테고리</div>
                    </div>
                </Card>
            </div>

            {/* Search & Filters */}
            <Card className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="카테고리 이름이나 표시 이름으로 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2">
                        <select
                            value={filterActive}
                            onChange={(e) => setFilterActive(e.target.value as 'all' | 'active' | 'inactive')}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">전체 상태</option>
                            <option value="active">활성</option>
                            <option value="inactive">비활성</option>
                        </select>

                        <Button onClick={handleCreateFormOpen} className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />새 카테고리
                        </Button>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedCategories.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{selectedCategories.length}개 선택됨</span>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange(true)}>
                                    활성화
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange(false)}>
                                    비활성화
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            {/* 생성/수정 폼 */}
            {(showCreateForm || editingCategory) && (
                <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-blue-800">
                            {editingCategory ? (
                                <>
                                    <Edit className="w-6 h-6" />
                                    카테고리 수정
                                </>
                            ) : (
                                <>
                                    <Plus className="w-6 h-6" />새 카테고리 추가
                                </>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    카테고리 이름 (영문) <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase() })}
                                    placeholder="personality"
                                    className="font-mono"
                                />
                                <p className="text-xs text-gray-500">소문자, 숫자, 언더스코어만 사용 가능</p>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    표시 이름 <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={formData.display_name}
                                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                    placeholder="성격"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">설명</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="카테고리에 대한 상세한 설명을 입력하세요"
                                rows={3}
                                className="resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">정렬 순서</label>
                            <Input
                                type="number"
                                value={formData.sort_order}
                                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                                min="0"
                                className="w-32"
                            />
                            <p className="text-xs text-gray-500">숫자가 작을수록 먼저 표시됩니다</p>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                                disabled={isSubmitting}
                                className="flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        처리 중...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        {editingCategory ? '수정 완료' : '카테고리 생성'}
                                    </>
                                )}
                            </Button>
                            <Button variant="outline" onClick={cancelEdit} className="flex items-center gap-2">
                                <X className="w-4 h-4" />
                                취소
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Category List */}
            <div className="bg-white rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.length === categories.length && categories.length > 0}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedCategories(categories.map((c) => c.id));
                                            } else {
                                                setSelectedCategories([]);
                                            }
                                        }}
                                        className="rounded border-gray-300"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">표시 이름</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">이름</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">설명</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">상태</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">순서</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">수정일</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">액션</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sortedCategories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedCategories((prev) => [...prev, category.id]);
                                                } else {
                                                    setSelectedCategories((prev) => prev.filter((id) => id !== category.id));
                                                }
                                            }}
                                            className="rounded border-gray-300"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm font-medium text-gray-900">{category.display_name}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-gray-500 font-mono">{category.name}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-gray-500 max-w-xs truncate">{category.description || '-'}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            className={`flex items-center gap-1 w-fit ${
                                                category.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {category.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                            {category.is_active ? '활성' : '비활성'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-gray-900">{category.sort_order}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-gray-900">
                                            {new Date(category.updated_at).toLocaleDateString('ko-KR', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleToggleActive(category)}
                                                className={category.is_active ? 'text-green-600' : 'text-gray-600'}
                                            >
                                                {category.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => startEdit(category)}
                                                className="text-blue-600 hover:bg-blue-50"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDeleteCategory(category.id)}
                                                className="text-red-600 border-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty State */}
            {sortedCategories.length === 0 && !loading && (
                <Card className="p-12 text-center">
                    <Hash className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">카테고리가 없습니다</h3>
                    <p className="text-gray-500 mb-6">
                        {searchTerm || filterActive !== 'all'
                            ? '검색 조건에 맞는 카테고리가 없습니다. 다른 검색어를 시도해보세요.'
                            : '첫 번째 카테고리를 생성하여 테스트 분류를 시작해보세요!'}
                    </p>
                    {!searchTerm && filterActive === 'all' && (
                        <Button onClick={handleCreateFormOpen} className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />첫 번째 카테고리 생성하기
                        </Button>
                    )}
                </Card>
            )}
        </div>
    );
}
