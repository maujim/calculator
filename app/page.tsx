import Calculator from "../calculator"

export default function Home() {
  return (
    <main className="min-h-screen p-4 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Simple Calculator</h1>
          <p className="text-muted-foreground">A lightweight calculator with scientific functions</p>
        </div>
        <Calculator />
      </div>
    </main>
  )
}

