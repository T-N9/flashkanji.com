import { Button } from "@nextui-org/react";
import KanjiStrokeViewer from "@/components/KanjiStrokeViewer"

export default function Home() {
  return (
    <main>
      <h1 className="heading-1">
        Master Kanji with FlashKanji
        フラッシュ漢字
      </h1>
      <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Porro nulla quas possimus obcaecati dignissimos suscipit est quam placeat labore vel, a delectus repellat, sit unde ipsam fuga, dolor dolorum distinctio?</p>
      <Button>Hello</Button>
      <KanjiStrokeViewer kanji={"普"} isSearch={true} />
    </main>
  );
}
