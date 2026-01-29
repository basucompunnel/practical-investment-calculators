# Practical Investment Calculators

A comprehensive suite of **financial planning and investment calculators** built with modern web technologies. This project demonstrates full-stack development skills, complex financial calculations, data visualization, and responsive UI/UX design.

## 🎯 Project Overview

A production-ready web application that helps users make informed financial decisions through interactive calculators for retirement planning, investment comparison, loan affordability, and goal-based investing.

## ✨ Key Features

### Financial Calculators
- **Goal-based Planner** - Calculate SIP/lumpsum investments needed to reach financial goals with multiple investment options (PPF, FD, Mutual Funds, Stocks)
- **Retirement Planner** - Comprehensive retirement corpus calculator with inflation adjustment, dual-phase analysis (accumulation + withdrawal), and year-by-year projections
- **Investment Comparison** - Compare returns across 10+ investment types including equity, debt, gold, real estate with detailed breakdowns
- **Two Investment Comparison** - Head-to-head comparison with IRR, XIRR, and inflation-adjusted returns
- **Loan Affordability Calculator** - Calculate affordability for car, home, personal, and phone loans based on income and existing obligations
- **EMI Split Calculator** - Analyze rent vs own-pocket EMI payment scenarios

### Technical Highlights
- **Modular Architecture** - Components split into reusable, well-documented modules (types, constants, utils, UI components)
- **Complex Financial Calculations** - Implements annuity formulas, compound interest, IRR/XIRR, inflation adjustment, and time-value of money concepts
- **Interactive Data Visualization** - Line charts, bar charts, area charts, and data tables using Recharts
- **Responsive Design** - Mobile-first approach with Tailwind CSS, works seamlessly on all devices
- **Type Safety** - Full TypeScript implementation with strict typing
- **SEO Optimized** - Meta tags, semantic HTML, and Next.js metadata API
- **Accessible Forms** - Keyboard navigation, arrow key controls, proper ARIA labels

## 🛠️ Tech Stack

**Frontend Framework**
- Next.js 14+ (App Router)
- React 18+
- TypeScript

**Styling**
- Tailwind CSS
- Shadcn/ui Component Library
- Custom themed components

**Data Visualization**
- Recharts (line, bar, area charts)
- Custom data tables with formatting

**Development**
- ESLint for code quality
- Modular component architecture
- JSDoc documentation

## 📊 Technical Implementations

### Financial Formulas Implemented
- **Compound Interest**: `FV = PV × (1 + r)^n`
- **SIP Future Value**: `FV = PMT × [((1 + r)^n - 1) / r] × (1 + r)`
- **Annuity Due**: `PV = PMT × [(1 - (1 + r)^-n) / r] × (1 + r)`
- **IRR/XIRR**: Internal rate of return calculations
- **Inflation Adjustment**: Real vs nominal value calculations

### Code Organization
```
components/
├── calculators/
│   ├── retirement-planner/
│   │   ├── types.ts              # TypeScript interfaces
│   │   ├── constants.ts          # Configuration & defaults
│   │   ├── utils.ts              # Calculation utilities
│   │   ├── SummaryCards.tsx      # UI components
│   │   ├── AccumulationPhaseChart.tsx
│   │   ├── PostRetirementChart.tsx
│   │   └── index.tsx             # Main component
│   └── [other calculators...]
├── common/                        # Shared components
│   ├── DataTable.tsx             # Generic data table
│   ├── FormField.tsx             # Enhanced input fields
│   ├── TabSelector.tsx           # Tab navigation
│   └── SummaryDataPoint.tsx      # Metric display
└── ui/                            # Shadcn/ui primitives
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 💡 Skills Demonstrated

- **Frontend Development**: React, Next.js, TypeScript
- **UI/UX Design**: Responsive layouts, interactive forms, data visualization
- **Financial Domain Knowledge**: Investment calculations, loan amortization, retirement planning
- **Code Architecture**: Modular design, separation of concerns, reusable components
- **Documentation**: Comprehensive JSDoc comments, clear code structure
- **Performance**: Optimized rendering, code splitting, efficient calculations
- **Best Practices**: Type safety, accessibility, SEO optimization

## 📝 License

MIT License - feel free to use this project as a portfolio reference.

---

**Built with ❤️ using Next.js and TypeScript**
