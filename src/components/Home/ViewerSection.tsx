import KanjiStrokeViewer from '@/components/KanjiStrokeViewer'

const ViewerSection = () => {
  return (
    <section className="w-full py-12 md:py-14 lg:py-16 bg-light dark:bg-dark_1">
    <div className="main-container grid items-center justify-center gap-4 px-4 text-center">
      <div className="space-y-3">
        <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
          Orders
        </div>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Understand{" "}
          <span className="text-primary">Stroke Orders</span>
        </h2>
        <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
          Learn the correct stroke order for each kanji in one touch
        </p>
      </div>
      <div className="mx-auto w-full max-w-sm space-y-2">
        <KanjiStrokeViewer kanji={"愛"} isSearch={true} />
      </div>
    </div>
  </section>
  )
}

export default ViewerSection