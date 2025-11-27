"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, CheckCircle2, Circle, Calendar } from "lucide-react";

interface Todo {
    id: string;
    text: string;
    completed: boolean;
    created_at?: string;
}

export function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputValue, setInputValue] = useState("");

    // 데이터 가져오기
    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setTodos(data as Todo[]);
    };

    // 추가하기
    const addTodo = async () => {
        if (inputValue.trim()) {
            const { error } = await supabase
                .from('todos')
                .insert([{ text: inputValue.trim(), completed: false }]);

            if (error) {
                alert("저장에 실패했습니다.");
            } else {
                fetchTodos();
                setInputValue("");
            }
        }
    };

    // 완료 체크하기
    const toggleTodo = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('todos')
            .update({ completed: !currentStatus })
            .eq('id', id);

        if (!error) fetchTodos();
    };

    // 삭제하기
    const deleteTodo = async (id: string) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            const { error } = await supabase
                .from('todos')
                .delete()
                .eq('id', id);

            if (!error) fetchTodos();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") addTodo();
    };

    const completedCount = todos.filter((todo) => todo.completed).length;
    const totalCount = todos.length;

    return (
        // 1. 카드 배경을 투명하게 설정 (bg-white/30 -> 30% 불투명)
        // backdrop-blur-md 효과로 뒤에 있는 사진이 흐릿하고 예쁘게 비침
        <Card className="w-full shadow-2xl border-0 bg-white/30 backdrop-blur-md">
            <CardHeader className="space-y-4 pb-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        {/* 제목은 잘 보이게 검은색 유지 */}
                        <CardTitle className="text-3xl font-bold text-black flex items-center gap-2">
                            <Calendar className="w-8 h-8 text-blue-700" />
                            나만의 투두 리스트
                        </CardTitle>
                        <CardDescription className="text-gray-800 font-semibold">
                            오늘 할 일을 기록하고 관리해보세요.
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        {/* 뱃지도 잘 보이게 흰색 배경 추가 */}
                        <Badge variant="outline" className="px-3 py-1 text-sm font-bold bg-white text-blue-600 border-blue-200 shadow-sm">
                            <Circle className="w-3 h-3 mr-1 fill-blue-500 text-blue-500" />
                            할 일 {totalCount - completedCount}개
                        </Badge>
                        <Badge variant="outline" className="px-3 py-1 text-sm font-bold bg-white text-green-600 border-green-200 shadow-sm">
                            <CheckCircle2 className="w-3 h-3 mr-1 fill-green-500 text-green-500" />
                            완료 {completedCount}개
                        </Badge>
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    {/* 2. 입력창은 완전한 흰색(bg-white)으로 설정해서 뚜렷하게 보이게 함 */}
                    <Input
                        placeholder="할 일을 입력하세요 (엔터)"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 h-12 text-base border-0 ring-2 ring-white/50 focus-visible:ring-blue-500 text-black bg-white shadow-lg placeholder:text-gray-400"
                    />
                    <Button onClick={addTodo} size="lg" className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg border border-white/20">
                        <Plus className="w-5 h-5 mr-1" /> 추가
                    </Button>
                </div>
            </CardHeader>

            {/* 구분선도 약간 진하게 */}
            <Separator className="mb-2 bg-gray-400/50" />

            <CardContent className="pt-4">
                <ScrollArea className="h-[500px] pr-4">
                    {todos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[300px] text-center">
                            <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                                <Calendar className="w-10 h-10 text-gray-600" />
                            </div>
                            <p className="text-lg font-bold text-gray-800">아직 등록된 할 일이 없어요.</p>
                            <p className="text-sm mt-1 text-gray-700">첫 번째 할 일을 추가해보세요!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {todos.map((todo) => (
                                // 3. 리스트 아이템도 흰색(bg-white) 블록으로 만들어서 글씨 가독성 확보
                                <div key={todo.id} className="group relative overflow-hidden rounded-xl border-0 bg-white shadow-md hover:scale-[1.02] transition-all duration-200">
                                    <div className="flex items-center gap-4 p-4">
                                        <Checkbox
                                            id={todo.id}
                                            checked={todo.completed}
                                            onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
                                            className="w-6 h-6 border-2 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                        />
                                        <label htmlFor={todo.id} className={`flex-1 text-lg cursor-pointer select-none ${todo.completed ? "line-through text-gray-400" : "text-gray-900 font-bold"}`}>
                                            {todo.text}
                                        </label>
                                        <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)} className="opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all">
                                            <Trash2 className="w-5 h-5 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}