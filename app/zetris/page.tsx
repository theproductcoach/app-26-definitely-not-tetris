import TetrisGame from "../components/TetrisGame";
import RetroLayout from "../components/RetroLayout";

export default function ZetrisMode() {
  return (
    <RetroLayout mode="zetris">
      <TetrisGame mode="zetris" />
    </RetroLayout>
  );
}
