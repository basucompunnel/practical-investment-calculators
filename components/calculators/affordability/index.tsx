"use client";

import { useState, useEffect } from "react";
import { TabSelector } from "@/components/common/TabSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import {
  LoanType,
  CarLoanResult,
  HomeLoanResult,
  PhoneLoanResult,
  EducationLoanResult,
  PersonalLoanResult,
  BikeLoanResult,
  YearlyBreakdown,
} from "./types";
import { DEFAULTS, CALCULATION_CONSTANTS, LOAN_TYPE_INFO, LOAN_TYPE_OPTIONS } from "./constants";
import { GenericSummaryCards } from "./GenericSummaryCards";
import { GenericPaymentBreakdown } from "./GenericPaymentBreakdown";
import { GenericYearlyBreakdown } from "./GenericYearlyBreakdown";

// Car Input Form Component
interface CarInputFormProps {
  carPrice: string;
  setCarPrice: (value: string) => void;
  loanPercentage: string;
  setLoanPercentage: (value: string) => void;
  interestRate: string;
  setInterestRate: (value: string) => void;
  loanTenure: string;
  setLoanTenure: (value: string) => void;
  onCalculate: () => void;
}

function CarInputForm({
  carPrice,
  setCarPrice,
  loanPercentage,
  setLoanPercentage,
  interestRate,
  setInterestRate,
  loanTenure,
  setLoanTenure,
  onCalculate,
}: CarInputFormProps) {
  return (
    <Card className="rounded-none border-2 border-primary/20">
      <CardHeader className="bg-muted/50 py-4">
        <CardTitle className="text-lg font-semibold uppercase tracking-wide">Car Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FormField
            id="carPrice"
            label="Price of Car (₹)"
            arrowStep={DEFAULTS.car.step}
            value={carPrice}
            onChange={setCarPrice}
          />
          <FormField
            id="loanPercentage"
            label="Loan Percentage (%)"
            step="1"
            arrowStep={CALCULATION_CONSTANTS.loanPercentageStep}
            value={loanPercentage}
            onChange={setLoanPercentage}
          />
          <FormField
            id="interestRate"
            label="Interest Rate (% p.a.)"
            step="0.1"
            arrowStep={CALCULATION_CONSTANTS.interestRateStep}
            value={interestRate}
            onChange={setInterestRate}
          />
          <FormField
            id="loanTenure"
            label="Loan Tenure (years)"
            arrowStep={CALCULATION_CONSTANTS.tenureStep}
            value={loanTenure}
            onChange={setLoanTenure}
          />
        </div>

        <Button
          onClick={onCalculate}
          className="group relative w-full overflow-hidden rounded-none h-12 text-base"
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative">Calculate</span>
        </Button>
      </CardContent>
    </Card>
  );
}

// Car Affordability Calculator Component
function CarAffordabilityCalculator() {
  const [carPrice, setCarPrice] = useState<string>(String(DEFAULTS.car.principal));
  const [loanPercentage, setLoanPercentage] = useState<string>(String(DEFAULTS.car.loanPercentage));
  const [interestRate, setInterestRate] = useState<string>(String(DEFAULTS.car.interestRate));
  const [loanTenure, setLoanTenure] = useState<string>(String(DEFAULTS.car.tenure));

  const [result, setResult] = useState<CarLoanResult | null>(null);

  // Reset results when inputs change
  useEffect(() => {
    setResult(null);
  }, [carPrice, loanPercentage, interestRate, loanTenure]);

  const calculateCarLoan = () => {
    const price = parseFloat(carPrice);
    const loanPercent = parseFloat(loanPercentage) / 100;
    const rate = parseFloat(interestRate) / 100;
    const tenure = parseFloat(loanTenure);

    const loanAmount = price * loanPercent;
    const downPayment = price - loanAmount;
    const monthlyRate = rate / 12;
    const months = tenure * 12;

    // EMI calculation: P Ã— r Ã— (1 + r)^n / [(1 + r)^n - 1]
    const monthlyEMI =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const totalPayable = monthlyEMI * months;
    const totalInterest = totalPayable - loanAmount;
    const totalCost = downPayment + totalPayable;

    // Suggested income range (EMI should be 40-50% of monthly income)
    const suggestedIncomeMin = monthlyEMI / DEFAULTS.car.incomeRatioAggressive; // Aggressive (50% of income)
    const suggestedIncomeMax = monthlyEMI / DEFAULTS.car.incomeRatioConservative; // Conservative (40% of income)

    // Year-by-year breakdown
    const yearlyBreakdown = [];
    let remainingBalance = loanAmount;

    for (let year = 1; year <= tenure; year++) {
      const openingBalance = remainingBalance;
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;

      // Process 12 monthly payments for this year
      for (let month = 1; month <= CALCULATION_CONSTANTS.monthsPerYear; month++) {
        // Interest is calculated on remaining balance
        const interestForMonth = remainingBalance * monthlyRate;
        // Remaining EMI amount goes to principal
        const principalForMonth = monthlyEMI - interestForMonth;

        yearlyInterest += interestForMonth;
        yearlyPrincipal += principalForMonth;
        remainingBalance -= principalForMonth;
      }

      yearlyBreakdown.push({
        year,
        openingBalance,
        principalPaid: yearlyPrincipal,
        interestPaid: yearlyInterest,
        closingBalance: Math.max(0, remainingBalance),
      });
    }

    setResult({
      carPrice: price,
      loanAmount,
      downPayment,
      suggestedIncomeMin,
      suggestedIncomeMax,
      monthlyEMI,
      totalInterest,
      totalPayable,
      totalCost,
      yearlyBreakdown,
    });
  };

  return (
    <>
      <CarInputForm
        carPrice={carPrice}
        setCarPrice={setCarPrice}
        loanPercentage={loanPercentage}
        setLoanPercentage={setLoanPercentage}
        interestRate={interestRate}
        setInterestRate={setInterestRate}
        loanTenure={loanTenure}
        setLoanTenure={setLoanTenure}
        onCalculate={calculateCarLoan}
      />

      {result && (
        <div className="space-y-6 mt-6">
          <GenericSummaryCards
            result={{
              ...result,
              itemPrice: result.carPrice,
              itemLabel: "Car Price",
            }}
            loanTenure={loanTenure}
            interestRate={interestRate}
          />
          <GenericPaymentBreakdown result={{ ...result, itemPrice: result.carPrice }} />
          <GenericYearlyBreakdown result={result} />
        </div>
      )}
    </>
  );
}

// Home Affordability Calculator Component
function HomeAffordabilityCalculator() {
  const [homePrice, setHomePrice] = useState<string>(String(DEFAULTS.home.principal));
  const [loanPercentage, setLoanPercentage] = useState<string>(String(DEFAULTS.home.loanPercentage));
  const [interestRate, setInterestRate] = useState<string>(String(DEFAULTS.home.interestRate));
  const [loanTenure, setLoanTenure] = useState<string>(String(DEFAULTS.home.tenure));
  const [result, setResult] = useState<HomeLoanResult | null>(null);

  useEffect(() => {
    setResult(null);
  }, [homePrice, loanPercentage, interestRate, loanTenure]);

  const calculateHomeLoan = () => {
    const price = parseFloat(homePrice);
    const loanPercent = parseFloat(loanPercentage) / 100;
    const rate = parseFloat(interestRate) / 100;
    const tenure = parseFloat(loanTenure);
    const loanAmount = price * loanPercent;
    const downPayment = price - loanAmount;
    const monthlyRate = rate / CALCULATION_CONSTANTS.monthsPerYear;
    const months = tenure * CALCULATION_CONSTANTS.monthsPerYear;
    const monthlyEMI =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayable = monthlyEMI * months;
    const totalInterest = totalPayable - loanAmount;
    const totalCost = downPayment + totalPayable;
    const suggestedIncomeMin = monthlyEMI / DEFAULTS.home.incomeRatioAggressive;
    const suggestedIncomeMax = monthlyEMI / DEFAULTS.home.incomeRatioConservative;
    const yearlyBreakdown = [];
    let remainingBalance = loanAmount;

    for (let year = 1; year <= tenure; year++) {
      const openingBalance = remainingBalance;
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      for (let month = 1; month <= CALCULATION_CONSTANTS.monthsPerYear; month++) {
        const interestForMonth = remainingBalance * monthlyRate;
        const principalForMonth = monthlyEMI - interestForMonth;
        yearlyInterest += interestForMonth;
        yearlyPrincipal += principalForMonth;
        remainingBalance -= principalForMonth;
      }
      yearlyBreakdown.push({
        year,
        openingBalance,
        principalPaid: yearlyPrincipal,
        interestPaid: yearlyInterest,
        closingBalance: Math.max(0, remainingBalance),
      });
    }

    setResult({
      homePrice: price,
      loanAmount,
      downPayment,
      suggestedIncomeMin,
      suggestedIncomeMax,
      monthlyEMI,
      totalInterest,
      totalPayable,
      totalCost,
      yearlyBreakdown,
    });
  };

  return (
    <>
      <Card className="rounded-none border-2 border-primary/20">
        <CardHeader className="bg-muted/50 py-4">
          <CardTitle className="text-lg font-semibold uppercase tracking-wide">Home Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FormField
              id="homePrice"
              label="Price of Home (₹)"
              arrowStep={DEFAULTS.home.step}
              value={homePrice}
              onChange={setHomePrice}
            />
            <FormField
              id="loanPercentage"
              label="Loan Percentage (%)"
              step="1"
              arrowStep={CALCULATION_CONSTANTS.loanPercentageStep}
              value={loanPercentage}
              onChange={setLoanPercentage}
            />
            <FormField
              id="interestRate"
              label="Interest Rate (% p.a.)"
              step="0.1"
              arrowStep={CALCULATION_CONSTANTS.interestRateStep}
              value={interestRate}
              onChange={setInterestRate}
            />
            <FormField
              id="loanTenure"
              label="Loan Tenure (years)"
              arrowStep={CALCULATION_CONSTANTS.tenureStep}
              value={loanTenure}
              onChange={setLoanTenure}
            />
          </div>
          <Button
            onClick={calculateHomeLoan}
            className="group relative w-full overflow-hidden rounded-none h-12 text-base"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Calculate</span>
          </Button>
        </CardContent>
      </Card>
      {result && (
        <div className="space-y-6 mt-6">
          <GenericSummaryCards
            result={{
              ...result,
              itemPrice: result.homePrice,
              itemLabel: "Home Price",
            }}
            loanTenure={loanTenure}
            interestRate={interestRate}
          />
          <GenericPaymentBreakdown result={{ ...result, itemPrice: result.homePrice }} />
          <GenericYearlyBreakdown result={result} />
        </div>
      )}
    </>
  );
}

// Phone Affordability Calculator Component
// Special handling: Supports 0% interest rate for promotional offers
function PhoneAffordabilityCalculator() {
  const [phonePrice, setPhonePrice] = useState<string>(String(DEFAULTS.phone.principal));
  const [loanPercentage, setLoanPercentage] = useState<string>(String(DEFAULTS.phone.loanPercentage));
  const [interestRate, setInterestRate] = useState<string>(String(DEFAULTS.phone.interestRate));
  const [loanTenure, setLoanTenure] = useState<string>(String(DEFAULTS.phone.tenure));
  const [result, setResult] = useState<PhoneLoanResult | null>(null);

  useEffect(() => {
    setResult(null);
  }, [phonePrice, loanPercentage, interestRate, loanTenure]);

  const calculatePhoneLoan = () => {
    const price = parseFloat(phonePrice);
    const loanPercent = parseFloat(loanPercentage) / 100;
    const rate = parseFloat(interestRate) / 100;
    const tenure = parseFloat(loanTenure);
    const loanAmount = price * loanPercent;
    const downPayment = price - loanAmount;
    const monthlyRate = rate / CALCULATION_CONSTANTS.monthsPerYear;
    const months = tenure * CALCULATION_CONSTANTS.monthsPerYear;
    let monthlyEMI;
    // Handle 0% interest promotional offers differently (simple division)
    if (rate === 0) {
      monthlyEMI = loanAmount / months;
    } else {
      // Standard EMI formula for interest-bearing loans
      monthlyEMI =
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    }
    const totalPayable = monthlyEMI * months;
    const totalInterest = totalPayable - loanAmount;
    const totalCost = downPayment + totalPayable;
    const suggestedIncomeMin = monthlyEMI / DEFAULTS.phone.incomeRatioAggressive;
    const suggestedIncomeMax = monthlyEMI / DEFAULTS.phone.incomeRatioConservative;
    const yearlyBreakdown = [];
    let remainingBalance = loanAmount;

    for (let year = 1; year <= tenure; year++) {
      const openingBalance = remainingBalance;
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      for (let month = 1; month <= CALCULATION_CONSTANTS.monthsPerYear; month++) {
        if (remainingBalance <= 0) break;
        const interestForMonth = remainingBalance * monthlyRate;
        const principalForMonth = monthlyEMI - interestForMonth;
        yearlyInterest += interestForMonth;
        yearlyPrincipal += principalForMonth;
        remainingBalance -= principalForMonth;
      }
      yearlyBreakdown.push({
        year,
        openingBalance,
        principalPaid: yearlyPrincipal,
        interestPaid: yearlyInterest,
        closingBalance: Math.max(0, remainingBalance),
      });
    }

    setResult({
      phonePrice: price,
      loanAmount,
      downPayment,
      suggestedIncomeMin,
      suggestedIncomeMax,
      monthlyEMI,
      totalInterest,
      totalPayable,
      totalCost,
      yearlyBreakdown,
    });
  };

  return (
    <>
      <Card className="rounded-none border-2 border-primary/20">
        <CardHeader className="bg-muted/50 py-4">
          <CardTitle className="text-lg font-semibold uppercase tracking-wide">Phone Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FormField
              id="phonePrice"
              label="Price of Phone (₹)"
              arrowStep={DEFAULTS.phone.step}
              value={phonePrice}
              onChange={setPhonePrice}
            />
            <FormField
              id="loanPercentage"
              label="Loan Percentage (%)"
              step="1"
              arrowStep={CALCULATION_CONSTANTS.loanPercentageStep}
              value={loanPercentage}
              onChange={setLoanPercentage}
            />
            <FormField
              id="interestRate"
              label="Interest Rate (% p.a.)"
              step="0.1"
              arrowStep={CALCULATION_CONSTANTS.interestRateStep}
              value={interestRate}
              onChange={setInterestRate}
            />
            <FormField
              id="loanTenure"
              label="Loan Tenure (years)"
              arrowStep={CALCULATION_CONSTANTS.tenureStep}
              value={loanTenure}
              onChange={setLoanTenure}
            />
          </div>
          <Button
            onClick={calculatePhoneLoan}
            className="group relative w-full overflow-hidden rounded-none h-12 text-base"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Calculate</span>
          </Button>
        </CardContent>
      </Card>
      {result && (
        <div className="space-y-6 mt-6">
          <GenericSummaryCards
            result={{
              ...result,
              itemPrice: result.phonePrice,
              itemLabel: "Phone Price",
            }}
            loanTenure={loanTenure}
            interestRate={interestRate}
          />
          <GenericPaymentBreakdown result={{ ...result, itemPrice: result.phonePrice }} />
          <GenericYearlyBreakdown result={result} />
        </div>
      )}
    </>
  );
}

// EducationLoanCalculator
function EducationLoanCalculator() {
  const [educationCost, setEducationCost] = useState<string>(String(DEFAULTS.education.principal));
  const [loanPercentage, setLoanPercentage] = useState<string>(String(DEFAULTS.education.loanPercentage));
  const [interestRate, setInterestRate] = useState<string>(String(DEFAULTS.education.interestRate));
  const [loanTenure, setLoanTenure] = useState<string>(String(DEFAULTS.education.tenure));
  const [result, setResult] = useState<EducationLoanResult | null>(null);

  useEffect(() => {
    setResult(null);
  }, [educationCost, loanPercentage, interestRate, loanTenure]);

  const calculateEducationLoan = () => {
    const price = parseFloat(educationCost);
    const loanPercent = parseFloat(loanPercentage) / 100;
    const rate = parseFloat(interestRate) / 100;
    const tenure = parseFloat(loanTenure);
    const loanAmount = price * loanPercent;
    const downPayment = price - loanAmount;
    const monthlyRate = rate / CALCULATION_CONSTANTS.monthsPerYear;
    const months = tenure * CALCULATION_CONSTANTS.monthsPerYear;
    const monthlyEMI =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayable = monthlyEMI * months;
    const totalInterest = totalPayable - loanAmount;
    const totalCost = downPayment + totalPayable;
    const suggestedIncomeMin = monthlyEMI / DEFAULTS.education.incomeRatioAggressive;
    const suggestedIncomeMax = monthlyEMI / DEFAULTS.education.incomeRatioConservative;
    const yearlyBreakdown = [];
    let remainingBalance = loanAmount;

    for (let year = 1; year <= tenure; year++) {
      const openingBalance = remainingBalance;
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      for (let month = 1; month <= CALCULATION_CONSTANTS.monthsPerYear; month++) {
        if (remainingBalance <= 0) break;
        const interestForMonth = remainingBalance * monthlyRate;
        const principalForMonth = monthlyEMI - interestForMonth;
        yearlyInterest += interestForMonth;
        yearlyPrincipal += principalForMonth;
        remainingBalance -= principalForMonth;
      }
      yearlyBreakdown.push({
        year,
        openingBalance,
        principalPaid: yearlyPrincipal,
        interestPaid: yearlyInterest,
        closingBalance: Math.max(0, remainingBalance),
      });
    }

    setResult({
      educationCost: price,
      loanAmount,
      downPayment,
      suggestedIncomeMin,
      suggestedIncomeMax,
      monthlyEMI,
      totalInterest,
      totalPayable,
      totalCost,
      yearlyBreakdown,
    });
  };

  return (
    <>
      <Card className="rounded-none border-2 border-primary/20">
        <CardHeader className="bg-muted/50 py-4">
          <CardTitle className="text-lg font-semibold uppercase tracking-wide">Education Loan Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FormField
              id="educationCost"
              label="Education Cost (₹)"
              arrowStep={DEFAULTS.education.step}
              value={educationCost}
              onChange={setEducationCost}
            />
            <FormField
              id="loanPercentage"
              label="Loan Percentage (%)"
              step="1"
              arrowStep={CALCULATION_CONSTANTS.loanPercentageStep}
              value={loanPercentage}
              onChange={setLoanPercentage}
            />
            <FormField
              id="interestRate"
              label="Interest Rate (% p.a.)"
              step="0.1"
              arrowStep={CALCULATION_CONSTANTS.interestRateStep}
              value={interestRate}
              onChange={setInterestRate}
            />
            <FormField
              id="loanTenure"
              label="Loan Tenure (years)"
              arrowStep={CALCULATION_CONSTANTS.tenureStep}
              value={loanTenure}
              onChange={setLoanTenure}
            />
          </div>
          <Button
            onClick={calculateEducationLoan}
            className="group relative w-full overflow-hidden rounded-none h-12 text-base"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Calculate</span>
          </Button>
        </CardContent>
      </Card>
      {result && (
        <div className="space-y-6 mt-6">
          <GenericSummaryCards
            result={{
              ...result,
              itemPrice: result.educationCost,
              itemLabel: "Education Cost",
            }}
            loanTenure={loanTenure}
            interestRate={interestRate}
          />
          <GenericPaymentBreakdown result={{ ...result, itemPrice: result.educationCost }} />
          <GenericYearlyBreakdown result={result} />
        </div>
      )}
    </>
  );
}

// Personal Loan Calculator Component
// Note: No down payment - full amount is borrowed
function PersonalLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<string>(String(DEFAULTS.personal.principal));
  const [interestRate, setInterestRate] = useState<string>(String(DEFAULTS.personal.interestRate));
  const [loanTenure, setLoanTenure] = useState<string>(String(DEFAULTS.personal.tenure));
  const [result, setResult] = useState<PersonalLoanResult | null>(null);

  useEffect(() => {
    setResult(null);
  }, [loanAmount, interestRate, loanTenure]);

  const calculatePersonalLoan = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100;
    const tenure = parseFloat(loanTenure);
    const monthlyRate = rate / CALCULATION_CONSTANTS.monthsPerYear;
    const months = tenure * CALCULATION_CONSTANTS.monthsPerYear;
    const monthlyEMI =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayable = monthlyEMI * months;
    const totalInterest = totalPayable - principal;
    const suggestedIncomeMin = monthlyEMI / DEFAULTS.personal.incomeRatioAggressive;
    const suggestedIncomeMax = monthlyEMI / DEFAULTS.personal.incomeRatioConservative;
    const yearlyBreakdown = [];
    let remainingBalance = principal;

    for (let year = 1; year <= tenure; year++) {
      const openingBalance = remainingBalance;
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      for (let month = 1; month <= CALCULATION_CONSTANTS.monthsPerYear; month++) {
        if (remainingBalance <= 0) break;
        const interestForMonth = remainingBalance * monthlyRate;
        const principalForMonth = monthlyEMI - interestForMonth;
        yearlyInterest += interestForMonth;
        yearlyPrincipal += principalForMonth;
        remainingBalance -= principalForMonth;
      }
      yearlyBreakdown.push({
        year,
        openingBalance,
        principalPaid: yearlyPrincipal,
        interestPaid: yearlyInterest,
        closingBalance: Math.max(0, remainingBalance),
      });
    }

    setResult({
      loanAmount: principal,
      suggestedIncomeMin,
      suggestedIncomeMax,
      monthlyEMI,
      totalInterest,
      totalPayable,
      yearlyBreakdown,
    });
  };

  return (
    <>
      <Card className="rounded-none border-2 border-primary/20">
        <CardHeader className="bg-muted/50 py-4">
          <CardTitle className="text-lg font-semibold uppercase tracking-wide">Personal Loan Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              id="loanAmount"
              label="Loan Amount (₹)"
              arrowStep={DEFAULTS.personal.step}
              value={loanAmount}
              onChange={setLoanAmount}
            />
            <FormField
              id="interestRate"
              label="Interest Rate (% p.a.)"
              step="0.1"
              arrowStep={CALCULATION_CONSTANTS.interestRateStep}
              value={interestRate}
              onChange={setInterestRate}
            />
            <FormField
              id="loanTenure"
              label="Loan Tenure (years)"
              arrowStep={CALCULATION_CONSTANTS.tenureStep}
              value={loanTenure}
              onChange={setLoanTenure}
            />
          </div>
          <Button
            onClick={calculatePersonalLoan}
            className="group relative w-full overflow-hidden rounded-none h-12 text-base"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Calculate</span>
          </Button>
        </CardContent>
      </Card>
      {result && (
        <div className="space-y-6 mt-6">
          <GenericSummaryCards
            result={result}
            loanTenure={loanTenure}
            interestRate={interestRate}
          />
          <GenericPaymentBreakdown result={result} />
          <GenericYearlyBreakdown result={result} />
        </div>
      )}
    </>
  );
}

// Two-Wheeler (Bike) Loan Calculator Component
function BikeLoanCalculator() {
  const [bikePrice, setBikePrice] = useState<string>(String(DEFAULTS.bike.principal));
  const [loanPercentage, setLoanPercentage] = useState<string>(String(DEFAULTS.bike.loanPercentage));
  const [interestRate, setInterestRate] = useState<string>(String(DEFAULTS.bike.interestRate));
  const [loanTenure, setLoanTenure] = useState<string>(String(DEFAULTS.bike.tenure));
  const [result, setResult] = useState<BikeLoanResult | null>(null);

  useEffect(() => {
    setResult(null);
  }, [bikePrice, loanPercentage, interestRate, loanTenure]);

  const calculateBikeLoan = () => {
    const price = parseFloat(bikePrice);
    const loanPercent = parseFloat(loanPercentage) / 100;
    const rate = parseFloat(interestRate) / 100;
    const tenure = parseFloat(loanTenure);
    const loanAmount = price * loanPercent;
    const downPayment = price - loanAmount;
    const monthlyRate = rate / CALCULATION_CONSTANTS.monthsPerYear;
    const months = tenure * CALCULATION_CONSTANTS.monthsPerYear;
    const monthlyEMI =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayable = monthlyEMI * months;
    const totalInterest = totalPayable - loanAmount;
    const totalCost = downPayment + totalPayable;
    const suggestedIncomeMin = monthlyEMI / DEFAULTS.bike.incomeRatioAggressive;
    const suggestedIncomeMax = monthlyEMI / DEFAULTS.bike.incomeRatioConservative;
    const yearlyBreakdown = [];
    let remainingBalance = loanAmount;

    for (let year = 1; year <= tenure; year++) {
      const openingBalance = remainingBalance;
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      for (let month = 1; month <= CALCULATION_CONSTANTS.monthsPerYear; month++) {
        if (remainingBalance <= 0) break;
        const interestForMonth = remainingBalance * monthlyRate;
        const principalForMonth = monthlyEMI - interestForMonth;
        yearlyInterest += interestForMonth;
        yearlyPrincipal += principalForMonth;
        remainingBalance -= principalForMonth;
      }
      yearlyBreakdown.push({
        year,
        openingBalance,
        principalPaid: yearlyPrincipal,
        interestPaid: yearlyInterest,
        closingBalance: Math.max(0, remainingBalance),
      });
    }

    setResult({
      bikePrice: price,
      loanAmount,
      downPayment,
      suggestedIncomeMin,
      suggestedIncomeMax,
      monthlyEMI,
      totalInterest,
      totalPayable,
      totalCost,
      yearlyBreakdown,
    });
  };

  return (
    <>
      <Card className="rounded-none border-2 border-primary/20">
        <CardHeader className="bg-muted/50 py-4">
          <CardTitle className="text-lg font-semibold uppercase tracking-wide">Two-Wheeler Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FormField
              id="bikePrice"
              label="Price of Bike (₹)"
              arrowStep={DEFAULTS.bike.step}
              value={bikePrice}
              onChange={setBikePrice}
            />
            <FormField
              id="loanPercentage"
              label="Loan Percentage (%)"
              step="1"
              arrowStep={CALCULATION_CONSTANTS.loanPercentageStep}
              value={loanPercentage}
              onChange={setLoanPercentage}
            />
            <FormField
              id="interestRate"
              label="Interest Rate (% p.a.)"
              step="0.1"
              arrowStep={CALCULATION_CONSTANTS.interestRateStep}
              value={interestRate}
              onChange={setInterestRate}
            />
            <FormField
              id="loanTenure"
              label="Loan Tenure (years)"
              arrowStep={CALCULATION_CONSTANTS.tenureStep}
              value={loanTenure}
              onChange={setLoanTenure}
            />
          </div>
          <Button
            onClick={calculateBikeLoan}
            className="group relative w-full overflow-hidden rounded-none h-12 text-base"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Calculate</span>
          </Button>
        </CardContent>
      </Card>
      {result && (
        <div className="space-y-6 mt-6">
          <GenericSummaryCards
            result={{
              ...result,
              itemPrice: result.bikePrice,
              itemLabel: "Bike Price",
            }}
            loanTenure={loanTenure}
            interestRate={interestRate}
          />
          <GenericPaymentBreakdown result={{ ...result, itemPrice: result.bikePrice }} />
          <GenericYearlyBreakdown result={result} />
        </div>
      )}
    </>
  );
}

export default function AffordabilityCalculator() {
  const [selectedType, setSelectedType] = useState<LoanType>("home");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Affordability Calculator</h1>

      {/* Loan Type Tabs */}
      <div className="mb-8">
        <TabSelector
          options={LOAN_TYPE_OPTIONS}
          selected={selectedType}
          onChange={(value) => setSelectedType(value as LoanType)}
          columns={3}
        />
      </div>

      <p className="text-muted-foreground mb-8 text-lg">
        {LOAN_TYPE_INFO[selectedType].description}
      </p>

      {selectedType === "car" && <CarAffordabilityCalculator />}
      {selectedType === "home" && <HomeAffordabilityCalculator />}
      {selectedType === "phone" && <PhoneAffordabilityCalculator />}
      {selectedType === "education" && <EducationLoanCalculator />}
      {selectedType === "personal" && <PersonalLoanCalculator />}
      {selectedType === "bike" && <BikeLoanCalculator />}
    </div>
  );
}
