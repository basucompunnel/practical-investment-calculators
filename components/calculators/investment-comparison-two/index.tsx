"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  InvestmentType,
  CompareBy,
  ComparisonMode,
  InvestmentInputs,
  InvestmentResult,
} from "./types";
import { DEFAULTS } from "./constants";
import { calculateInvestment } from "./utils";
import { InvestmentPanel } from "./InvestmentPanel";
import { ComparisonResults } from "./ComparisonResults";

export default function InvestmentComparisonTwo() {
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>("single");
  const [compareBy, setCompareBy] = useState<CompareBy>("rate");
  const [inflationRate, setInflationRate] = useState<string>("6");
  
  const [investment1, setInvestment1] = useState<InvestmentInputs>({
    type: "sip",
    amount: String(DEFAULTS.sip.amount),
    stepUpRate: String(DEFAULTS.sip.stepUpRate),
    rate: String(DEFAULTS.sip.rate),
    years: String(DEFAULTS.sip.years),
  });

  const [investment2, setInvestment2] = useState<InvestmentInputs>({
    type: "sip",
    amount: String(DEFAULTS.sip.amount),
    stepUpRate: String(DEFAULTS.sip.stepUpRate),
    rate: "10",
    years: String(DEFAULTS.sip.years),
  });

  const [result1, setResult1] = useState<InvestmentResult | null>(null);
  const [result2, setResult2] = useState<InvestmentResult | null>(null);

  /**
   * Sync Investment 2 parameters with Investment 1 in single-parameter comparison mode
   * This ensures only one parameter differs between the two investments
   * Runs whenever Investment 1 changes, comparison mode changes, or compareBy changes
   */
  useEffect(() => {
    if (comparisonMode === "all") {
      // In "all" mode, don't sync - allow all parameters to differ independently
      return;
    }
    
    setInvestment2(prev => {
      // Copy all values from Investment 1
      const synced = { ...investment1 };
      // But keep the comparison field from Investment 2 (the one that should vary)
      if (compareBy === "rate") {
        synced.rate = prev.rate;
      } else if (compareBy === "amount") {
        synced.amount = prev.amount;
      } else if (compareBy === "years") {
        synced.years = prev.years;
      } else if (compareBy === "stepUpRate") {
        synced.stepUpRate = prev.stepUpRate;
      }
      return synced;
    });
  }, [investment1, compareBy, comparisonMode]);

  /**
   * Clear results when inputs change to prevent stale data display
   * Forces user to click "Compare" button after making changes
   */
  useEffect(() => {
    setResult1(null);
    setResult2(null);
  }, [investment1, investment2]);

  const handleCompare = () => {
    const inflation = parseFloat(inflationRate) / 100;
    const r1 = calculateInvestment(investment1, inflation);
    const r2 = calculateInvestment(investment2, inflation);
    setResult1(r1);
    setResult2(r2);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Compare Two Investments</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Compare SIP, Step-up SIP, and Lumpsum investments across different time periods and rates of return
      </p>

      {/* Comparison Mode Selector */}
      <Card className="rounded-none border-2 border-primary/20 mb-6">
        <CardHeader className="bg-muted/50 py-4">
          <CardTitle className="text-lg font-semibold uppercase tracking-wide">
            Comparison Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comparison-mode" className="text-sm font-medium">
                Comparison Mode
              </Label>
              <Select
                value={comparisonMode}
                onValueChange={(value: ComparisonMode) => setComparisonMode(value)}
              >
                <SelectTrigger id="comparison-mode" className="rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Compare by Single Parameter</SelectItem>
                  <SelectItem value="all">Compare by All Parameters</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {comparisonMode === "single" && (
              <div className="space-y-2">
                <Label htmlFor="compare-by" className="text-sm font-medium">
                  Compare By (only this parameter will vary)
                </Label>
                <Select
                  value={compareBy}
                  onValueChange={(value: CompareBy) => setCompareBy(value)}
                >
                  <SelectTrigger id="compare-by" className="rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rate">Expected Return Rate</SelectItem>
                    <SelectItem value="amount">Investment Amount</SelectItem>
                    <SelectItem value="years">Investment Period</SelectItem>
                    <SelectItem value="stepUpRate">Step-up Rate</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  All other parameters will be synchronized between both investments
                </p>
              </div>
            )}

            {comparisonMode === "all" && (
              <p className="text-xs text-muted-foreground">
                All parameters can be different between Investment 1 and Investment 2
              </p>
            )}

            <div className="space-y-2 max-w-sm">
              <Label htmlFor="inflation-rate" className="text-sm font-medium">
                Inflation Rate (% p.a.)
              </Label>
              <Input
                id="inflation-rate"
                type="number"
                step="0.1"
                value={inflationRate}
                onChange={(e) => setInflationRate(e.target.value)}
                onWheel={(e) => e.currentTarget.blur()}
                className="rounded-none"
              />
              <p className="text-xs text-muted-foreground">
                Used to calculate real (inflation-adjusted) returns
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <InvestmentPanel
          title="Investment 1"
          color="purple"
          inputs={investment1}
          setInputs={setInvestment1}
          compareBy={compareBy}
          comparisonMode={comparisonMode}
          isReference={true}
        />
        <InvestmentPanel
          title="Investment 2"
          color="green"
          inputs={investment2}
          setInputs={setInvestment2}
          compareBy={compareBy}
          comparisonMode={comparisonMode}
          isReference={false}
        />
      </div>

      {/* Compare Button */}
      <Button
        onClick={handleCompare}
        className="group relative w-full overflow-hidden rounded-none h-12 text-base mb-6"
      >
        <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <span className="relative">Compare Investments</span>
      </Button>

      {/* Results */}
      {result1 && result2 && <ComparisonResults result1={result1} result2={result2} />}
    </div>
  );
}
