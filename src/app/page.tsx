import Canvas from '@/components/Canvas';
import MainBar from '@/components/MainBar';

export default function Home() {
  return (
    <div
      className={`flex flex-1 h-[100%] w-[100%] justify-center items-center rounded-none`}
    >
      <MainBar></MainBar>
      <Canvas />
    </div>
  );
}
