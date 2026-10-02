import { Portfolio } from "@/components/Portfolio";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-1 flex-col items-center py-16 px-6 bg-white dark:bg-black">
        <h1 className="mb-8 self-start text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          My Portfolio
        </h1>
        <Portfolio />
      </main>
    </div>
  );
}
