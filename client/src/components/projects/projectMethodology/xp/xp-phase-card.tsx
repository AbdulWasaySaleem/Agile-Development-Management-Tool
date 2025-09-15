"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, Code, TestTube, Rocket } from "lucide-react"

interface XPPhase {
  _id: string
  taskId: string
  currentPhase: string
  priority: string
  status: string
  planning?: {
    taskDescription: string
    priority: string
  }
  coding?: {
    codeReady: boolean
    readyForReview: boolean
    pairProgramming: boolean
  }
  testing?: {
    testsPassed: boolean
  }
  release?: {
    released: boolean
  }
}

interface XPPhaseCardProps {
  xpPhase: XPPhase
  currentPhase: string
  onUpdatePhase: (xpPhaseId: string, newPhase: string) => void
  onUpdateCoding: (xpPhaseId: string, updates: any) => void
  onUpdateTesting: (xpPhaseId: string, updates: any) => void
  onUpdateRelease: (xpPhaseId: string, updates: any) => void
}

const phases = ["Planning", "Design", "Coding", "Testing", "Release"]

const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case "high":
      return "destructive"
    case "medium":
      return "default"
    case "low":
      return "secondary"
    default:
      return "outline"
  }
}

export function XPPhaseCard({
  xpPhase,
  currentPhase,
  onUpdatePhase,
  onUpdateCoding,
  onUpdateTesting,
  onUpdateRelease,
}: XPPhaseCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-base line-clamp-2">
            {String(xpPhase.planning?.taskDescription || "Task Description")}
          </CardTitle>
          <Badge variant={getPriorityColor(xpPhase.planning?.priority || xpPhase.priority)}>
            {String(xpPhase.planning?.priority || xpPhase.priority || "Medium")}
          </Badge>
        </div>
        <Badge variant="outline" className="w-fit">
          {String(xpPhase.status || "Active")}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Coding Phase Specific Fields */}
        {currentPhase === "Coding" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Code className="h-4 w-4" />
              Code Readiness
            </div>
            <div className="space-y-2 pl-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`code-ready-${xpPhase._id}`}
                  checked={xpPhase.coding?.codeReady || false}
                  onCheckedChange={(checked) => onUpdateCoding(xpPhase._id, { codeReady: checked })}
                />
                <label htmlFor={`code-ready-${xpPhase._id}`} className="text-sm">
                  Code Ready
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`ready-review-${xpPhase._id}`}
                  checked={xpPhase.coding?.readyForReview || false}
                  onCheckedChange={(checked) => onUpdateCoding(xpPhase._id, { readyForReview: checked })}
                />
                <label htmlFor={`ready-review-${xpPhase._id}`} className="text-sm">
                  Ready for Review
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`pair-programming-${xpPhase._id}`}
                  checked={xpPhase.coding?.pairProgramming || false}
                  onCheckedChange={(checked) => onUpdateCoding(xpPhase._id, { pairProgramming: checked })}
                />
                <label htmlFor={`pair-programming-${xpPhase._id}`} className="text-sm">
                  Pair Programming
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Testing Phase Specific Fields */}
        {currentPhase === "Testing" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <TestTube className="h-4 w-4" />
              Testing Status
            </div>
            <Button
              variant={xpPhase.testing?.testsPassed ? "default" : "outline"}
              size="sm"
              onClick={() =>
                onUpdateTesting(xpPhase._id, {
                  testsPassed: !xpPhase.testing?.testsPassed,
                })
              }
              className="w-full"
            >
              {xpPhase.testing?.testsPassed ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Tests Passed
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Tests Not Passed
                </>
              )}
            </Button>
          </div>
        )}

        {/* Release Phase Specific Fields */}
        {currentPhase === "Release" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Rocket className="h-4 w-4" />
              Release Status
            </div>
            <div className="flex gap-2">
              <Button
                variant={xpPhase.release?.released ? "default" : "outline"}
                size="sm"
                onClick={() => onUpdateRelease(xpPhase._id, { released: true })}
                className="flex-1"
              >
                Release
              </Button>
              <Button
                variant={!xpPhase.release?.released ? "default" : "outline"}
                size="sm"
                onClick={() => onUpdateRelease(xpPhase._id, { released: false })}
                className="flex-1"
              >
                Hold
              </Button>
            </div>
          </div>
        )}

        {/* Phase Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Change Phase</label>
          <Select value={xpPhase.currentPhase} onValueChange={(newPhase) => onUpdatePhase(xpPhase._id, newPhase)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {phases.map((phase) => (
                <SelectItem key={phase} value={phase}>
                  {phase}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
