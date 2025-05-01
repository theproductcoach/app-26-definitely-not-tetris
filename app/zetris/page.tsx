import TetrisGame from "../components/TetrisGame";
import RetroLayout from "../components/RetroLayout";
import HomeLink from "../components/HomeLink";

export default function ZetrisMode() {
  return (
    <RetroLayout>
      <HomeLink />
      <TetrisGame mode="zetris" />
    </RetroLayout>
  );
}
