import { TodoList } from "@/components/ui/todo-list";

export default function Home() {
  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat fixed inset-0"
      style={{
        // 파일명이 smith.jpg가 맞는지 꼭 확인하세요!
        backgroundImage: "url('/smith.jpg')"
      }}
    >
      {/* 배경 어둡게 만들기 (글자 잘 보이게) */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* 투두 리스트 내용 */}
      <div className="relative z-10 w-full max-w-2xl">
        <TodoList />
      </div>
    </main>
  );
}