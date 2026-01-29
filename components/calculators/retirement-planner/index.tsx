"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { RetirementResult } from "./types";
import { DEFAULTS, STEPS } from "./constants";
import { SummaryCards } from "./SummaryCards";
import { AccumulationPhaseChart } from "./AccumulationPhaseChart";
import { PostRetirementChart } from "./PostRetirementChart";

/**
 * Retirement Planner Calculator
 * 
 * A comprehensive retirement planning tool that calculates:
 * 1. Required retirement corpus based on current expenses and inflation
 * 2. Monthly SIP needed to accumulate the corpus
 * 3. Year-by-year wealth accumulation projections
 * 4. Post-retirement withdrawal sustainability analysis
 * 
 * Key Features:
 * - Inflation-adjusted expense projections
 * - Dual return rates (pre and post-retirement)
 * - Real value calculations (today's money equivalent)
 * - Accounts for existing savings
 * - Detailed year-by-year breakdowns for both phases
 * 
 * Methodology:
 * - Uses annuity due formula for retirement corpus calculation
 * - Accounts for different investment strategies pre vs post-retirement
 * - Shows both nominal (future) and real (inflation-adjusted) values
 * - Validates corpus sustainability through life expectancy
 */
export default function RetirementPlanner() {
  // User input state - all stored as strings for form field compatibility
  const [currentAge, setCurrentAge] = useState<string>(String(DEFAULTS.currentAge));
  const [retirementAge, setRetirementAge] = useState<string>(String(DEFAULTS.retirementAge));
  const [lifeExpectancy, setLifeExpectancy] = useState<string>(String(DEFAULTS.lifeExpectancy));
  const [currentMonthlyExpenses, setCurrentMonthlyExpenses] = useState<string>(
    String(DEFAULTS.currentMonthlyExpenses)
  );
  const [inflationRate, setInflationRate] = useState<string>(String(DEFAULTS.inflationRate));
  const [preRetirementReturn, setPreRetirementReturn] = useState<string>(
    String(DEFAULTS.preRetirementReturn)
  );
  const [postRetirementReturn, setPostRetirementReturn] = useState<string>(
    String(DEFAULTS.postRetirementReturn)
  );
  const [currentSavings, setCurrentSavings] = useState<string>(String(DEFAULTS.currentSavings));

  // Calculation results - null until user clicks calculate
  const [result, setResult] = useState<RetirementResult | null>(null);

  // Reset results when any input changes to prompt recalculation
  useEffect(() => {
    setResult(null);
  }, [
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentMonthlyExpenses,
    inflationRate,
    preRetirementReturn,
    postRetirementReturn,
    currentSavings,
  ]);

  /**
   * Main retirement calculation function
   * 
   * Performs comprehensive retirement planning calculations in several steps:
   * 1. Calculate inflation-adjusted expenses at retirement
   * 2. Calculate required retirement corpus using annuity formula
   * 3. Account for existing savings growth
   * 4. Calculate monthly SIP needed to bridge the gap
   * 5. Build year-by-year accumulation projections
   * 6. Build year-by-year withdrawal sustainability analysis
   * 
   * All calculations consider both nominal (future value) and real (today's value)
   * perspectives to help users understand purchasing power.
   */
  const calculateRetirement = () => {
    // Parse all input values
    const age = parseFloat(currentAge);
    const retAge = parseFloat(retirementAge);
    const lifeExp = parseFloat(lifeExpectancy);
    const monthlyExp = parseFloat(currentMonthlyExpenses);
    const inflation = parseFloat(inflationRate) / 100;
    const preRetRate = parseFloat(preRetirementReturn) / 100;
    const postRetRate = parseFloat(postRetirementReturn) / 100;
    const savings = parseFloat(currentSavings);

    // Calculate planning horizons
    const yearsToRetirement = retAge - age;  // Accumulation phase duration
    const yearsInRetirement = lifeExp - retAge;  // Withdrawal phase duration

    // Step 1: Calculate inflation-adjusted monthly expenses at retirement
    // Future expenses = Current expenses × (1 + inflation)^years
    const inflationAdjustedExpenses = monthlyExp * Math.pow(1 + inflation, yearsToRetirement);
    const annualExpensesAtRetirement = inflationAdjustedExpenses * 12;

    // Step 2: Calculate required retirement corpus using annuity due formula
    // Annuity Due: PV = PMT × [(1 - (1 + r)^-n) / r] × (1 + r)
    // Where:
    // - PV = Present Value (required corpus at retirement)
    // - PMT = Annual payment (inflation-adjusted annual expenses)
    // - r = Real return rate (post-retirement return adjusted for inflation)
    // - n = Number of years in retirement
    // Annuity due is used because expenses are withdrawn at the beginning of each year
    const realReturnRate = (1 + postRetRate) / (1 + inflation) - 1;
    const requiredCorpus =
      annualExpensesAtRetirement * ((1 - Math.pow(1 + realReturnRate, -yearsInRetirement)) / realReturnRate) * (1 + realReturnRate);

    // Step 3: Calculate future value of current savings at retirement
    // FV = PV × (1 + r)^n
    const futureValueOfSavings = savings * Math.pow(1 + preRetRate, yearsToRetirement);

    // Step 4: Adjust required corpus for existing savings
    // Only need to accumulate the difference between required and projected savings
    const corpusNeeded = Math.max(0, requiredCorpus - futureValueOfSavings);

    // Step 5: Calculate monthly SIP needed using future value of annuity due formula
    // FV = PMT × [((1 + r)^n - 1) / r] × (1 + r)
    // Rearranged: PMT = FV / [((1 + r)^n - 1) / r] × (1 + r)
    // SIP is assumed to be made at the beginning of each month (annuity due)
    const monthlyRate = preRetRate / 12;
    const months = yearsToRetirement * 12;
    const monthlyInvestmentNeeded =
      corpusNeeded / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));

    const totalInvestment = monthlyInvestmentNeeded * months + savings;
    const totalReturns = requiredCorpus - totalInvestment;

    // Calculate real (inflation-adjusted) value of required corpus
    // Shows what the corpus is worth in today's purchasing power
    const inflationFactorAtRetirement = Math.pow(1 + inflation, yearsToRetirement);
    const requiredCorpusReal = requiredCorpus / inflationFactorAtRetirement;
    const currentExpensesEquivalent = monthlyExp;

    // Step 6: Build year-by-year wealth accumulation projections
    // Shows how corpus grows from current age to retirement through:
    // - Annual SIP contributions
    // - Compound growth at pre-retirement return rate
    // - Both nominal (future) and real (today's) value perspectives
    const yearlyBreakdown = [];
    let corpusValue = savings;  // Start with existing savings
    let totalInvested = savings;  // Track cumulative investment

    for (let year = 1; year <= yearsToRetirement; year++) {
      const yearlyInvestment = monthlyInvestmentNeeded * 12;
      totalInvested += yearlyInvestment;

      // Simplified annual calculation:
      // Add year's investment, then apply full year's growth
      // Assumes investments made at beginning of year (conservative estimate)
      corpusValue = (corpusValue + yearlyInvestment) * (1 + preRetRate);

      // Calculate real (inflation-adjusted) values
      const inflationFactor = Math.pow(1 + inflation, year);
      const corpusValueReal = corpusValue / inflationFactor;
      const totalInvestedReal = totalInvested / inflationFactor;

      yearlyBreakdown.push({
        year,
        age: age + year,
        invested: yearlyInvestment,
        corpusValue,
        corpusValueReal,
        totalInvested,
        totalInvestedReal,
      });
    }

    // Step 7: Build post-retirement withdrawal sustainability analysis
    // Shows year-by-year corpus depletion through:
    // - Annual expense withdrawals (growing with inflation)
    // - Portfolio growth on remaining balance
    // - Both nominal and real value tracking
    // Goal: Corpus should last through life expectancy
    const postRetirementBreakdown = [];
    let remainingCorpus = requiredCorpus;  // Start with full corpus at retirement
    let currentAnnualExpense = annualExpensesAtRetirement;  // First year's expense

    for (let year = 1; year <= yearsInRetirement; year++) {
      const openingBalance = remainingCorpus;
      
      // Withdraw needed amount (or remaining balance if insufficient)
      // Expenses grow with inflation each year
      const withdrawal = openingBalance > 0 ? Math.min(currentAnnualExpense, openingBalance) : 0;
      const balanceAfterWithdrawal = Math.max(0, openingBalance - withdrawal);
      const growthOnBalance = balanceAfterWithdrawal * postRetRate;
      const closingBalance = balanceAfterWithdrawal + growthOnBalance;

      // Calculate real (inflation-adjusted) values
      const inflationFactor = Math.pow(1 + inflation, yearsToRetirement + year);
      const openingBalanceReal = openingBalance / inflationFactor;
      const withdrawalReal = withdrawal / inflationFactor;
      const closingBalanceReal = closingBalance / inflationFactor;

      postRetirementBreakdown.push({
        year,
        age: retAge + year,
        openingBalance: Math.max(0, openingBalance),
        openingBalanceReal: Math.max(0, openingBalanceReal),
        withdrawal,
        withdrawalReal,
        growthOnBalance,
        closingBalance,
        closingBalanceReal,
      });

      remainingCorpus = closingBalance;
      currentAnnualExpense = currentAnnualExpense * (1 + inflation);
    }

    setResult({
      requiredCorpus,
      requiredCorpusReal,
      currentAge: age,
      retirementAge: retAge,
      yearsToRetirement,
      monthlyInvestmentNeeded,
      totalInvestment,
      totalReturns,
      inflationAdjustedExpenses,
      currentExpensesEquivalent,
      yearlyBreakdown,
      postRetirementBreakdown,
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Retirement Planner</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Plan your retirement corpus and calculate monthly savings needed to achieve your goals
      </p>

      {/* Input Form */}
      <Card className="rounded-none border-2 border-primary/20 mb-6">
        <CardHeader className="bg-muted/50 py-4">
          <CardTitle className="text-lg font-semibold uppercase tracking-wide">Your Retirement Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FormField
              id="currentAge"
              label="Current Age (years)"
              arrowStep={STEPS.age}
              value={currentAge}
              onChange={setCurrentAge}
            />
            <FormField
              id="retirementAge"
              label="Retirement Age (years)"
              arrowStep={STEPS.age}
              value={retirementAge}
              onChange={setRetirementAge}
            />
            <FormField
              id="lifeExpectancy"
              label="Life Expectancy (years)"
              arrowStep={STEPS.age}
              value={lifeExpectancy}
              onChange={setLifeExpectancy}
            />
            <FormField
              id="currentMonthlyExpenses"
              label="Current Monthly Expenses (₹)"
              arrowStep={STEPS.expenses}
              value={currentMonthlyExpenses}
              onChange={setCurrentMonthlyExpenses}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FormField
              id="inflationRate"
              label="Inflation Rate (% p.a.)"
              step="0.1"
              arrowStep={STEPS.rate}
              value={inflationRate}
              onChange={setInflationRate}
            />
            <FormField
              id="preRetirementReturn"
              label="Pre-Retirement Return (% p.a.)"
              step="0.1"
              arrowStep={STEPS.rate}
              value={preRetirementReturn}
              onChange={setPreRetirementReturn}
            />
            <FormField
              id="postRetirementReturn"
              label="Post-Retirement Return (% p.a.)"
              step="0.1"
              arrowStep={STEPS.rate}
              value={postRetirementReturn}
              onChange={setPostRetirementReturn}
            />
            <FormField
              id="currentSavings"
              label="Current Savings (₹)"
              arrowStep={STEPS.savings}
              value={currentSavings}
              onChange={setCurrentSavings}
            />
          </div>

          <Button
            onClick={calculateRetirement}
            className="group relative w-full overflow-hidden rounded-none h-12 text-base"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Calculate Retirement Plan</span>
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          <SummaryCards result={result} />
          <AccumulationPhaseChart result={result} />
          <PostRetirementChart result={result} />
        </div>
      )}
    </div>
  );
}
