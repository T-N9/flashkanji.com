import { Button } from "@nextui-org/react";
import KanjiStrokeViewer from "@/components/KanjiStrokeViewer"

export default function Home() {
  return (
    <main>
      <Button>Hello</Button>
      <KanjiStrokeViewer kanji={"普"} isSearch={true} />
    </main>
  );
}
