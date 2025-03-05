"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export default function Calculator() {
  const [input, setInput] = React.useState<string>("")
  const [result, setResult] = React.useState<string>("")
  const [history, setHistory] = React.useState<Array<{ input: string; result: string; count?: number }>>([])
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Focus the input on initial render
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Handle keyboard input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      calculate()
    }
  }

  // Parse and calculate the expression
  const calculate = () => {
    if (!input.trim()) return

    try {
      // Process expression with support for scientific functions
      const processedInput = processScientificFunctions(input)
      const calculatedResult = evaluateExpression(processedInput)

      // Update state
      setResult(calculatedResult.toString())

      // Add to history with grouping for consecutive identical calculations
      setHistory((prev) => {
        // Check if this calculation is identical to the most recent one
        if (prev.length > 0 && prev[0].input === input && prev[0].result === calculatedResult.toString()) {
          // Increment the count for consecutive identical calculations
          const updatedHistory = [...prev]
          updatedHistory[0] = {
            ...updatedHistory[0],
            count: (updatedHistory[0].count || 1) + 1,
          }
          return updatedHistory
        } else {
          // Add new calculation to history
          return [{ input, result: calculatedResult.toString(), count: 1 }, ...prev]
        }
      })

      // Clear input and focus it again
      setInput("")
      inputRef.current?.focus()
    } catch (error) {
      setResult("Error")
    }
  }

  // Process scientific functions in the input
  const processScientificFunctions = (expression: string): string => {
    // Replace scientific functions with their JavaScript equivalents
    const processed = expression
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/log\(/g, "Math.log10(")
      .replace(/ln\(/g, "Math.log(")
      .replace(/sqrt\(/g, "Math.sqrt(")
      .replace(/\^/g, "**")
      .replace(/π/g, "Math.PI")
      .replace(/pi/g, "Math.PI")
      .replace(/e/g, "Math.E")

    return processed
  }

  // Safely evaluate mathematical expressions
  const evaluateExpression = (expression: string): number => {
    // Create a function that executes the expression
    // This is safer than using eval() directly
    try {
      // eslint-disable-next-line no-new-func
      const func = new Function(`return ${expression}`)
      const result = func()

      if (typeof result !== "number" || !isFinite(result)) {
        throw new Error("Invalid result")
      }

      return result
    } catch (error) {
      throw new Error("Invalid expression")
    }
  }

  // Handle button clicks
  const handleButtonClick = (value: string) => {
    if (value === "=") {
      calculate()
    } else if (value === "C") {
      setInput("")
      setResult("")
    } else if (value === "←") {
      setInput((prev) => prev.slice(0, -1))
    } else {
      setInput((prev) => prev + value)
      inputRef.current?.focus()
    }
  }

  // Handle history item click - restore the input
  const handleHistoryItemClick = (item: { input: string; result: string; count?: number }) => {
    setInput(item.input)
    inputRef.current?.focus()
  }

  // Clear history
  const clearHistory = () => {
    setHistory([])
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl mx-auto p-4">
      {/* Calculator */}
      <Card className="w-full md:w-2/3">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            {/* Input and Result */}
            <div className="space-y-2">
              <Input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter expression..."
                className="text-xl font-mono p-4 h-14"
              />
              <div className="text-right text-2xl font-mono h-8 text-primary">{result}</div>
            </div>

            {/* Scientific Functions */}
            <div className="grid grid-cols-4 gap-2">
              {["sin", "cos", "tan", "^"].map((btn) => (
                <Button key={btn} variant="outline" onClick={() => handleButtonClick(btn)} className="h-10">
                  {btn}
                </Button>
              ))}
              {["log", "ln", "sqrt", "π"].map((btn) => (
                <Button key={btn} variant="outline" onClick={() => handleButtonClick(btn)} className="h-10">
                  {btn}
                </Button>
              ))}
            </div>

            {/* Number Pad and Operators */}
            <div className="grid grid-cols-4 gap-2">
              {["7", "8", "9", "/"].map((btn) => (
                <Button
                  key={btn}
                  variant={btn === "/" ? "secondary" : "outline"}
                  onClick={() => handleButtonClick(btn)}
                  className="h-12 text-lg"
                >
                  {btn}
                </Button>
              ))}
              {["4", "5", "6", "*"].map((btn) => (
                <Button
                  key={btn}
                  variant={btn === "*" ? "secondary" : "outline"}
                  onClick={() => handleButtonClick(btn)}
                  className="h-12 text-lg"
                >
                  {btn}
                </Button>
              ))}
              {["1", "2", "3", "-"].map((btn) => (
                <Button
                  key={btn}
                  variant={btn === "-" ? "secondary" : "outline"}
                  onClick={() => handleButtonClick(btn)}
                  className="h-12 text-lg"
                >
                  {btn}
                </Button>
              ))}
              {["0", ".", "=", "+"].map((btn) => (
                <Button
                  key={btn}
                  variant={btn === "=" ? "default" : btn === "+" ? "secondary" : "outline"}
                  onClick={() => handleButtonClick(btn)}
                  className={cn("h-12 text-lg", btn === "=" && "bg-primary text-primary-foreground")}
                >
                  {btn}
                </Button>
              ))}
            </div>

            {/* Control Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="destructive" onClick={() => handleButtonClick("C")} className="h-12">
                Clear
              </Button>
              <Button variant="outline" onClick={() => handleButtonClick("←")} className="h-12">
                Backspace
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Panel */}
      <Card className="w-full md:w-1/3">
        <CardContent className="p-4 h-full">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">History</h3>
            {history.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearHistory} className="h-8 px-2">
                Clear <X className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
          <Separator className="mb-2" />
          <ScrollArea className="h-[calc(100vh-14rem)] md:h-[500px]">
            {history.length > 0 ? (
              <div className="space-y-2">
                {history.map((item, index) => (
                  <Card
                    key={index}
                    className="p-2 cursor-pointer hover:bg-muted/50 transition-colors relative"
                    onClick={() => handleHistoryItemClick(item)}
                  >
                    <div className="text-sm font-mono">{item.input}</div>
                    <div className="text-right text-sm font-medium text-primary">{item.result}</div>
                    {item.count && item.count > 1 && (
                      <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.count}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">No calculations yet</div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

