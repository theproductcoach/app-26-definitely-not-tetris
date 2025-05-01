import TetrisGame from "../components/TetrisGame";
import RetroLayout from "../components/RetroLayout";
import HomeLink from "../components/HomeLink";

export default function ClassicMode() {
  return (
    <RetroLayout>
      <HomeLink />
      <TetrisGame mode="classic" />
    </RetroLayout>
  );
}
