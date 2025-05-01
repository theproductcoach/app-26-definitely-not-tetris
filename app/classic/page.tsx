import TetrisGame from "../components/TetrisGame";
import RetroLayout from "../components/RetroLayout";

export default function ClassicMode() {
  return (
    <RetroLayout mode="classic">
      <TetrisGame mode="classic" />
    </RetroLayout>
  );
}
